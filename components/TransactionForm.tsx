
import React, { useState, useEffect } from 'react';
import { Employee, Transaction, TransactionType } from '../types';
import { X } from 'lucide-react';

interface Props {
  employees: Employee[];
  defaultEmployeeId?: string | null;
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<Props> = ({ employees, defaultEmployeeId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: defaultEmployeeId || '',
    type: TransactionType.ADVANCE,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Sync if prop changes (though modal usually unmounts)
  useEffect(() => {
    if (defaultEmployeeId) {
      setFormData(prev => ({ ...prev, employeeId: defaultEmployeeId }));
    }
  }, [defaultEmployeeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.amount) return;

    onSubmit({
      id: crypto.randomUUID(),
      employeeId: formData.employeeId,
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
    });
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ADVANCE: return 'Adelanto';
      case TransactionType.CREDIT: return 'Crédito';
      case TransactionType.BONUS: return 'Bonificación';
      case TransactionType.DEDUCTION: return 'Otros Descuentos';
      case TransactionType.LEGAL_DEDUCTION: return 'Dcto. Ley';
      default: return type;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Registrar Movimiento</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-center text-slate-500 my-8">Primero debes registrar empleados.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Empleado</label>
            <select
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            >
              <option value="">Seleccionar empleado...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimiento</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TransactionType).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    formData.type === type 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Descuento AFP Mayo"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Guardar Movimiento
          </button>
        </form>
      )}
    </div>
  );
};
