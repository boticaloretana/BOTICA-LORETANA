
import React from 'react';
import { Employee, Transaction, TransactionType } from '../types';
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  Briefcase,
  Calendar,
  Wallet,
  TrendingUp,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  employees: Employee[];
  transactions: Transaction[];
  onNavigate: (view: any) => void;
  onAddTransaction: () => void;
}

export const Dashboard: React.FC<Props> = ({ employees, transactions, onNavigate, onAddTransaction }) => {
  const totalBaseSalary = employees.reduce((acc, emp) => acc + emp.baseSalary, 0);
  const totalAdvances = transactions
    .filter(t => t.type === TransactionType.ADVANCE)
    .reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { label: 'Empleados', value: employees.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Costo Base', value: `S/ ${totalBaseSalary.toLocaleString()}`, icon: Wallet, color: 'bg-emerald-500' },
    { label: 'Adelantos', value: `S/ ${totalAdvances.toLocaleString()}`, icon: ArrowDownLeft, color: 'bg-orange-500' },
  ];

  const chartData = employees.slice(0, 5).map(emp => {
    const empTransactions = transactions.filter(t => t.employeeId === emp.id);
    const advances = empTransactions
      .filter(t => t.type === TransactionType.ADVANCE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: emp.name.split(' ')[0],
      salario: emp.baseSalary,
      adelantos: advances
    };
  });

  const quickActions = [
    { label: 'Adelanto', icon: ArrowDownLeft, color: 'text-orange-600 bg-orange-100', type: TransactionType.ADVANCE },
    { label: 'Bono', icon: Gift, color: 'text-emerald-600 bg-emerald-100', type: TransactionType.BONUS },
    { label: 'Dcto Ley', icon: ShieldCheck, color: 'text-rose-600 bg-rose-100', type: TransactionType.LEGAL_DEDUCTION },
    { label: 'Crédito', icon: CreditCard, color: 'text-indigo-600 bg-indigo-100', type: TransactionType.CREDIT },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-3xl bg-white shadow-sm border border-slate-100 ${i === 1 ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl text-white ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 px-1">Registrar Nuevo</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button 
              key={i} 
              onClick={onAddTransaction}
              className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                <action.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-500" size={18} /> Top Salarios vs Adelantos
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="salario" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="adelantos" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions List */}
      <div className="space-y-3 pb-4">
        <h3 className="text-sm font-bold text-slate-700 px-1">Atajos</h3>
        <button 
          onClick={() => onNavigate('employees')}
          className="w-full p-4 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-between font-bold text-sm active:scale-95 transition-transform"
        >
          Ver Todos los Empleados
          <ArrowUpRight size={18} />
        </button>
        <button 
          onClick={() => onNavigate('payroll')}
          className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-between font-bold text-sm active:scale-95 transition-transform"
        >
          Calcular Nómina Mensual
          <Wallet size={18} />
        </button>
      </div>
    </div>
  );
};
