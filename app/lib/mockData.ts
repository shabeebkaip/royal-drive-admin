// Mock data for when API endpoints are not available
export const mockMakes = [
  { id: "1", _id: "1", name: "Toyota", slug: "toyota", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "Honda", slug: "honda", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "Ford", slug: "ford", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Chevrolet", slug: "chevrolet", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "5", _id: "5", name: "BMW", slug: "bmw", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "6", _id: "6", name: "Mercedes-Benz", slug: "mercedes-benz", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "7", _id: "7", name: "Audi", slug: "audi", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "8", _id: "8", name: "Volkswagen", slug: "volkswagen", active: true, createdAt: "2024-01-01T00:00:00Z" },
]

export const mockVehicleTypes = [
  { id: "1", _id: "1", name: "Sedan", slug: "sedan", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "SUV", slug: "suv", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "Coupe", slug: "coupe", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Hatchback", slug: "hatchback", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "5", _id: "5", name: "Truck", slug: "truck", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "6", _id: "6", name: "Van", slug: "van", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "7", _id: "7", name: "Convertible", slug: "convertible", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "8", _id: "8", name: "Wagon", slug: "wagon", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "9", _id: "9", name: "Crossover", slug: "crossover", active: true, createdAt: "2024-01-01T00:00:00Z" },
]

export const mockFuelTypes = [
  { id: "1", _id: "1", name: "Gasoline", slug: "gasoline", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "Diesel", slug: "diesel", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "Hybrid", slug: "hybrid", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Electric", slug: "electric", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "5", _id: "5", name: "Plug-in Hybrid", slug: "plug-in-hybrid", active: true, createdAt: "2024-01-01T00:00:00Z" },
]

export const mockTransmissions = [
  { id: "1", _id: "1", name: "Manual", slug: "manual", type: "manual" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "Automatic", slug: "automatic", type: "automatic" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "CVT", slug: "cvt", type: "cvt" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Semi-Automatic", slug: "semi-automatic", type: "semi-automatic" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
]

export const mockDrivetrains = [
  { id: "1", _id: "1", name: "Front Wheel Drive", slug: "fwd", type: "fwd" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "Rear Wheel Drive", slug: "rwd", type: "rwd" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "All Wheel Drive", slug: "awd", type: "awd" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Four Wheel Drive", slug: "4wd", type: "4wd" as const, active: true, createdAt: "2024-01-01T00:00:00Z" },
]

export const mockStatuses = [
  { id: "1", _id: "1", name: "Available", slug: "available", color: "#10b981", description: "Vehicle is available for sale", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", _id: "2", name: "Sold", slug: "sold", color: "#6b7280", description: "Vehicle has been sold", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "3", _id: "3", name: "Pending", slug: "pending", color: "#f59e0b", description: "Sale is pending", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "4", _id: "4", name: "Reserved", slug: "reserved", color: "#3b82f6", description: "Vehicle is reserved", active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "5", _id: "5", name: "On Hold", slug: "on-hold", color: "#ef4444", description: "Vehicle is on hold", active: true, createdAt: "2024-01-01T00:00:00Z" },
]
