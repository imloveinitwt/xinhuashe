

import React from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Clock, Download, 
  ArrowUpRight, ArrowDownLeft, FileText, CreditCard, ShieldCheck,
  PiggyBank, Target, PieChart, Building, Briefcase, Plus, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { MOCK_TRANSACTIONS, MOCK_INVOICES, MOCK_SAVINGS_GOALS, MOCK_DEPT_BUDGETS, CHART_DATA_CASH_FLOW, CHART_DATA_PERSONAL_SPENDING } from '../constants';
import { Transaction, Invoice, User, UserRole } from '../types';

interface FinanceViewProps {
  user: User;
}

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
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
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <span>{tx.date}</span>
             {tx.category && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{tx.category}</span>}
          </div>
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

const PersonalFinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
       {/* Personal Header Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><Wallet className="w-6 h-6 text-white" /></div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">总资产</span>
           </div>
           <h3 className="text-3xl font-bold mb-1">¥ 68,593.00</h3>
           <div className="flex items-center gap-2 text-pink-100 text-sm">
              <TrendingUp className="w-4 h-4" /> 较上月增长 12.5%
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-slate-500 text-sm font-medium">本月支出</p>
               <h3 className="text-2xl font-bold text-slate-800 mt-1">¥ 8,240.00</h3>
             </div>
             <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><ArrowUpRight className="w-5 h-5" /></div>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
              <div className="bg-slate-800 h-2 rounded-full" style={{ width: '45%' }}></div>
           </div>
           <p className="text-xs text-slate-400 mt-2">已使用预算的 45% (总预算 ¥18,000)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-slate-500 text-sm font-medium">本月收入</p>
               <h3 className="text-2xl font-bold text-green-600 mt-1">¥ 24,500.00</h3>
             </div>
             <div className="p-2 bg-green-50 rounded-lg text-green-600"><ArrowDownLeft className="w-5 h-5" /></div>
           </div>
           <p className="text-xs text-slate-400 mt-auto">主要来源：项目结款、版权收益</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Spending Analysis & Goals */}
        <div className="space-y-6 lg:col-span-2">
           
           {/* Savings Goals */}
           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Target className="w-5 h-5 text-pink-500" /> 储蓄目标
                 </h3>
                 <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                   <Plus className="w-4 h-4" /> 新增目标
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {MOCK_SAVINGS_GOALS.map(goal => (
                   <div key={goal.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <div className={`p-2 rounded-lg ${goal.color} bg-opacity-10 text-white`}>
                            {React.createElement(goal.icon, { className: `w-5 h-5 ${goal.color.replace('bg-', 'text-')}` })}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-800 text-sm">{goal.name}</h4>
                            <p className="text-xs text-slate-500">{goal.deadline} 截止</p>
                         </div>
                      </div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                         <span className="text-slate-600">¥{goal.currentAmount.toLocaleString()}</span>
                         <span className="text-slate-400">目标 ¥{goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                         <div 
                           className={`h-2 rounded-full ${goal.color}`} 
                           style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Spending Chart */}
           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-indigo-500" /> 支出分析
                 </h3>
                 <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={CHART_DATA_PERSONAL_SPENDING}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {CHART_DATA_PERSONAL_SPENDING.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </RePieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] text-center pointer-events-none">
                       <div className="text-xs text-slate-400">总支出</div>
                       <div className="text-xl font-bold text-slate-800">¥8.2k</div>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-64 border-l border-slate-100 pl-0 md:pl-8 pt-4 md:pt-0">
                 <h4 className="text-sm font-bold text-slate-700 mb-4">高频消费类别</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm text-slate-600">设备软件</span>
                       <span className="text-sm font-bold text-slate-800">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm text-slate-600">生活开销</span>
                       <span className="text-sm font-bold text-slate-800">40%</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 leading-relaxed mt-4">
                       <PiggyBank className="w-4 h-4 text-indigo-500 mb-2" />
                       建议：本月软件订阅支出较高，可考虑改为年付方案以节省 15% 费用。
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm h-full flex flex-col">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">近期流水</h3>
              <button className="text-xs text-indigo-600 hover:underline">查看全部</button>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.slice(0, 6).map(tx => <TransactionRow key={tx.id} tx={tx} />)}
           </div>
           <div className="p-4 border-t border-slate-100">
              <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                 记一笔
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

const EnterpriseFinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Enterprise Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">当前现金流</p>
            <h3 className="text-2xl font-bold text-slate-900">¥ 1,240,593</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">健康</span>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">应收账款 (AR)</p>
            <h3 className="text-2xl font-bold text-indigo-600">¥ 450,000</h3>
            <span className="text-xs text-slate-400 mt-2 inline-block">3笔 即将到期</span>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">应付账款 (AP)</p>
            <h3 className="text-2xl font-bold text-rose-600">¥ 128,000</h3>
            <span className="text-xs text-slate-400 mt-2 inline-block">下周需支付 ¥50k</span>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">本季度净利润</p>
            <h3 className="text-2xl font-bold text-slate-900">¥ 320,000</h3>
            <span className="text-xs text-green-600 font-medium mt-2 inline-block">+18.2% 同比增长</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart: Cash Flow & Profit */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-800">现金流与损益趋势</h3>
               <div className="flex gap-2">
                  <select className="text-xs border border-slate-200 rounded p-1 bg-white">
                     <option>2023 上半年</option>
                     <option>2023 下半年</option>
                  </select>
               </div>
            </div>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA_CASH_FLOW}>
                     <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                     <Area type="monotone" dataKey="income" name="收入" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                     <Area type="monotone" dataKey="expense" name="支出" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Side: Invoices & Tax */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-indigo-600" /> 待处理发票
               </h3>
               <div className="space-y-3">
                  {MOCK_INVOICES.map(inv => (
                     <div key={inv.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <div>
                           <div className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{inv.companyName}</div>
                           <div className="text-xs text-slate-500">{inv.createdDate}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-sm font-bold text-slate-800">¥{inv.amount.toLocaleString()}</div>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              inv.status === 'paid' ? 'bg-green-50 text-green-600' : 
                              inv.status === 'unpaid' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                           }`}>
                              {inv.status === 'paid' ? '已支付' : inv.status === 'unpaid' ? '未支付' : '处理中'}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg hover:bg-indigo-100">
                  批量开票
               </button>
            </div>
         </div>
      </div>

      {/* Bottom: Department Budgets */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
               <h3 className="font-bold text-slate-800 text-lg">部门预算监控</h3>
               <p className="text-xs text-slate-500 mt-1">2023 Q4 季度预算执行情况</p>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
               下载报表
            </button>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
               <tr>
                  <th className="px-6 py-4">部门名称</th>
                  <th className="px-6 py-4">负责人</th>
                  <th className="px-6 py-4">总预算</th>
                  <th className="px-6 py-4">已使用 / 占比</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_DEPT_BUDGETS.map(budget => {
                  const percent = (budget.usedBudget / budget.totalBudget) * 100;
                  return (
                     <tr key={budget.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                           <Building className="w-4 h-4 text-slate-400" />
                           {budget.department}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{budget.head}</td>
                        <td className="px-6 py-4 font-mono text-slate-700">¥{budget.totalBudget.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-700">¥{budget.usedBudget.toLocaleString()}</span>
                              <span className="text-xs text-slate-400">({percent.toFixed(1)}%)</span>
                           </div>
                           <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                   percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-amber-500' : 'bg-green-500'
                                }`} 
                                style={{ width: `${Math.min(percent, 100)}%` }}
                              ></div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              budget.status === 'healthy' ? 'bg-green-50 text-green-600' :
                              budget.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                              'bg-red-50 text-red-600'
                           }`}>
                              {budget.status === 'healthy' ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {budget.status === 'healthy' ? '正常' : budget.status === 'warning' ? '预警' : '超支'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
                           详情
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
    </div>
  );
}

const FinanceView: React.FC<FinanceViewProps> = ({ user }) => {
  const isEnterprise = user.role === 'enterprise' || user.role === 'root_admin';

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* Universal Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEnterprise ? '企业财务中心' : '个人收益钱包'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isEnterprise ? '全维度企业资金、预算与税务管理' : '追踪您的创作收益、储蓄目标与支出分析'}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
             <CreditCard className="w-4 h-4" />
             {isEnterprise ? '企业账户管理' : '银行卡管理'}
           </button>
           <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm">
             <ArrowUpRight className="w-4 h-4" />
             {isEnterprise ? '对公转账 / 提现' : '收益提现'}
           </button>
        </div>
      </div>

      {/* Role-Based Dashboard Content */}
      <div className="animate-fade-in">
        {isEnterprise ? <EnterpriseFinanceDashboard /> : <PersonalFinanceDashboard />}
      </div>

    </div>
  );
};

export default FinanceView;