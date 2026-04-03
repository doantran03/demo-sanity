'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Members',
    icon: <Users size={20} />,
    href: '/members',
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Members');

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 lg:hidden z-30" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-y-auto transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">T</span>
            </div>
            <span className="text-lg font-bold">TailAdmin</span>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="px-4 py-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </p>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-700 transition"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition ${
                          expandedMenu === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedMenu === item.label && (
                      <ul className="mt-2 ml-8 space-y-2">
                        {item.submenu.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition font-medium"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
