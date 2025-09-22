import { CrudPage } from "~/components/crud"
import { makeCrudConfig } from "~/components/makes/make-crud-config"
import { makesOperations } from "~/components/makes/makes-api"

export default function MakesPage() {
  return (
    <CrudPage
      config={makeCrudConfig}
  initialData={[]}
      operations={makesOperations}
    />
  )
}
