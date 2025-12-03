import React from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Clock, Download, 
  ArrowUpRight, ArrowDownLeft, FileText, CreditCard, ShieldCheck 
} from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_INVOICES } from '../constants';
import { Transaction, Invoice } from '../types';

const BalanceCard = ({ title, amount, subtitle, type }: { title: string, amount: string, subtitle: string, type: 'primary' | 'secondary' | 'neutral' }) => {
  const bgStyles = {
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-white border border-slate-200 text-slate-800',
    neutral: 'bg-slate-50 border border-slate-200 text-slate-800'
  };

  return (
    <div className={`rounded-xl p-6 shadow-sm ${bgStyles[type]}`}>
      <p className={`text-sm font-medium mb-2 ${type === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>
        {title}
      </p>
      <h3 className="text-3xl font-bold mb-2 tracking-tight">{amount}</h3>
      <div className={`flex items-center gap-1 text-xs ${type === 'primary' ? 'text-indigo-200' : 'text-slate-400'}`}>
        {type === 'primary' && <ShieldCheck className="w-3 h-3" />}
        {subtitle}
      </div>
    </div>
  );
};

const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const isIncome = ['income', 'escrow_release'].includes(tx.type);
  const isFrozen = tx.type === 'escrow_frozen';
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${
          isIncome ? 'bg-green-100 text-green-600' : 
          isFrozen ? 'bg-amber-100 text-amber-600' :
          'bg-slate-100 text-slate-600'
        }`}>
          {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : 
           isFrozen ? <Clock className="w-5 h-5" /> :
           <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="font-medium text-slate-800 text-sm">{tx.description}</p>
          <p className="text-xs text-slate-500">{tx.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-sm ${
          isIncome ? 'text-green-600' : 
          isFrozen ? 'text-amber-600' :
          'text-slate-900'
        }`}>
          {isIncome ? '+' : ''}¥{Math.abs(tx.amount).toLocaleString()}
        </p>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          tx.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {tx.status === 'completed' ? '已完成' : '处理中'}
        </span>
      </div>
    </div>
  );
};

const InvoiceRow = ({ inv }: { inv: Invoice }) => (
  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all bg-white">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{inv.title}</p>
        <p className="text-xs text-slate-500">{inv.companyName} • {inv.createdDate}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-medium text-slate-900 text-sm">¥{inv.amount.toLocaleString()}</span>
      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const FinanceView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">财务与托管</h2>
          <p className="text-slate-500 text-sm mt-1">管理您的收入、支出与项目托管资金</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
             <CreditCard className="w-4 h-4" />
             绑定银行卡
           </button>
           <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
             <ArrowUpRight className="w-4 h-4" />
             提现
           </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard 
          title="可用余额" 
          amount="¥ 42,593.00" 
          subtitle="资金托管安全保障中"
          type="primary"
        />
        <BalanceCard 
          title="托管冻结中" 
          amount="¥ 18,000.00" 
          subtitle="2 个项目进行中"
          type="secondary"
        />
        <BalanceCard 
          title="本月总收入" 
          amount="¥ 65,000.00" 
          subtitle="环比上月 +12.5%"
          type="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">资金明细</h3>
            <button className="text-indigo-600 text-sm font-medium hover:underline">查看全部</button>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_TRANSACTIONS.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
          </div>
        </div>

        {/* Sidebar: Invoices & Settings */}
        <div className="space-y-6">
          
          {/* Invoices */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">最近发票</h3>
              <button className="text-slate-400 hover:text-indigo-600"><TrendingUp className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {MOCK_INVOICES.map(inv => <InvoiceRow key={inv.id} inv={inv} />)}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              申请新发票
            </button>
          </div>

          {/* Verification Status */}
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
             <div className="flex items-start gap-3">
               <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
               <div>
                 <h4 className="font-bold text-indigo-900 text-sm">企业认证已完成</h4>
                 <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                   您已通过实名认证与企业资质审核，享有提现极速到账权益。
                 </p>
               </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default FinanceView;