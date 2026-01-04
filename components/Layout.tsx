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
  const currentPath = location.pathname.split('/')[1] || AppRoute.OVERVIEW;

  // Don't show layout on login page
  if (currentPath === AppRoute.LOGIN) {
    return <>{children}</>;
  }

  const navItems = [
    { id: AppRoute.OVERVIEW, label: '总览', icon: LayoutDashboard },
    { id: AppRoute.GREENHOUSE, label: '大棚', icon: Sprout },
    { id: AppRoute.SMART, label: '智能', icon: BrainCircuit },
    { id: AppRoute.ALERTS, label: '告警', icon: BellRing },
    { id: AppRoute.PROFILE, label: '我的', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full glass border-t border-gray-200/50 px-2 py-2 flex justify-between items-center pb-safe z-50">
        {navItems.map((item) => {
          const isActive = currentPath === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              className={`flex-1 flex flex-col items-center justify-center h-14 active:scale-95 transition-all duration-200 relative group`}
            >
              <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-b-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
              
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-emerald-600 translate-y-[-2px]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 transition-all duration-300 ${isActive ? 'text-emerald-600 opacity-100' : 'text-gray-400 opacity-0 transform translate-y-2'}`}>
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