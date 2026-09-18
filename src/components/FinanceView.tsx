import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { TuitionInvoice } from '../types';
import { formatCurrency, formatDate } from '../utils/academicUtils';
import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Receipt,
  Search,
  Filter,
  Plus,
  X,
  Printer,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { invoices, recordPayment, addInvoice, role, students } = useSchool();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment modal state
  const [payingInvoice, setPayingInvoice] = useState<TuitionInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Receipt modal state
  const [receiptInvoice, setReceiptInvoice] = useState<TuitionInvoice | null>(null);

  // Stats
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = totalBilled - totalPaid;
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handleOpenPay = (inv: TuitionInvoice) => {
    setPayingInvoice(inv);
    setPaymentAmount(inv.totalAmount - inv.paidAmount);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice || paymentAmount <= 0) return;

    recordPayment(payingInvoice.id, paymentAmount);
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Mount Olive Bursar & Tuition Office
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Fiscal Term 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tuition schedules, laboratory dues, athletic endowments, and official payment receipts.
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Total Invoiced</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(totalBilled)}</div>
          <span className="text-[11px] text-slate-500 font-medium">Fall 2026 Academic Term</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Collected Revenue</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-800">{formatCurrency(totalPaid)}</div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {Math.round((totalPaid / totalBilled) * 100)}% Collection Rate
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Outstanding Balances</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-800">{formatCurrency(totalOutstanding)}</div>
          <span className="text-[11px] text-amber-700 font-medium">Pending Term Dues</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Overdue Accounts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-800">{overdueCount} Accounts</div>
          <span className="text-[11px] text-rose-700 font-medium">Requires Bursar Follow-up</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or invoice number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Status:</span>
          {(['all', 'Paid', 'Partial', 'Pending', 'Overdue'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                statusFilter === s
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Invoice & Scholar</th>
                <th className="py-3.5 px-4">Term & Cohort</th>
                <th className="py-3.5 px-4">Total Billed</th>
                <th className="py-3.5 px-4">Paid to Date</th>
                <th className="py-3.5 px-4">Balance Remaining</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Bursar Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const balance = inv.totalAmount - inv.paidAmount;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    {/* Invoice & Scholar */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{inv.studentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {inv.id} • {inv.studentId}
                        </span>
                      </div>
                    </td>

                    {/* Term */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{inv.term}</span>
                      <span className="text-slate-400 text-[11px] block">Grade {inv.grade}</span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>

                    {/* Paid */}
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                      {formatCurrency(inv.paidAmount)}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {balance === 0 ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      ) : (
                        <span className={inv.status === 'Overdue' ? 'text-rose-600' : 'text-slate-800'}>
                          {formatCurrency(balance)}
                        </span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(inv.dueDate)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : inv.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : inv.status === 'Pending'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => handleOpenPay(inv)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                          >
                            Record Payment
                          </button>
                        )}

                        <button
                          onClick={() => setReceiptInvoice(inv)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          title="View Official Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Tuition Payment</h3>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{payingInvoice.studentName}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono text-slate-700">{payingInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-amber-800">
                  {formatCurrency(payingInvoice.totalAmount - payingInvoice.paidAmount)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount ($ USD)</label>
                <input
                  type="number"
                  min={1}
                  max={payingInvoice.totalAmount - payingInvoice.paidAmount}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>Automated Clearing House (ACH Wire Transfer)</option>
                  <option>Certified Bank Draft</option>
                  <option>Credit Card (Bursar Portal)</option>
                  <option>Academy Scholarship Endowment Credit</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-xs"
                >
                  Post Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {receiptInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <h3 className="font-cinzel font-bold text-slate-900 text-base">
                  Mount Olive Academy Receipt
                </h3>
              </div>
              <button
                onClick={() => setReceiptInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs mb-4">
              <div className="flex justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-2">
                <span>Receipt Number: <strong>{receiptInvoice.receiptNumber || 'RCP-89104'}</strong></span>
                <span>Date: {formatDate(receiptInvoice.invoiceDate)}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Scholar & Account</span>
                <p className="font-bold text-slate-900 text-sm">{receiptInvoice.studentName}</p>
                <p className="text-slate-500 font-mono text-[11px]">ID: {receiptInvoice.studentId} • Grade {receiptInvoice.grade}</p>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Itemized Fees</span>
                {receiptInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 text-xs">
                    <span>{item.description}</span>
                    <span className="font-mono font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Assessment</span>
                <span>{formatCurrency(receiptInvoice.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-emerald-800 font-bold text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span>Amount Remitted & Cleared</span>
                <span>{formatCurrency(receiptInvoice.paidAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 italic">Office of the Bursar • Valid Stamp</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
