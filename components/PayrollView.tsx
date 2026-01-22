
import React, { useMemo } from 'react';
import { Employee, Transaction, TransactionType, PayrollResult } from '../types';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  employees: Employee[];
  transactions: Transaction[];
}

export const PayrollView: React.FC<Props> = ({ employees, transactions }) => {
  const currentMonthResults = useMemo(() => {
    return employees.map(emp => {
      const empTrans = transactions.filter(t => t.employeeId === emp.id);
      
      const advances = empTrans
        .filter(t => t.type === TransactionType.ADVANCE)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const credits = empTrans
        .filter(t => t.type === TransactionType.CREDIT)
        .reduce((sum, t) => sum + t.amount, 0);

      const bonuses = empTrans
        .filter(t => t.type === TransactionType.BONUS)
        .reduce((sum, t) => sum + t.amount, 0);

      const otherDeductions = empTrans
        .filter(t => t.type === TransactionType.DEDUCTION)
        .reduce((sum, t) => sum + t.amount, 0);

      // Manual Legal Deductions
      const legalDeductions = empTrans
        .filter(t => t.type === TransactionType.LEGAL_DEDUCTION)
        .reduce((sum, t) => sum + t.amount, 0);

      const netPay = emp.baseSalary + bonuses - legalDeductions - advances - credits - otherDeductions;

      return {
        employeeId: emp.id,
        name: emp.name,
        baseSalary: emp.baseSalary,
        legalDeductions,
        advances,
        credits,
        bonuses,
        otherDeductions,
        netPay
      };
    });
  }, [employees, transactions]);

  const totalPayroll = currentMonthResults.reduce((sum, r) => sum + r.netPay, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Total a Pagar Este Mes</p>
          <h2 className="text-3xl font-bold">S/ {totalPayroll.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="absolute -right-4 -bottom-4 text-indigo-500 opacity-30 transform rotate-12">
          <Wallet size={120} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Detalle de Pagos</h3>
        {currentMonthResults.length === 0 ? (
          <p className="text-center py-10 text-slate-400">Sin empleados para procesar.</p>
        ) : (
          currentMonthResults.map((result) => (
            <div key={result.employeeId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                <div>
                  <h4 className="font-bold text-slate-800">{result.name}</h4>
                  <p className="text-xs text-slate-400">Sueldo Base: S/ {result.baseSalary.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-600 font-black text-lg">
                    S/ {result.netPay.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Dcto. Ley (Manual):</span>
                  <span className="font-medium text-rose-500">- S/ {result.legalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Adelantos:</span>
                  <span className="font-medium text-rose-500">- S/ {result.advances.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Bonos:</span>
                  <span className="font-medium text-emerald-500">+ S/ {result.bonuses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Créditos:</span>
                  <span className="font-medium text-rose-500">- S/ {result.credits.toFixed(2)}</span>
                </div>
                {result.otherDeductions > 0 && (
                  <div className="flex justify-between text-slate-500 col-span-2 border-t border-slate-50 pt-1">
                    <span>Otros Descuentos:</span>
                    <span className="font-medium text-rose-500">- S/ {result.otherDeductions.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
        <Download size={20} /> Generar Reporte PDF
      </button>
    </div>
  );
};

const Wallet = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
);
