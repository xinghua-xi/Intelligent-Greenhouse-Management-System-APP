import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, BrainCircuit, BellRing, User } from 'lucide-react-native';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract main path logic
  const currentPath = location.pathname.substring(1) || AppRoute.OVERVIEW;

  const navItems = [
    { id: AppRoute.OVERVIEW, label: '总览', icon: LayoutDashboard },
    { id: AppRoute.GREENHOUSE, label: '大棚', icon: Sprout },
    { id: AppRoute.SMART, label: '智能', icon: BrainCircuit },
    { id: AppRoute.ALERTS, label: '告警', icon: BellRing },
    { id: AppRoute.PROFILE, label: '我的', icon: User },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto shadow-2xl relative overflow-hidden md:border-x md:border-gray-200">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/95 backdrop-blur border-t border-gray-200 px-2 pt-2 pb-safe z-50 flex justify-between items-center h-[70px]">
        {navItems.map((item) => {
          const isActive = currentPath === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className="flex-1 flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 relative ${isActive ? '-translate-y-2' : ''}`}>
                {isActive && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-b-full"></div>
                )}
                <Icon size={24} className={isActive ? 'text-emerald-600' : 'text-gray-400'} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;