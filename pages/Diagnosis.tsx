import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, Scan } from 'lucide-react-native';
import { getGeminiDiagnosis } from '../services/geminiService';
import { DiagnosisResult } from '../types';

const Diagnosis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      analyzeImage(base64String.split(',')[1]); 
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await getGeminiDiagnosis(base64);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("分析失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  // If Diagnosis is part of a tab, we remove the large header to avoid duplication
  return (
    <div className="h-full flex flex-col">
       {!image ? (
          <div className="flex-1 p-5 flex flex-col justify-center">
             <div className="border-2 border-dashed border-emerald-200 rounded-3xl bg-emerald-50 h-80 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>
                
                <div className="z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-2 group-active:scale-95 transition-transform">
                    <Camera size={28} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">拍摄叶片</h3>
                    <p className="text-xs text-emerald-600 mt-1">AI 识别病害类型与风险</p>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-black">
              <img src={image} alt="Crop" className="w-full h-full object-contain" />
              <button 
                onClick={reset}
                className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium z-10"
              >
                重拍
              </button>
              
              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-medium animate-pulse">正在诊断...</p>
                </div>
              )}
            </div>

            {result && (
              <div className="animate-fade-in-up space-y-4 pb-4">
                <div className={`p-5 rounded-2xl border-l-4 shadow-sm ${
                  result.condition === 'healthy' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-800">{result.plantName}</h2>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                       result.condition === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.condition === 'healthy' ? '健康' : '需关注'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Scan size={12} className="text-gray-400"/>
                    <span className="text-xs text-gray-500">置信度: {result.confidence}%</span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    {result.diagnosis}
                  </p>
                </div>

                {result.treatment && result.treatment.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      建议处理方案
                    </h3>
                    <ul className="space-y-3">
                      {result.treatment.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-600">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Diagnosis;