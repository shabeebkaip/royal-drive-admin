export type VehicleRow = {
  id: string
  year: number
  make: string
  model: string
  trim?: string
  bodyType: string
  fuelType: string
  drivetrain: string
  odometer: number
  price: number
  status: string
}

// Additional vehicle-related types can be added here
export type VehicleStatus = "available" | "sold" | "pending" | "reserved" | "on-hold"
export type BodyType = "sedan" | "suv" | "coupe" | "hatchback" | "truck" | "van" | "convertible" | "wagon" | "crossover" | "other"
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "plug-in-hybrid"
export type DrivetrainType = "fwd" | "rwd" | "awd" | "4wd"
