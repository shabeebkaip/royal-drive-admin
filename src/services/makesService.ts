import { GenericCrudService, type CrudEntity } from './genericCrudService';

export interface Make extends CrudEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export class MakesService extends GenericCrudService<Make> {
  constructor() {
    super('makes');
  }

  async getActiveMakes(): Promise<Make[]> {
    const response = await fetch(`${this.baseUrl}?active=true`);
    if (!response.ok) throw new Error('Failed to fetch active makes');
    return response.json();
  }
}

export const makesService = new MakesService();

