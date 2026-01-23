import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Wallet, 
  Layers, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  CreditCard,
  RefreshCw,
  Plus,
  Music,
  Heart,
  Briefcase,
  Lightbulb
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { useRealTimeData } from '../services/dashboardService';
import portfolioImage from 'figma:asset/0efcb9b1a3b9794f47a28fd25091901fd8a44db2.png';

// Mock Data for Charts (will be replaced with real data)
const chartData1 = [
  { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 75 }
];
const chartData2 = [
  { value: 60 }, { value: 55 }, { value: 40 }, { value: 35 }, { value: 30 }, { value: 25 }, { value: 20 }
];
const chartData3 = [
  { value: 20 }, { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 55 }
];

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

// Stat Card Component
const StatCard = ({ title, value, change, data, color, isDown, icon }: any) => {
  const getIcon = () => {
    switch(icon) {
      case 'music': return <Music size={20} />;
      case 'heart': return <Heart size={20} />;
      case 'briefcase': return <Briefcase size={20} />;
      case 'ai': return <Lightbulb size={20} />;
      default: return <Wallet size={20} />;
    }
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/80">{title}</h3>
            <p className="text-xs text-white/40">Last 30 days</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isDown ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
        }`}>
          {isDown ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fill={color} 
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Table Row Component
const TableRow = ({ date, amount, project, type, status, isPositive }: any) => (
  <div className="grid grid-cols-5 gap-4 items-center text-xs py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
    <div className="text-white/60">{date}</div>
    <div className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
      {isPositive ? '+' : '-'}{amount}
    </div>
    <div className="text-white/80">{project}</div>
    <div className="text-white/60">{type}</div>
    <div className="text-right">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'Completed' ? 'bg-green-500/20 text-green-400' :
        status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { projects, transactions, revenue, loading } = useRealTimeData();
  
  // Calculate real stats from Supabase data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const recentTransactions = transactions.slice(0, 4);
  
  // Dynamic pie data based on actual project types
  const projectTypes = projects.reduce((acc, project) => {
    acc[project.project_type] = (acc[project.project_type] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(projectTypes).map(([type, count], index) => ({
    name: type,
    value: count,
    color: ['#00D4FF', '#E91E63', '#F59E0B', '#FF7A00'][index] || '#888'
  }));

  const [activeTab, setActiveTab] = useState('transactions');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-[#FF7A00] flex items-center justify-center mb-4 mx-auto">
            <Layers size={32} className="text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2">Loading Dashboard</h2>
          <p className="text-white/60">Connecting to Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E91E63] flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">9LMNTS</h2>
              <p className="text-xs text-white/40">Studio OS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
              { icon: <Users size={18} />, label: 'Clients' },
              { icon: <CreditCard size={18} />, label: 'Billing' },
              { icon: <Settings size={18} />, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active 
                    ? 'bg-[#FF7A00] text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Create New Button */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-gradient-to-br from-[#FF7A00]/20 to-[#E91E63]/20 rounded-2xl p-4 border border-white/10">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mb-3">
                <Plus size={18} />
              </div>
              <h4 className="text-sm font-bold mb-1">Create New Project</h4>
              <p className="text-xs text-white/40 mb-3">Launch a new OS instance</p>
              <button className="w-full py-2 bg-[#00D4FF] text-black text-xs font-bold rounded-lg hover:bg-[#33E0FF] transition-colors">
                Create Now
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#E91E63]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Studio Overview</h1>
              <p className="text-xs text-white/40">Manage your 9LMNTS projects</p>
            </div>
            <button className="px-4 py-2 rounded-full bg-[#1A1A1A] border border-white/10 text-xs font-bold flex items-center gap-2 ml-4 hover:bg-white/5 transition-colors">
              Deposit <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-full bg-[#1A1A1A] border border-white/10 text-sm focus:outline-none focus:border-[#00D4FF]/50 w-64 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full border border-[#1A1A1A]" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Top Cards Row */}
        <section className="mb-8 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Active Projects</h2>
            <div className="flex gap-4 text-xs font-bold text-white/40">
              <span className="text-white">24H</span>
              <span className="hover:text-white cursor-pointer">WEEK</span>
              <span className="hover:text-white cursor-pointer">MONTH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Active Projects" 
              value={activeProjects.toString()} 
              change={projects.length > 0 ? "+1" : "0"} 
              data={chartData1} 
              color="#00D4FF"
              icon="music"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${(totalRevenue / 1000).toFixed(2)}k`} 
              change={transactions.length > 0 ? "+8.3%" : "0%"} 
              data={chartData2} 
              color="#E91E63" 
              icon="heart"
            />
            <StatCard 
              title="Clients" 
              value={projects.length.toString()} 
              change={projects.length > 0 ? "+2" : "0"} 
              data={chartData3} 
              color="#F59E0B"
              icon="briefcase"
            />
            <StatCard 
              title="AI Element" 
              value={projects.filter(p => p.project_type === 'AI Element').length.toString()} 
              change={projects.filter(p => p.project_type === 'AI Element').length > 0 ? "+18.7%" : "0%"} 
              data={chartData1} 
              color="#FF7A00"
              icon="ai"
            />
          </div>
        </section>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Column: Transactions */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Activities</h2>
              <button className="text-xs font-bold text-[#00D4FF] hover:text-white transition-colors">
                View All <ChevronRight size={12} className="inline" />
              </button>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden p-6">
              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b border-white/5 pb-1">
                {['Transactions', 'Deposits', 'Withdrawals'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                      activeTab === tab.toLowerCase()
                        ? 'text-white border-[#FF7A00]'
                        : 'text-white/40 border-transparent hover:text-white/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-2">
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Project</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1 text-right">Status</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-2">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <TableRow 
                      key={transaction.id || index}
                      date={new Date(transaction.created_at).toLocaleDateString()}
                      amount={`$${(transaction.amount || 0).toFixed(2)}`}
                      project={transaction.project_id || 'Unknown'}
                      type={transaction.type || 'Transaction'}
                      status={transaction.status || 'Pending'}
                      isPositive={transaction.type === 'deposit'}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <p>No transactions yet</p>
                    <p className="text-sm mt-2">Transactions will appear here when clients make payments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Portfolio & Assets */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Portfolio Card */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
               {/* Background Image Effect */}
               <div 
                className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500 mix-blend-screen"
                style={{ 
                  backgroundImage: `url(${portfolioImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
               />

               {/* Content */}
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold">Portfolio</h3>
                   <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                     <MoreHorizontal size={16} className="text-white/60" />
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-white/60">Total Value</span>
                     <span className="text-lg font-bold">${(totalRevenue / 1000).toFixed(1)}K</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-white/60">24h Change</span>
                     <span className="text-sm font-bold text-green-400">+12.4%</span>
                   </div>
                 </div>

                 <div className="w-full h-1 bg-white/10 my-4" />

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-white/40 mb-1">Projects</p>
                     <p className="text-lg font-bold">{projects.length}</p>
                   </div>
                   <div>
                     <p className="text-xs text-white/40 mb-1">Active</p>
                     <p className="text-lg font-bold text-green-400">{activeProjects}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Assets Card */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Project Types</h3>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCw size={16} className="text-white/60" />
                </button>
              </div>

              {/* Pie Chart */}
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <div className="w-1/2 h-[120px] relative min-w-0">
                     <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                         <Pie
                           data={pieData}
                           innerRadius={40}
                           outerRadius={55}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                         >
                           {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                       </RePieChart>
                     </ResponsiveContainer>
                     {/* Center Icon */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <Wallet size={20} className="text-white/40" />
                     </div>
                  </div>
                  
                  <div className="w-1/2 space-y-3">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-white/60">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}