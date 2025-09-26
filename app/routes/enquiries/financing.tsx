import * as React from 'react'

export default function FinancingEnquiriesComingSoon() {
  return (
    <div className="p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[60vh]">
      <div className="space-y-3 max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Financing Enquiries</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This section will allow you to manage customer enquiries specific to financing, pre-approvals and loan discussions.
        </p>
      </div>
      <div className="rounded-lg border bg-muted/30 px-6 py-8 w-full max-w-md shadow-sm">
        <p className="text-lg font-medium mb-2">Coming Soon</p>
        <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside space-y-1 text-left">
          <li>Dedicated financing enquiry pipeline</li>
          <li>Status & priority workflow</li>
          <li>Credit pre-approval tracking</li>
          <li>Document checklist & upload</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">
        Need this earlier? Create a ticket with requirements.
      </p>
    </div>
  )
}
