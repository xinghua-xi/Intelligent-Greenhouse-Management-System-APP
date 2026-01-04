import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Phone, Check } from 'lucide-react-native';
import { Alert } from '../types';

const AlertsPage: React.FC = () => {
  // Mock Alerts
  const alerts: Alert[] = [
    { id: '1', level: 'fatal', message: '1号棚主水泵故障，灌溉中断', source: '水泵控制器 #A1', timestamp: '10:23', handled: false },
    { id: '2', level: 'severe', message: '2号棚温度过高 (35°C)', source: '温湿度传感器 #T2', timestamp: '11:05', handled: false },
    { id: '3', level: 'reminder', message: '营养液桶液位低', source: '液位传感器 #L1', timestamp: '09:00', handled: true },
    { id: '4', level: 'reminder', message: '建议清洁光照传感器', source: '系统维护算法', timestamp: '昨天', handled: true },
  ];

  const renderAlertIcon = (level: string) => {
      switch(level) {
          case 'fatal': return <AlertOctagon className="text-white" size={24} />;
          case 'severe': return <AlertTriangle className="text-white" size={24} />;
          default: return <Info className="text-blue-500" size={24} />;
      }
  };

  const renderAlertBg = (level: string) => {
      switch(level) {
          case 'fatal': return 'bg-red-500 shadow-lg shadow-red-200';
          case 'severe': return 'bg-orange-500 shadow-lg shadow-orange-200';
          default: return 'bg-blue-50';
      }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col animate-fade-in">
       <div className="bg-white/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-20 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">告警中心</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">只在需要的时候打扰你</p>
        </div>
        <button className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
            全部已读
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
        {alerts.map((alert, idx) => (
            <div key={alert.id} className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-500 ${alert.handled ? 'opacity-60 grayscale' : 'hover:shadow-md'} animate-slide-up`} style={{animationDelay: `${idx * 0.1}s`}}>
                {alert.level === 'fatal' && !alert.handled && (
                    <div className="absolute top-0 right-0 p-2 bg-red-50 rounded-bl-2xl">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                )}
                
                <div className="flex gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${renderAlertBg(alert.level)}`}>
                        {renderAlertIcon(alert.level)}
                    </div>
                    
                    <div className="flex-1 py-0.5">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 text-sm leading-snug">{alert.message}</h3>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 font-mono bg-gray-50 px-1.5 rounded">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">来源: {alert.source}</p>
                        
                        {!alert.handled && (
                            <div className="flex gap-3">
                                {alert.level === 'fatal' ? (
                                    <button className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors">
                                        <Phone size={14} /> 联系维修
                                    </button>
                                ) : (
                                    <button className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={14} /> 一键处理
                                    </button>
                                )}
                            </div>
                        )}
                         {alert.handled && (
                            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-2">
                                <Check size={12} /> 已处理
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
        
        <div className="text-center py-6">
            <span className="text-xs text-gray-300 bg-gray-100 px-3 py-1 rounded-full">没有更多历史告警</span>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;