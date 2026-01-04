import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Zap, ChevronDown, CheckCircle, Leaf, CloudSun, Wind } from 'lucide-react-native';
import { getDailyAdvice } from '../services/geminiService';

const OverviewStandard: React.FC = () => {
  const [healthScore, setHealthScore] = useState(0);
  const [advice, setAdvice] = useState<{suggestion: string, reason: string} | null>(null);

  useEffect(() => {
    // Animate score
    setTimeout(() => setHealthScore(86), 100);
    getDailyAdvice().then(setAdvice);
  }, []);

  const circumference = 2 * Math.PI * 52; // Radius 52
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-24">
      <header className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs font-bold text-gray-400 mb-0.5 uppercase tracking-wide">欢迎回来</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">绿野生态农场</h1>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
            <CloudSun size={16} className="text-amber-500" />
            <span>24°C</span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">湿度 65% · 适宜</span>
        </div>
      </header>

      {/* 1. Health Index Ring */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        
        <div className="relative w-52 h-52 flex items-center justify-center my-2">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                <defs>
                  <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle cx="104" cy="104" r="52" stroke="#f3f4f6" strokeWidth="16" fill="transparent" />
                <circle 
                    cx="104" cy="104" r="52" 
                    stroke="url(#gradientScore)" 
                    strokeWidth="16" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black text-gray-800 tracking-tighter">{healthScore}</span>
                  <span className="text-sm font-bold text-gray-400 ml-1">/100</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">健康状况优</span>
            </div>
        </div>
        
        {/* Breakdown */}
        <div className="grid grid-cols-4 gap-4 w-full mt-6 text-center divide-x divide-gray-100">
            <MetricMini label="环境" val="92" color="bg-emerald-500" icon={Leaf} />
            <MetricMini label="水肥" val="78" color="bg-amber-400" icon={Droplets} />
            <MetricMini label="病害" val="95" color="bg-emerald-500" icon={CheckCircle} />
            <MetricMini label="能源" val="88" color="bg-emerald-500" icon={Zap} />
        </div>
      </div>

      {/* 2. Today's Risk Summary */}
      <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 ml-1">今日风险摘要</h2>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">AI 实时分析</span>
        </div>
        <div className="space-y-3">
             <RiskCard 
                type="warning" 
                title="根区含氧量下降" 
                desc="持续灌溉导致土壤孔隙度降低，建议控水。"
            />
            <RiskCard 
                type="info" 
                title="午后高温预警" 
                desc="预计 14:00 棚内温度超过 32℃，自动开启遮阳。"
            />
        </div>
      </div>

      {/* 3. AI Suggestion */}
      {advice && (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 animate-slide-up relative overflow-hidden group" style={{animationDelay: '0.2s'}}>
            <div className="absolute -right-12 -top-12 bg-white/10 w-40 h-40 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -left-12 -bottom-12 bg-indigo-400/20 w-40 h-40 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                          <Zap size={16} className="text-yellow-300 fill-yellow-300 animate-pulse-slow" />
                      </div>
                      <span className="font-bold text-sm tracking-wide text-indigo-100">AI 决策建议</span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-indigo-100 backdrop-blur-sm">置信度 98%</span>
              </div>
              
              <h3 className="text-lg font-bold mb-2 leading-tight tracking-tight">{advice.suggestion}</h3>
              <p className="text-indigo-100 text-xs mb-5 leading-relaxed opacity-90 font-medium">
                  依据：{advice.reason}
              </p>
              
              <div className="flex gap-3">
                  <button className="flex-1 bg-white text-indigo-700 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/10 active:scale-95 transition-transform flex items-center justify-center gap-2">
                      <CheckCircle size={14} />
                      一键执行
                  </button>
                  <button className="px-4 py-3 bg-indigo-700/50 text-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors backdrop-blur-sm">
                      忽略
                  </button>
              </div>
            </div>
        </div>
      )}

      {/* 4. Energy Status */}
      <div className="bg-slate-800 rounded-3xl p-6 text-slate-300 flex justify-between items-center shadow-xl shadow-slate-200 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1.5 bg-slate-700 rounded-lg">
                 <Zap size={12} className="text-amber-400" />
               </div>
               <span className="text-xs font-medium text-slate-400">能源续航</span>
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1 ml-1">
                12 <span className="text-xs font-normal text-slate-500">天</span>
            </div>
        </div>
        
        {/* Animated Battery/Energy Graphic Placeholder */}
        <div className="flex gap-1 items-end h-8">
           <div className="w-2 h-4 bg-emerald-500/30 rounded-sm"></div>
           <div className="w-2 h-6 bg-emerald-500/60 rounded-sm"></div>
           <div className="w-2 h-8 bg-emerald-500 rounded-sm animate-pulse"></div>
           <div className="w-2 h-5 bg-emerald-500/60 rounded-sm"></div>
        </div>

        <div className="text-right">
             <div className="text-xs text-slate-500 mb-1">当前来源</div>
             <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                太阳能
             </div>
        </div>
      </div>
    </div>
  );
};

const MetricMini: React.FC<{label: string, val: string, color: string, icon: any}> = ({label, val, color, icon: Icon}) => (
    <div className="flex flex-col items-center group">
        <div className="mb-2 text-gray-400 group-hover:text-emerald-600 transition-colors">
          <Icon size={16} />
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full ${color} rounded-full`} style={{width: `${val}%`}}></div>
        </div>
        <div className="text-xs font-bold text-gray-700">{val}</div>
        <div className="text-[9px] text-gray-400 mt-0.5 scale-90">{label}</div>
    </div>
);

const RiskCard: React.FC<{type: 'warning' | 'info', title: string, desc: string}> = ({type, title, desc}) => {
    const isWarning = type === 'warning';
    return (
        <div className={`p-4 rounded-2xl border flex items-start gap-4 transition-transform active:scale-[0.98] ${
            isWarning 
            ? 'bg-orange-50/80 border-orange-100 shadow-sm' 
            : 'bg-white border-gray-100 shadow-sm'
        }`}>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${isWarning ? 'bg-orange-100 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                {isWarning ? <AlertTriangle size={20} /> : <Wind size={20} />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h4 className={`text-sm font-bold ${isWarning ? 'text-gray-800' : 'text-gray-800'}`}>{title}</h4>
                   {isWarning && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                </div>
                <p className="text-xs mt-1 leading-relaxed text-gray-500">{desc}</p>
            </div>
        </div>
    );
}

export default OverviewStandard;