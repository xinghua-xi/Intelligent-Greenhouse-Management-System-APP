import React, { useState, useEffect } from 'react';
import { Save, WifiOff, CloudUpload, Clock, Check } from 'lucide-react-native';
import { OfflineRecord } from '../types';

const DataEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    cropType: '番茄',
    growthStage: '开花期',
    height: '',
    pestCount: '',
    notes: ''
  });

  const [queue, setQueue] = useState<OfflineRecord[]>([]);

  // Simulate loading from local storage
  useEffect(() => {
    const saved = localStorage.getItem('offlineData');
    if (saved) {
      setQueue(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: OfflineRecord = {
      id: Date.now().toString(),
      ...formData,
      height: Number(formData.height),
      pestCount: Number(formData.pestCount) || 0,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const newQueue = [newRecord, ...queue];
    setQueue(newQueue);
    localStorage.setItem('offlineData', JSON.stringify(newQueue));
    
    // Reset form
    setFormData(prev => ({ ...prev, height: '', pestCount: '', notes: '' }));
    alert('数据已保存到本地缓存');
  };

  const syncData = () => {
    // Simulate sync
    const syncedQueue = queue.map(q => ({ ...q, synced: true }));
    setQueue(syncedQueue);
    localStorage.setItem('offlineData', JSON.stringify(syncedQueue));
    alert('数据同步成功');
  };

  const pendingCount = queue.filter(q => !q.synced).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white p-5 pb-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">数据采集</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <WifiOff size={14} /> 离线模式已启用
                </p>
            </div>
            <button 
                onClick={syncData}
                disabled={pendingCount === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pendingCount > 0 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-gray-100 text-gray-400'
                }`}
            >
                <CloudUpload size={16} />
                同步 ({pendingCount})
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm space-y-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">手动录入</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">作物类型</label>
                <select 
                    name="cropType" 
                    value={formData.cropType} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option>番茄</option>
                    <option>黄瓜</option>
                    <option>甜椒</option>
                    <option>草莓</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">生长阶段</label>
                <select 
                    name="growthStage" 
                    value={formData.growthStage} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option>苗期</option>
                    <option>生长期</option>
                    <option>开花期</option>
                    <option>结果期</option>
                </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">株高 (cm)</label>
            <input 
              type="number" 
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="0.0"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">虫害计数 (非必填)</label>
            <input 
              type="number" 
              name="pestCount"
              value={formData.pestCount}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">备注</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow-emerald-200 shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Save size={18} />
            保存记录
          </button>
        </form>

        <div className="space-y-3 pb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">本地记录队列</h3>
            {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">暂无待上传记录</div>
            ) : (
                queue.map(record => (
                    <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{record.cropType}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{record.growthStage}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock size={10} />
                                {new Date(record.timestamp).toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                        <div className={`p-2 rounded-full ${record.synced ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}>
                            {record.synced ? <Check size={18} /> : <CloudUpload size={18} />}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default DataEntry;