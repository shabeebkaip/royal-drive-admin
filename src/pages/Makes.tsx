import React, { useState, useEffect } from 'react';
import { GenericCrudList } from '../components/generic/GenericCrudList';
import type { Make } from '../services/makesService';
import { makesService } from '../services/makesService';

export function Makes() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMake, setEditingMake] = useState<Make | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    try {
      const data = await makesService.getAll();
      setMakes(data);
    } catch (error) {
      console.error('Failed to load makes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (make: Make) => {
    setEditingMake(make);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this make?')) {
      try {
        await makesService.delete(id);
        await loadMakes();
      } catch (error) {
        console.error('Failed to delete make:', error);
      }
    }
  };

  const handleAdd = () => {
    setEditingMake(null);
    setShowForm(true);
  };

  const columns = [
    { key: 'name' as keyof Make, header: 'Name' },
    { key: 'description' as keyof Make, header: 'Description' },
    {
      key: 'isActive' as keyof Make,
      header: 'Status',
      render: (make: Make) => (
        <span className={`px-2 py-1 rounded text-xs ${make.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {make.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'createdAt' as keyof Make, header: 'Created', render: (make: Make) => new Date(make.createdAt!).toLocaleDateString() }
  ];

  if (showForm) {
    return (
      <MakeForm
        make={editingMake}
        onSave={async () => {
          setShowForm(false);
          await loadMakes();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <GenericCrudList
      items={makes}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      title="Vehicle Makes"
      loading={loading}
    />
  );
}

interface MakeFormProps {
  make: Make | null;
  onSave: () => void;
  onCancel: () => void;
}

function MakeForm({ make, onSave, onCancel }: MakeFormProps) {
  const [formData, setFormData] = useState({
    name: make?.name || '',
    description: make?.description || '',
    isActive: make?.isActive ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (make) {
        await makesService.update(make.id!, formData);
      } else {
        await makesService.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save make:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{make ? 'Edit Make' : 'Add New Make'}</h1>
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

