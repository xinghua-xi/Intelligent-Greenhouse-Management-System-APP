import React, { useState } from 'react';
import { BrainCircuit, Activity, Scan, Zap, Layers } from 'lucide-react-native';
import Diagnosis from './Diagnosis';

const SmartPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'decision' | 'twin'>('diagnosis');

  return (
    <div className="h-full flex flex-col bg-gray-50 animate-fade-in">
      <div className="bg-white px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5">智能中心</h1>
        
        {/* Modern Tab Switcher */}
        <div className="flex p-1.5 bg-gray-100 rounded-2xl relative">
            {/* Animated Background Pill */}
            <div 
                className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm transition-all duration-300 ease-spring"
                style={{
                    left: activeTab === 'diagnosis' ? '6px' : activeTab === 'decision' ? '33.3%' : '66.6%',
                    width: 'calc(33.3% - 4px)',
                    transform: activeTab === 'diagnosis' ? 'translateX(0)' : activeTab === 'decision' ? 'translateX(0)' : 'translateX(-2px)'
                }}
            ></div>

            <TabButton 
                active={activeTab === 'diagnosis'} 
                onClick={() => setActiveTab('diagnosis')} 
                icon={Scan} 
                label="病害识别" 
            />
            <TabButton 
                active={activeTab === 'decision'} 
                onClick={() => setActiveTab('decision')} 
                icon={BrainCircuit} 
                label="AI 决策" 
            />
            <TabButton 
                active={activeTab === 'twin'} 
                onClick={() => setActiveTab('twin')} 
                icon={Activity} 
                label="数字孪生" 
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'diagnosis' && (
             <div className="h-full bg-white animate-fade-in">
                <Diagnosis />
             </div>
        )}

        {activeTab === 'decision' && (
            <div className="p-5 space-y-4 animate-slide-up">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">今日优选策略</div>
                <DecisionCard 
                    title="生长周期预测" 
                    desc="基于当前累积光照 (DLI) 模型，预计番茄将于 5 天后进入转色期，建议提前准备采收人力。" 
                    tags={['光照积算', '积温模型']}
                    icon={Zap}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
                <DecisionCard 
                    title="水肥精准调控" 
                    desc="检测到果实膨大需求，建议明日将灌溉 EC 值从 1.8 提升至 2.0，重点补充钾肥。" 
                    tags={['膨果期需求', 'EC趋势']}
                    action="一键应用方案"
                    icon={Layers}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                 <DecisionCard 
                    title="能耗智能优化" 
                    desc="夜间室外温度预计骤降，建议保温帘提前 30 分钟放下，预计可节省 12% 加温能耗。" 
                    tags={['温差发电', '热损耗计算']}
                    icon={Activity}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                />
            </div>
        )}

        {activeTab === 'twin' && (
            <div className="p-5 animate-slide-up">
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white text-center h-96 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 shadow-2xl">
                     {/* Dynamic Background */}
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
                     <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                     {/* Central Graphic */}
                     <div className="relative z-10 w-40 h-40 mb-8">
                        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-4 border border-emerald-400/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse-slow"></div>
                             <Activity className="text-emerald-400 relative z-20 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" size={48} />
                        </div>
                        {/* Orbiting particles */}
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-float"></div>
                     </div>

                     <h3 className="text-2xl font-bold relative z-10 tracking-tight">专家模式模拟中</h3>
                     <p className="text-slate-400 text-xs mt-2 max-w-[200px] relative z-10 leading-relaxed">
                         数字孪生引擎正在计算最佳环境参数...
                     </p>
                     
                     <div className="mt-8 flex gap-4 w-full relative z-10">
                        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">预计增产</div>
                            <div className="text-xl font-black text-emerald-400">+5.2%</div>
                        </div>
                        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">风险系数</div>
                            <div className="text-xl font-black text-amber-400">Low</div>
                        </div>
                     </div>
                </div>
                
                <div className="mt-8 space-y-6">
                    <SliderControl label="模拟环境温度" value="26.5°C" />
                    <SliderControl label="模拟灌溉总量" value="120%" />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: any, label: string}> = ({active, onClick, icon: Icon, label}) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${
            active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
    >
        <Icon size={16} strokeWidth={active ? 2.5 : 2} />
        {label}
    </button>
);

const DecisionCard: React.FC<{title: string, desc: string, tags: string[], action?: string, icon: any, color: string, bgColor: string}> = ({title, desc, tags, action, icon: Icon, color, bgColor}) => (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
        <div className="flex items-start gap-4 mb-3">
            <div className={`p-3 rounded-2xl ${bgColor} ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-medium rounded border border-gray-100">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        
        <p className="text-xs text-gray-600 leading-relaxed mb-4 pl-1">{desc}</p>
        
        {action && (
            <button className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors active:scale-95 flex items-center justify-center gap-2">
                {action}
            </button>
        )}
    </div>
);

const SliderControl: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>{label}</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{value}</span>
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 h-full w-2/3 bg-emerald-500 rounded-full"></div>
            <div className="absolute top-1/2 left-2/3 w-5 h-5 bg-white border-2 border-emerald-500 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    </div>
);

export default SmartPage;