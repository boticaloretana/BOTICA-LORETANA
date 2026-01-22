
import React from 'react';
import { Employee } from '../types';
import { Trash2, User, ChevronRight, Mail, Briefcase, PlusCircle } from 'lucide-react';

interface Props {
  employees: Employee[];
  onDelete: (id: string) => void;
  onAddTransaction: (employeeId: string) => void;
}

export const EmployeeList: React.FC<Props> = ({ employees, onDelete, onAddTransaction }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-slate-800 px-1">Plantilla de Empleados</h2>
      
      {employees.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <User className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500">No hay empleados registrados.</p>
        </div>
      ) : (
        employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <User size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{emp.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Briefcase size={12} /> {emp.position}
                  </p>
                </div>
                <button 
                  onClick={() => onAddTransaction(emp.id)}
                  className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-100 transition-colors"
                >
                  <PlusCircle size={14} />
                  Movimiento
                </button>
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                S/ {emp.baseSalary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <button 
              onClick={() => onDelete(emp.id)}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors ml-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};
