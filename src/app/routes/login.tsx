// DEPRECATED: This file is no longer used. The active login route lives in app/routes/login.tsx
// Keeping stub to avoid import resolution errors if any stale references remain.
export default function DeprecatedLoginStub() {
  if (import.meta.env.DEV) {
    return <div style={{padding:20,fontFamily:'monospace'}}>Deprecated login route stub. Use /app/routes/login.tsx</div>
  }
  return null
}
