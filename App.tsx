
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Wallet, 
  LayoutDashboard, 
  MessageSquare, 
  Plus, 
  UserPlus,
  ChevronRight,
  TrendingUp,
  CreditCard,
  History
} from 'lucide-react';
import { Employee, Transaction, TransactionType } from './types';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { Dashboard } from './components/Dashboard';
import { PayrollView } from './components/PayrollView';
import { Assistant } from './components/Assistant';
import { TransactionForm } from './components/TransactionForm';

type View = 'dashboard' | 'employees' | 'payroll' | 'ai';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedEmployees = localStorage.getItem('nominapro_employees');
    const savedTransactions = localStorage.getItem('nominapro_transactions');
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('nominapro_employees', JSON.stringify(employees));
    localStorage.setItem('nominapro_transactions', JSON.stringify(transactions));
  }, [employees, transactions]);

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
    setIsAddingEmployee(false);
  };

  const handleOpenTransaction = (employeeId: string | null = null) => {
    setSelectedEmployeeId(employeeId);
    setIsAddingTransaction(true);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
    setIsAddingTransaction(false);
    setSelectedEmployeeId(null);
  };

  const deleteEmployee = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      setEmployees(employees.filter(e => e.id !== id));
      setTransactions(transactions.filter(t => t.employeeId !== id));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-2xl overflow-hidden border-x">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-lg pt-12">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">NóminaPro</h1>
          <div className="flex gap-2">
            {(activeView === 'payroll' || activeView === 'dashboard') && (
               <button 
               onClick={() => handleOpenTransaction()}
               className="bg-indigo-500 hover:bg-indigo-400 p-2 rounded-full transition-colors flex items-center gap-1 px-3"
             >
               <Plus size={18} />
               <span className="text-xs font-bold uppercase">Movimiento</span>
             </button>
            )}
            {activeView === 'employees' && (
              <button 
                onClick={() => setIsAddingEmployee(true)}
                className="bg-indigo-500 hover:bg-indigo-400 p-2 rounded-full transition-colors"
              >
                <UserPlus size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        {activeView === 'dashboard' && (
          <Dashboard 
            employees={employees} 
            transactions={transactions} 
            onNavigate={setActiveView} 
            onAddTransaction={handleOpenTransaction}
          />
        )}
        {activeView === 'employees' && (
          <EmployeeList 
            employees={employees} 
            onDelete={deleteEmployee} 
            onAddTransaction={handleOpenTransaction}
          />
        )}
        {activeView === 'payroll' && (
          <PayrollView employees={employees} transactions={transactions} />
        )}
        {activeView === 'ai' && (
          <Assistant employees={employees} transactions={transactions} />
        )}

        {/* Modals */}
        {isAddingEmployee && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <EmployeeForm 
                onSubmit={handleAddEmployee} 
                onCancel={() => setIsAddingEmployee(false)} 
              />
            </div>
          </div>
        )}

        {isAddingTransaction && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm">
              <TransactionForm 
                employees={employees}
                defaultEmployeeId={selectedEmployeeId}
                onSubmit={handleAddTransaction} 
                onCancel={() => setIsAddingTransaction(false)} 
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Sticky) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-3 px-2 safe-bottom z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'dashboard' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button 
          onClick={() => setActiveView('employees')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'employees' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-medium">Empleados</span>
        </button>
        <button 
          onClick={() => setActiveView('payroll')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'payroll' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Wallet size={24} />
          <span className="text-[10px] font-medium">Nómina</span>
        </button>
        <button 
          onClick={() => setActiveView('ai')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'ai' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <MessageSquare size={24} />
          <span className="text-[10px] font-medium">Asistente AI</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
