import { GenericCrudService, type CrudEntity } from './genericCrudService';

export interface VehicleType extends CrudEntity {
  name: string;
  description?: string;
  category: 'car' | 'motorcycle' | 'truck' | 'suv' | 'van';
  isActive: boolean;
}

export class VehicleTypesService extends GenericCrudService<VehicleType> {
  constructor() {
    super('vehicle-types');
  }

  async getByCategory(category: string): Promise<VehicleType[]> {
    const response = await fetch(`${this.baseUrl}?category=${category}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle types by category');
    return response.json();
  }
}

export const vehicleTypesService = new VehicleTypesService();

