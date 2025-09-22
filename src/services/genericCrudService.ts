export interface CrudEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class GenericCrudService<T extends CrudEntity> {
  protected baseUrl: string;

  constructor(endpoint: string) {
    this.baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/${endpoint}`;
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  }

  async getById(id: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  }

  async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
  }
}

