export type Make = {
  id: string
  name: string
  logo?: string
  createdAt: string
  updatedAt: string
  vehicleCount?: number // Number of vehicles using this make
}

export type MakeFormData = {
  name: string
  logo?: string
}

// For table display
export type MakeRow = {
  id: string
  name: string
  logo?: string
  vehicleCount: number
  createdAt: string
}
