import React, { useState, useEffect } from 'react';
import { GenericCrudList } from '../components/generic/GenericCrudList';
import type { VehicleType } from '../services/vehicleTypesService';
import { vehicleTypesService } from '../services/vehicleTypesService';

export function VehicleTypes() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = async () => {
    try {
      const data = await vehicleTypesService.getAll();
      setVehicleTypes(data);
    } catch (error) {
      console.error('Failed to load vehicle types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicleType: VehicleType) => {
    setEditingType(vehicleType);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle type?')) {
      try {
        await vehicleTypesService.delete(id);
        await loadVehicleTypes();
      } catch (error) {
        console.error('Failed to delete vehicle type:', error);
      }
    }
  };

  const handleAdd = () => {
    setEditingType(null);
    setShowForm(true);
  };

  const columns = [
    { key: 'name' as keyof VehicleType, header: 'Name' },
    { key: 'description' as keyof VehicleType, header: 'Description' },
    {
      key: 'category' as keyof VehicleType,
      header: 'Category',
      render: (type: VehicleType) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs capitalize">
          {type.category}
        </span>
      )
    },
    {
      key: 'isActive' as keyof VehicleType,
      header: 'Status',
      render: (type: VehicleType) => (
        <span className={`px-2 py-1 rounded text-xs ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {type.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'createdAt' as keyof VehicleType, header: 'Created', render: (type: VehicleType) => new Date(type.createdAt!).toLocaleDateString() }
  ];

  if (showForm) {
    return (
      <VehicleTypeForm
        vehicleType={editingType}
        onSave={async () => {
          setShowForm(false);
          await loadVehicleTypes();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <GenericCrudList
      items={vehicleTypes}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      title="Vehicle Types"
      loading={loading}
    />
  );
}

interface VehicleTypeFormProps {
  vehicleType: VehicleType | null;
  onSave: () => void;
  onCancel: () => void;
}

function VehicleTypeForm({ vehicleType, onSave, onCancel }: VehicleTypeFormProps) {
  const [formData, setFormData] = useState({
    name: vehicleType?.name || '',
    description: vehicleType?.description || '',
    category: vehicleType?.category || 'car' as const,
    isActive: vehicleType?.isActive ?? true
  });

  const categories = ['car', 'motorcycle', 'truck', 'suv', 'van'] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (vehicleType) {
        await vehicleTypesService.update(vehicleType.id!, formData);
      } else {
        await vehicleTypesService.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save vehicle type:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{vehicleType ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

