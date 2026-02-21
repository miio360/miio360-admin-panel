import { useState } from 'react';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { PlansReceiptsTab } from '../components/plans-receipts-tab';
import { OrdersReceiptsTab } from '../components/orders-receipts-tab';
import { TransactionsReceiptsTab } from '../components/transactions-receipts-tab';


export function PaymentReceiptsPage() {
  const [activeTab, setActiveTab] = useState('plans');

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeaderGlobal
        title="Comprobantes de Pago"
        description="Gestiona las solicitudes de compra y pagos"
      />

      {/* Tabs */}
      <div className="w-full grid grid-cols-3 mb-6 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-w-0 ${activeTab === 'plans'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate min-w-0">Planes</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-w-0 ${activeTab === 'orders'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate min-w-0">Pedidos</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-w-0 ${activeTab === 'transactions'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate min-w-0">Transacciones</span>
        </button>
      </div>

      {activeTab === 'plans' && <PlansReceiptsTab />}
      {activeTab === 'orders' && <OrdersReceiptsTab />}
      {activeTab === 'transactions' && <TransactionsReceiptsTab />}
    </div>
  );
}
