
export enum TransactionType {
  ADVANCE = 'ADELANTO',
  CREDIT = 'CRÉDITO',
  BONUS = 'BONIFICACIÓN',
  DEDUCTION = 'DESCUENTO_OTRO',
  LEGAL_DEDUCTION = 'DESC_LEY'
}

export interface Transaction {
  id: string;
  employeeId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  baseSalary: number;
  idNumber: string;
  hireDate: string;
  email: string;
}

export interface PayrollPeriod {
  month: number;
  year: number;
}

export interface PayrollResult {
  employeeId: string;
  baseSalary: number;
  legalDeductions: number; // e.g. Social Security, Pension
  advances: number;
  credits: number;
  bonuses: number;
  netPay: number;
}
