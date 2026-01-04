import React from 'react';
import { Check, AlertOctagon, Phone, Mic } from 'lucide-react-native';

const OverviewMinimal: React.FC = () => {
  const isHealthy = true; // Mock status

  return (
    <div className="h-full flex flex-col p-6 bg-white animate-fade-in pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">我家大棚</h1>
        <p className="text-lg text-gray-500 mt-2">今天是 5月24日</p>
      </header>

      {/* Main Status Indicator */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <div className={`w-64 h-64 rounded-full flex items-center justify-center shadow-2xl transition-all duration-1000 ${
          isHealthy ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'
        }`}>
            <div className="w-56 h-56 rounded-full border-4 border-white/30 flex items-center justify-center">
                {isHealthy ? (
                    <Check size={120} className="text-white drop-shadow-md" strokeWidth={3} />
                ) : (
                    <AlertOctagon size={120} className="text-white drop-shadow-md" />
                )}
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <h2 className={`text-4xl font-bold mb-3 ${isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
                {isHealthy ? '一切正常' : '需要关注'}
            </h2>
            <p className="text-xl text-gray-500 font-medium">
                {isHealthy ? '大棚里很舒服，不用管' : '1号棚有点缺水了'}
            </p>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="space-y-4">
        {!isHealthy && (
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-4">
                <span className="text-2xl font-bold">一键浇水</span>
            </button>
        )}
        
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-6 rounded-3xl active:scale-95 transition-transform flex items-center justify-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
                 <Mic size={32} className="text-emerald-600" />
            </div>
            <span className="text-xl font-bold">按住 说话</span>
        </button>

        <button className="w-full bg-white border-2 border-gray-100 text-gray-500 p-4 rounded-3xl flex items-center justify-center gap-2">
            <Phone size={20} />
            <span className="font-bold">呼叫农技员</span>
        </button>
      </div>
    </div>
  );
};

export default OverviewMinimal;