
import React, { useState } from 'react';
import { Employee } from '../types';
import { X } from 'lucide-react';

interface Props {
  onSubmit: (employee: Employee) => void;
  onCancel: () => void;
}

export const EmployeeForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    baseSalary: '',
    idNumber: '',
    hireDate: new Date().toISOString().split('T')[0],
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.baseSalary) return;

    onSubmit({
      id: crypto.randomUUID(),
      name: formData.name,
      position: formData.position,
      baseSalary: parseFloat(formData.baseSalary),
      idNumber: formData.idNumber,
      hireDate: formData.hireDate,
      email: formData.email,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Nuevo Empleado</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI / ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Puesto</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sueldo Base (Mensual)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.baseSalary}
            onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Ingreso</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.hireDate}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Registrar Empleado
        </button>
      </form>
    </div>
  );
};
