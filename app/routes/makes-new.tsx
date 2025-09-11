import { CrudPage } from "~/components/crud"
import { makeCrudConfig } from "~/components/makes/make-crud-config"
import { makesMockData } from "~/components/makes/mock-data"
import { makesOperations } from "~/components/makes/makes-api"

export default function MakesPage() {
  return (
    <CrudPage
      config={makeCrudConfig}
      initialData={makesMockData}
      operations={makesOperations}
    />
  )
}
