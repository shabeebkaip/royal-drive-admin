import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { CheckCircle, PlusCircle, AlertCircle, Loader2, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";

type SyncEvent =
  | { type: "fetch"; message: string }
  | { type: "start"; total: number; message: string }
  | { type: "vehicle"; current: number; total: number; action: "created" | "updated" | "skipped"; name: string; year: number; price: number | null; status: string }
  | { type: "error"; current: number; total: number; name: string; error: string }
  | { type: "done"; created: number; updated: number; skipped: number; total: number; errors: number };

interface LogLine {
  id: number;
  event: SyncEvent;
}

interface Props {
  open: boolean;
  token: string;
  apiBase: string;
  onClose: () => void;
  onComplete: (result: { created: number; updated: number; total: number }) => void;
}

const formatPrice = (p: number | null) =>
  p != null ? `$${p.toLocaleString("en-CA")}` : "";

export function SyncProgressDialog({ open, token, apiBase, onClose, onComplete }: Props) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState<{ created: number; updated: number; skipped: number; errors: number } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  const addLine = (event: SyncEvent) => {
    counterRef.current += 1;
    setLines(prev => [...prev, { id: counterRef.current, event }]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (!open) {
      setLines([]);
      setTotal(0);
      setCurrent(0);
      setDone(false);
      setSummary(null);
      counterRef.current = 0;
      return;
    }

    // Connect to SSE stream
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${apiBase}/edealer/sync/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!res.ok || !res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.replace(/^data: /, "").trim();
            if (!line) continue;
            try {
              const event: SyncEvent = JSON.parse(line);
              addLine(event);

              if (event.type === "start") setTotal(event.total);
              if (event.type === "vehicle" || event.type === "error") setCurrent(event.current);
              if (event.type === "done") {
                setDone(true);
                setSummary({ created: event.created, updated: event.updated, skipped: event.skipped, errors: event.errors });
                onComplete({ created: event.created, updated: event.updated, total: event.total });
              }
            } catch { /* ignore parse errors */ }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          addLine({ type: "error", current: 0, total: 0, name: "Connection", error: "Stream disconnected" });
          setDone(true);
        }
      }
    })();

    return () => controller.abort();
  }, [open]);

  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={done ? onClose : undefined}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden" onInteractOutside={e => { if (!done) e.preventDefault(); }}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Zap className="w-4 h-4 text-blue-600" />
            EDealer Sync
            {!done && <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-1" />}
            {done && <Badge variant="outline" className="text-emerald-600 border-emerald-300 ml-1">Complete</Badge>}
          </DialogTitle>

          {total > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{done ? "Finished" : `Processing ${current} of ${total} vehicles`}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </DialogHeader>

        {/* Live log */}
        <div
          ref={logRef}
          className="h-[380px] overflow-y-auto px-4 py-3 space-y-0.5 bg-gray-950 font-mono text-xs"
        >
          {lines.map(({ id, event }) => {
            if (event.type === "fetch") {
              return (
                <div key={id} className="text-gray-400 flex items-center gap-2 py-0.5">
                  <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                  {event.message}
                </div>
              );
            }
            if (event.type === "start") {
              return (
                <div key={id} className="text-blue-400 py-1 border-b border-gray-800 mb-1">
                  ✦ {event.message}
                </div>
              );
            }
            if (event.type === "vehicle") {
              const isNew = event.action === "created";
              return (
                <div key={id} className="flex items-center gap-2 py-0.5 group">
                  {isNew
                    ? <PlusCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    : <CheckCircle className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                  <span className={isNew ? "text-emerald-300" : "text-gray-400"}>
                    <span className="text-gray-600 mr-1.5">{String(event.current).padStart(3, "0")}.</span>
                    <span className={isNew ? "text-emerald-300 font-medium" : "text-gray-300"}>
                      {event.year} {event.name}
                    </span>
                    {event.price && (
                      <span className="text-gray-500 ml-1.5">{formatPrice(event.price)}</span>
                    )}
                    <span className={`ml-2 text-[10px] uppercase tracking-wider ${isNew ? "text-emerald-500" : "text-gray-600"}`}>
                      {event.action}
                    </span>
                  </span>
                </div>
              );
            }
            if (event.type === "error") {
              return (
                <div key={id} className="flex items-start gap-2 py-0.5 text-red-400">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="text-gray-600 mr-1.5">{String(event.current).padStart(3, "0")}.</span>
                    {event.name} — <span className="text-red-500">{event.error}</span>
                  </span>
                </div>
              );
            }
            if (event.type === "done") {
              return (
                <div key={id} className="mt-2 pt-2 border-t border-gray-800 text-gray-300 space-y-0.5">
                  <div className="text-emerald-400 font-medium">✓ Sync complete</div>
                  <div><span className="text-emerald-400">{event.created}</span> created · <span className="text-blue-400">{event.updated}</span> updated · <span className="text-gray-500">{event.skipped}</span> skipped</div>
                  {event.errors > 0 && <div className="text-red-400">{event.errors} errors</div>}
                </div>
              );
            }
            return null;
          })}

          {!done && lines.length === 0 && (
            <div className="text-gray-600 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting to EDealer…
            </div>
          )}
        </div>

        {/* Summary footer */}
        {done && summary && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-600 font-semibold">+{summary.created} added</span>
              <span className="text-blue-600 font-semibold">↻ {summary.updated} updated</span>
              {summary.skipped > 0 && <span className="text-gray-500">{summary.skipped} skipped</span>}
              {summary.errors > 0 && <span className="text-red-500">{summary.errors} errors</span>}
            </div>
            <Button size="sm" onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
