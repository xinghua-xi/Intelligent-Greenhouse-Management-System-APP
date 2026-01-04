import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Sprout } from 'lucide-react-native';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate(`/${AppRoute.OVERVIEW}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-teal-200 rounded-full filter blur-3xl opacity-50"></div>

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 relative z-10 border border-white">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">智农云</h1>
          <p className="text-gray-500 text-sm mt-1">让农业更懂生活</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">账号</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              placeholder="请输入管理员账号"
              defaultValue="admin"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">密码</label>
            <input 
              type="password" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              placeholder="请输入密码"
              defaultValue="123456"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked/>
                记住我
            </label>
            <span className="text-emerald-600 font-medium">忘记密码?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : "立即登录"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-gray-400">© 2024 SmartGreenhouse Tech</p>
    </div>
  );
};

export default Login;