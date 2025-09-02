'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SubNavItem {
  label: string;
  icon: string;
  href: string;
}

interface NavItem {
  label: string;
  icon: string;
  href?: string;
  dropdown?: string | null;
  navItems?: SubNavItem[];
}

export default function LichessNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const navItems: NavItem[] = [
    {
      label: 'Profile',
      icon: '👤',
      href: '/profile',
      dropdown: null,
      navItems: []
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-900 shadow-2xl border-b-4 border-amber-600 sticky top-0 z-50">
      {/* Chess Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(#8b4513 0% 25%, #d4a574 25% 50%)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center">
              <span className="text-3xl">♔</span>
              <span className="text-2xl font-bold text-amber-100 ml-2">Claude Vibe-Coded Lichess</span>
              <span className="text-3xl ml-2">♛</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle(item.dropdown!)}
                      className="flex items-center px-4 py-2 rounded-lg text-amber-100 hover:bg-amber-700/50 transition-all duration-200 font-medium"
                    >
                      <span className="text-lg mr-2">{item.icon}</span>
                      {item.label}
                      <span className={`ml-2 text-sm transition-transform duration-200 ${
                        activeDropdown === item.dropdown ? 'rotate-180' : ''
                      }`}>
                        ▼
                      </span>
                    </button>

                    {activeDropdown === item.dropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg shadow-2xl border-2 border-amber-600 py-2 z-50">
                        {item.navItems?.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={closeDropdown}
                            className="flex items-center px-4 py-3 text-amber-100 hover:bg-amber-700/50 transition-all duration-200"
                          >
                            <span className="text-lg mr-3">{subItem.icon}</span>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex items-center px-4 py-2 rounded-lg text-amber-100 hover:bg-amber-700/50 transition-all duration-200 font-medium"
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center px-3 py-2 rounded-lg text-amber-100 hover:bg-amber-700/50 transition-all duration-200"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-amber-800 to-amber-900 shadow-2xl border-t-2 border-amber-600 py-4 z-40">
            <div className="container mx-auto px-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(item.dropdown!)}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-amber-100 hover:bg-amber-700/50 transition-all duration-200 font-medium"
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{item.icon}</span>
                            {item.label}
                          </div>
                          <span className={`text-sm transition-transform duration-200 ${
                            activeDropdown === item.dropdown ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </span>
                        </button>
                        
                        {activeDropdown === item.dropdown && (
                          <div className="ml-8 mt-2 space-y-1">
                            {item.navItems?.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={() => {
                                  closeDropdown();
                                  setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center px-4 py-2 rounded text-amber-100 hover:bg-amber-700/50 transition-all duration-200"
                              >
                                <span className="text-lg mr-3">{subItem.icon}</span>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-amber-100 hover:bg-amber-700/50 transition-all duration-200 font-medium"
                      >
                        <span className="text-lg mr-3">{item.icon}</span>
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {(activeDropdown || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            closeDropdown();
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}