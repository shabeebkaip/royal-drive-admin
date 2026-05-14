import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import {
  CheckCircle2,
  PlusCircle,
  AlertCircle,
  Loader2,
  Zap,
  LogIn,
  Download,
  Database,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

type SyncEvent =
  | { type: "step";    step: number; message: string; status: "running" | "done" | "error" }
  | { type: "page";    page: number; fetched: number; total: number | null }
  | { type: "start";   total: number; message: string }
  | { type: "vehicle"; current: number; total: number; action: "created" | "updated" | "skipped"; name: string; year: number; price: number | null; status: string }
  | { type: "error";   current: number; total: number; name: string; error: string }
  | { type: "done";    created: number; updated: number; skipped: number; total: number; errors: number };

interface LogLine { id: number; event: SyncEvent }

interface Props {
  open: boolean;
  token: string;
  apiBase: string;
  onClose: () => void;
  onComplete: (result: { created: number; updated: number; total: number }) => void;
}

const fmt = (p: number | null) =>
  p != null ? `$${p.toLocaleString("en-CA")}` : "";

const STEP_ICONS = [LogIn, Download, Database];

export function SyncProgressDialog({ open, token, apiBase, onClose, onComplete }: Props) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [steps, setSteps] = useState<Map<number, { message: string; status: string }>>(new Map());
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

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [lines, steps]);

  useEffect(() => {
    if (!open) {
      setLines([]); setSteps(new Map()); setTotal(0); setCurrent(0);
      setDone(false); setSummary(null); counterRef.current = 0;
      return;
    }

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

              if (event.type === "step") {
                setSteps(prev => new Map(prev).set(event.step, { message: event.message, status: event.status }));
              } else if (event.type === "page") {
                addLine(event);
              } else if (event.type === "start") {
                setTotal(event.total);
                addLine(event);
              } else if (event.type === "vehicle" || event.type === "error") {
                setCurrent(event.current);
                addLine(event);
              } else if (event.type === "done") {
                setDone(true);
                setSummary({ created: event.created, updated: event.updated, skipped: event.skipped, errors: event.errors });
                onComplete({ created: event.created, updated: event.updated, total: event.total });
              }
            } catch { /* ignore */ }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setDone(true);
        }
      }
    })();
    return () => controller.abort();
  }, [open]);

  const progress = total > 0 ? Math.round((current / total) * 100) : 0;
  const stepEntries = Array.from(steps.entries()).sort(([a], [b]) => a - b);

  return (
    <Dialog open={open} onOpenChange={done ? onClose : undefined}>
      <DialogContent
        className="max-w-3xl w-[90vw] p-0 overflow-hidden flex flex-col"
        style={{ maxHeight: "85vh" }}
        onInteractOutside={e => { if (!done) e.preventDefault(); }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Zap className="w-4 h-4 text-blue-600" />
            EDealer Sync
            {!done
              ? <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-1" />
              : <Badge variant="outline" className="text-emerald-600 border-emerald-300 ml-1">Complete</Badge>
            }
          </DialogTitle>

          {/* Step tracker */}
          {stepEntries.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {stepEntries.map(([step, { message, status }]) => {
                const Icon = STEP_ICONS[step - 1] ?? ChevronRight;
                return (
                  <div key={step} className="flex items-center gap-2.5 text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'done' ? 'bg-emerald-100 text-emerald-600' :
                      status === 'running' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {status === 'running'
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : status === 'done'
                          ? <CheckCircle2 className="w-3 h-3" />
                          : <AlertCircle className="w-3 h-3" />
                      }
                    </div>
                    <span className={
                      status === 'done' ? 'text-emerald-700 font-medium' :
                      status === 'running' ? 'text-blue-700 font-medium' :
                      'text-red-600'
                    }>
                      Step {step}: {message}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{done ? "Complete" : `${current} of ${total} vehicles`}</span>
                <span>{progress}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full bg-blue-600 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Live log */}
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 bg-gray-950 font-mono text-xs min-h-0"
        >
          {lines.map(({ id, event }) => {
            if (event.type === "page") {
              return (
                <div key={id} className="text-gray-500 flex items-center gap-2 py-0.5">
                  <Download className="w-3 h-3 flex-shrink-0 text-blue-500" />
                  <span>
                    Page {event.page} — fetched{" "}
                    <span className="text-blue-400">{event.fetched}</span> vehicles
                    {event.total ? ` (${event.total} total)` : ""}
                  </span>
                </div>
              );
            }
            if (event.type === "start") {
              return (
                <div key={id} className="text-blue-400 py-1 border-b border-gray-800 mb-1 font-medium">
                  ✦ {event.message}
                </div>
              );
            }
            if (event.type === "vehicle") {
              const isNew = event.action === "created";
              return (
                <div key={id} className="flex items-center gap-2 py-0.5">
                  {isNew
                    ? <PlusCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    : <CheckCircle2 className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  }
                  <span>
                    <span className="text-gray-600 mr-1.5">{String(event.current).padStart(3, "0")}.</span>
                    <span className={isNew ? "text-emerald-300 font-medium" : "text-gray-300"}>
                      {event.year} {event.name}
                    </span>
                    {event.price != null && (
                      <span className="text-gray-500 ml-1.5">{fmt(event.price)}</span>
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
                  <div>
                    <span className="text-emerald-400">{event.created}</span> created ·{" "}
                    <span className="text-blue-400">{event.updated}</span> updated ·{" "}
                    <span className="text-gray-500">{event.skipped}</span> skipped
                  </div>
                  {event.errors > 0 && <div className="text-red-400">{event.errors} errors</div>}
                </div>
              );
            }
            return null;
          })}

          {!done && lines.length === 0 && stepEntries.length === 0 && (
            <div className="text-gray-600 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting to EDealer…
            </div>
          )}
        </div>

        {/* Footer */}
        {done && summary && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-600 font-semibold">+{summary.created} added</span>
              <span className="text-blue-600 font-semibold">↻ {summary.updated} updated</span>
              {summary.skipped > 0 && <span className="text-gray-500">{summary.skipped} skipped</span>}
              {summary.errors > 0 && <span className="text-red-500">{summary.errors} errors</span>}
            </div>
            <Button size="sm" onClick={onClose} className="rounded-full px-6">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
