import React, { useState } from 'react';
import { ChevronLeft, Box, List, Wind, Droplets, Thermometer, MoreVertical, Layers, Power, TrendingUp, TrendingDown, Sun, Zap, BrainCircuit } from 'lucide-react-native';
import { Greenhouse } from '../types';

const GreenhousePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Mock Data
  const greenhouses: Greenhouse[] = [
    { id: '1', name: '1号 智能番茄棚', crop: '番茄', stage: '结果期', status: 'normal', healthScore: 92, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
    { id: '2', name: '2号 育苗实验棚', crop: '甜椒', stage: '幼苗期', status: 'warning', healthScore: 65, image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
  ];

  if (selectedId) {
    const gh = greenhouses.find(g => g.id === selectedId);
    return (
        <div className="h-full bg-gray-50 flex flex-col animate-fade-in">
            {/* Detail Header */}
            <div className="bg-white/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-30">
                <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-700"/>
                </button>
                <div className="text-center">
                    <h2 className="font-bold text-gray-800 text-sm">{gh?.name}</h2>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center justify-center gap-1 mt-0.5 mx-auto w-fit">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        设备在线
                    </span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={24} className="text-gray-700"/>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* 1. Spatial Visualization */}
                <div className="h-72 bg-slate-900 relative overflow-hidden group">
                     {/* Background Grid Pattern */}
                     <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

                    <div className="absolute top-4 right-4 z-20 flex bg-slate-800/90 rounded-xl p-1 backdrop-blur-md border border-slate-700 shadow-lg">
                        <button 
                            onClick={() => setViewMode('2d')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === '2d' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('3d')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === '3d' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Box size={18} />
                        </button>
                    </div>

                    {/* CSS Grid Visualization */}
                    <div className={`w-full h-full p-8 flex items-center justify-center transition-transform duration-700 ease-in-out ${viewMode === '3d' ? 'perspective-1000' : ''}`}>
                         <div className={`grid grid-cols-3 gap-4 w-64 h-64 transition-transform duration-700 ease-in-out ${viewMode === '3d' ? 'transform rotateX(55deg) rotateZ(-45deg) scale-75' : ''}`}>
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className={`
                                    relative flex items-center justify-center cursor-pointer transition-all duration-300 group-item
                                    ${i === 4 ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700'}
                                    border rounded-lg backdrop-blur-sm
                                    ${viewMode === '3d' ? 'hover:-translate-y-4 hover:shadow-xl' : 'hover:scale-105'}
                                `}>
                                    {i === 4 && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse rounded-lg"></div>}
                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${i===4 ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                                    <span className="absolute bottom-1 right-2 text-[8px] font-mono opacity-50 text-white">Z-{i+1}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <span className="text-white/70 text-xs bg-slate-800/80 px-2 py-1 rounded-md backdrop-blur-sm border border-slate-700">
                             {viewMode === '3d' ? '3D 空间视图' : '平面分区视图'}
                        </span>
                    </div>
                </div>

                {/* 2. Zone Detail Card */}
                <div className="px-5 -mt-8 relative z-10 animate-slide-up">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    A2-中心区域
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">湿润</span>
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <Layers size={12} /> 数据融合分析正常
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <SensorItem label="土壤水分(10cm)" value="45.2" unit="%" icon={Droplets} trend="up" />
                            <SensorItem label="EC 值" value="1.2" unit="mS/cm" icon={Zap} trend="stable" />
                            <SensorItem label="根系吸水" value="-12%" unit="效率" highlight icon={Layers} trend="down" />
                            <SensorItem label="光照强度" value="High" unit="" icon={Sun} trend="up" />
                        </div>
                    </div>
                </div>

                {/* 3. Control Panel */}
                <div className="px-5 py-6 space-y-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <h3 className="font-bold text-gray-900 text-sm ml-1 flex items-center gap-2">
                        控制与执行
                        <span className="w-full h-px bg-gray-100"></span>
                    </h3>
                    
                    {/* Mode Toggle */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-all active:scale-[0.99]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <BrainCircuit size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-800">AI 托管模式</div>
                                <div className="text-xs text-gray-400 mt-0.5">系统自动调节水肥配比</div>
                            </div>
                        </div>
                        <div className="w-14 h-8 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner transition-colors">
                            <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
                        </div>
                    </div>

                    {/* Manual Controls (Disabled visual) */}
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200/60 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gray-100/50 z-10 backdrop-blur-[1px]"></div>
                         <div className="relative z-0 opacity-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-gray-700">手动灌溉</span>
                                <Power size={18} className="text-gray-400" />
                            </div>
                            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                                <div className="w-0 h-full bg-gray-400"></div>
                            </div>
                         </div>
                         
                         {/* Overlay Text */}
                         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                             <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-bold text-gray-600">AI 托管运行中</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="p-5 space-y-5 animate-fade-in pb-24">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">大棚管理</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">共 {greenhouses.length} 个区域接入 · <span className="text-emerald-600">全部在线</span></p>
      </header>

      {greenhouses.map((gh, idx) => (
          <div key={gh.id} onClick={() => setSelectedId(gh.id)} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-5 active:scale-[0.98] transition-all hover:shadow-md cursor-pointer animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-inner relative">
                  <img src={gh.image} alt={gh.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {gh.crop}
                  </div>
              </div>
              <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-base">{gh.name}</h3>
                        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shadow-sm border border-white ${gh.status === 'normal' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium bg-gray-50 inline-block px-2 py-1 rounded-md">{gh.stage}</div>
                  </div>
                  
                  <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>健康指数</span>
                          <span className={`${gh.healthScore > 80 ? 'text-emerald-600' : 'text-amber-500'} font-bold`}>{gh.healthScore}</span>
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${gh.healthScore > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`} style={{width: `${gh.healthScore}%`}}></div>
                      </div>
                  </div>
              </div>
          </div>
      ))}
    </div>
  );
};

const SensorItem: React.FC<{label: string, value: string, unit: string, icon: any, highlight?: boolean, trend?: 'up'|'down'|'stable'}> = ({label, value, unit, icon: Icon, highlight, trend}) => (
    <div className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors">
        <div className={`p-2.5 rounded-xl shadow-sm ${highlight ? 'bg-red-50 text-red-500' : 'bg-white border border-gray-100 text-gray-500'}`}>
            <Icon size={18} />
        </div>
        <div>
            <div className={`text-sm font-bold flex items-center gap-1 ${highlight ? 'text-red-600' : 'text-gray-800'}`}>
                {value} <span className="text-[10px] font-normal text-gray-400">{unit}</span>
                {trend === 'up' && <TrendingUp size={10} className="text-red-400" />}
                {trend === 'down' && <TrendingDown size={10} className="text-emerald-400" />}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">{label}</div>
        </div>
    </div>
);

export default GreenhousePage;