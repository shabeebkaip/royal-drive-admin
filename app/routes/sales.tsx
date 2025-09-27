import { SalesList } from '~/components/sales'
import { SalesSummary } from '~/components/sales/SalesSummary'

export default function SalesIndex() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
        <p className="text-sm text-muted-foreground">Manage vehicle sales transactions and track performance</p>
      </div>
      <SalesSummary />
      <SalesList />
    </div>
  )
}
