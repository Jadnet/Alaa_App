import React from 'react';
import { Home, Users, ShoppingBag, FileText, Settings } from 'lucide-react';
import { Language, translations } from '../utils/translations';

export type TabType = 'home' | 'clients' | 'catalog' | 'contracts' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  overdueCount: number;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  overdueCount,
  lang,
}) => {
  const t = translations[lang];

  const tabs = [
    { id: 'home' as TabType, label: t.navHome, icon: Home },
    { id: 'clients' as TabType, label: t.navClients, icon: Users, badge: overdueCount },
    { id: 'catalog' as TabType, label: t.navCatalog, icon: ShoppingBag },
    { id: 'contracts' as TabType, label: t.navContracts, icon: FileText },
    { id: 'settings' as TabType, label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-stone-300 pb-[env(safe-area-inset-bottom,8px)] pt-1 text-[#24321D] shadow-lg">
      <div className="max-w-md mx-auto px-3 flex items-center justify-around h-15">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 py-1 transition-all rounded-xl cursor-pointer ${
                isActive
                  ? 'text-[#24321D] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.3] text-[#24321D]' : 'stroke-[1.6]'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'text-[#24321D] font-bold' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#C29B38] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
