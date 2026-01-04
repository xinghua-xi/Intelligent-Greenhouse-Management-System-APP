import React from 'react';
import { User, Settings, LogOut, Shield, ChevronRight, Layers, Database, Gauge, Crown } from 'lucide-react-native';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { useAppMode } from '../context/AppModeContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppMode();

  const handleLogout = () => {
    navigate(`/${AppRoute.LOGIN}`);
  };

  const getModeLabel = (m: string) => {
      switch(m) {
          case 'minimal': return '极简 (小农)';
          case 'expert': return '专家 (极客)';
          default: return '标准';
      }
  }

  return (
    <div className="h-full bg-gray-50 animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-emerald-600 pt-12 pb-20 px-6 relative overflow-hidden rounded-b-[3rem] shadow-xl shadow-emerald-200/50">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full transform -translate-x-8 translate-y-8 blur-2xl"></div>
        
        <div className="flex items-center gap-5 relative z-10 animate-slide-up">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-500/50 p-1 relative">
             <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
                 <img src={require('../assets/avatar.jpg')} alt="Avatar" className="w-full h-full object-cover"/>
             </div>
             <div className="absolute bottom-0 right-0 bg-amber-400 p-1 rounded-full border-2 border-emerald-600">
                <Crown size={12} className="text-white fill-white" />
             </div>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-tight">赵亮</h1>
            <p className="text-emerald-100 text-xs font-medium opacity-90 mt-1 bg-emerald-700/50 inline-block px-2 py-0.5 rounded-lg backdrop-blur-sm">
                绿野生态农场 | 超级管理员
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 relative z-10 space-y-5">
        {/* Mode Switch Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-5 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">操作模式</h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">当前: {getModeLabel(mode)}</span>
            </div>
            <div className="flex bg-gray-50 rounded-2xl p-1.5 relative border border-gray-100">
                 <button 
                    onClick={() => setMode('minimal')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mode === 'minimal' ? 'bg-white text-emerald-600 shadow-sm border border-gray-100 scale-105' : 'text-gray-400 hover:bg-white hover:shadow-sm'
                    }`}
                 >极简</button>
                 <button 
                    onClick={() => setMode('standard')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mode === 'standard' ? 'bg-white text-emerald-600 shadow-sm border border-gray-100 scale-105' : 'text-gray-400 hover:bg-white hover:shadow-sm'
                    }`}
                 >标准</button>
                 <button 
                    onClick={() => setMode('expert')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mode === 'expert' ? 'bg-white text-emerald-600 shadow-sm border border-gray-100 scale-105' : 'text-gray-400 hover:bg-white hover:shadow-sm'
                    }`}
                 >专家</button>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center">
                {mode === 'minimal' && '极简模式：大字版，只看结果，语音操作。'}
                {mode === 'standard' && '标准模式：平衡了自动化与手动控制，适合日常管理。'}
                {mode === 'expert' && '专家模式：显示原始传感器数据与图表，支持极客调试。'}
            </p>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
            <MenuItem icon={Layers} label="数据溯源 (Blockchain)" subText="已上链" />
            <MenuItem icon={Database} label="肥料使用记录" />
            <MenuItem icon={Gauge} label="碳足迹 / 碳汇" badgeCount={12} hasBadge />
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden animate-slide-up" style={{animationDelay: '0.3s'}}>
            <MenuItem icon={Shield} label="设备自检" />
            <MenuItem icon={Settings} label="系统设置" />
        </div>

        <button 
            onClick={handleLogout}
            className="w-full bg-white rounded-3xl p-4 text-center text-red-500 font-bold text-sm shadow-sm hover:bg-red-50 transition-colors animate-slide-up"
            style={{animationDelay: '0.4s'}}
         >
            退出登录
        </button>

        <p className="text-center text-[10px] text-gray-300 mt-6 font-mono">
            智农云 v2.0.0 (Pro) Build 2405
        </p>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{
    icon: any, 
    label: string, 
    subText?: string, 
    hasBadge?: boolean, 
    badgeCount?: number
}> = ({ icon: Icon, label, subText, hasBadge, badgeCount }) => (
    <button className="w-full flex items-center gap-4 p-4 text-left border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors group">
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <Icon size={18} />
        </div>
        <span className="flex-1 font-bold text-gray-700 text-sm">{label}</span>
        {subText && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{subText}</span>}
        {hasBadge && (
            <span className="min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1.5 shadow-sm shadow-red-200">
                {badgeCount}
            </span>
        )}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
    </button>
);

export default Profile;