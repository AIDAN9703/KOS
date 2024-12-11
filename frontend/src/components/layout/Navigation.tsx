'use client'

import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../auth/AuthProvider';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, TicketIcon, QuestionMarkCircleIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

interface DropdownItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  const dropdownItems: DropdownItem[] = [
    {
      label: "My Account",
      href: "/my-profile",
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    ...(user?.role === 'ADMIN' ? [{
      label: "Admin Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    }] : []),
    {
      label: "Favorites",
      href: "/favorites",
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      label: "Invite a Friend",
      href: "/invite",
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const hamburger = document.getElementById('hamburger-button');
      if (menu && hamburger && !menu.contains(event.target as Node) && !hamburger.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const profileButton = document.getElementById('profile-button');
      if (dropdown && profileButton && 
          !dropdown.contains(event.target as Node) && 
          !profileButton.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Helper function to check if a link is active
  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  // Hide navbar for admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`w-full z-50 ${
      isHomePage 
        ? `fixed top-0 ${scrolled ? 'bg-[#21336a] shadow-md' : 'bg-transparent'}` 
        : 'sticky top-0 bg-white shadow-md'
    } transition-all duration-300`}>
      <nav className={`
        mx-2 
        sm:mx-4 
        md:mx-6 
        lg:mx-8 
        py-3 
        flex 
        items-center 
        justify-between
        transition-transform 
        duration-300 
        ${isMenuOpen ? 'translate-x-64' : ''}
      `}>
        <div className="flex items-center">
          {/* Hamburger menu button */}
          <button
            id="hamburger-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              ${isHomePage ? 'text-white' : 'text-[#21336a]'} 
              focus:outline-none 
              pr-2 
              sm:pr-4
            `}
            aria-label="Toggle menu"
          >
            <svg className="h-8 w-8 sm:h-8 sm:w-8 xs:h-8 xs:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
              <Image
                src="/images/logo.png" 
                alt="KOS Yachts Logo" 
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Main navigation items */}
        <div className="hidden md:flex items-center ml-4 lg:ml-6 font-semibold tracking-widest">
          {['EXPERIENCES', 'OUR FLEET','DEALS', 'ABOUT US', 'CONTACT US'].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, '-')}`}
              className={`
                ${isLinkActive(`/${item.toLowerCase().replace(/ /g, '-')}`) 
                  ? 'text-[#21336a] font-bold' 
                  : isHomePage 
                    ? scrolled 
                      ? 'text-white hover:text-gray-200' 
                      : 'text-white hover:text-[#21336a]' 
                    : 'text-[#21336a] hover:text-blue-900'} 
                relative 
                px-3
                lg:px-4
                py-2
                text-xs
                lg:text-sm
                transition-all 
                duration-300
                group
              `}
            >
              {item}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 transform ${isLinkActive(`/${item.toLowerCase().replace(/ /g, '-')}`) ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 ${isHomePage ? 'bg-[#21336a]' : 'bg-white'}`}></span>
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Gear Icon for Admins */}
              {user.role === 'ADMIN' && (
                <Link href="/admin" className={`
                  ${isHomePage ? 'text-white hover:text-gray-200' : 'text-[#21336a] hover:text-blue-900'} 
                  p-2 
                  rounded-full 
                  transition-colors 
                  duration-300
                  flex 
                  items-center 
                  justify-center
                `}>
                  <Cog6ToothIcon className="w-6 h-6" />
                </Link>
              )}

              {/* Profile Picture with Dropdown */}
              <div className="relative">
                <button 
                  id="profile-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative group focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:border-[#21336a]">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className={`
                        w-full 
                        h-full 
                        flex 
                        items-center 
                        justify-center 
                        ${isHomePage ? 'bg-white text-[#21336a]' : 'bg-[#21336a] text-white'}
                      `}>
                        {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        {user?.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div id="profile-dropdown" className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div 
                      className="py-1" 
                      role="menu" 
                      aria-orientation="vertical" 
                      aria-labelledby="options-menu"
                    >
                      {dropdownItems.map((item, index) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`
                            flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                            ${index !== dropdownItems.length - 1 ? 'border-b border-gray-100' : ''}
                          `}
                          onClick={() => setShowDropdown(false)}
                          role="menuitem"
                        >
                          <span className="mr-3 text-gray-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                        aria-label="Sign Out"
                      >
                        <span className="mr-3 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link 
                href="/owner-signup" 
                className={`
                  ${isHomePage ? 'text-white' : 'text-[#21336a]'} 
                  px-2
                  sm:px-4 
                  py-2 
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-widest 
                  transition-all 
                  duration-300
                  relative
                  group
                  hidden sm:block
                `}
              >
                LIST MY BOAT
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isHomePage ? 'bg-[#21336a]' : 'bg-white'}`}></span>
              </Link>

              <Link 
                href="/login" 
                className={`
                  ${isHomePage ? 'text-white' : 'text-[#21336a]'} 
                  px-2
                  sm:px-4 
                  py-2 
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-widest 
                  transition-all 
                  duration-300
                  relative
                  group
                `}
              >
                LOGIN
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isHomePage ? 'bg-[#21336a]' : 'bg-white'}`}></span>
              </Link>

              <Link 
                href="/register" 
                className={`
                  ${isHomePage ? 'bg-white text-[#21336a]' : 'bg-[#21336a] text-white'} 
                  px-4
                  sm:px-6 
                  py-2 
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-widest 
                  rounded-full
                  transition-all 
                  duration-300
                  hover:opacity-90
                `}
              >
                REGISTER
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`
          fixed 
          left-0 
          top-0 
          h-full 
          w-64 
          bg-white 
          shadow-lg 
          z-50 
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-[#21336a] hover:text-[#b3a57c] transition-colors duration-300"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu items */}
        <div className="p-6 pt-16 space-y-4">
          {[
            'OUR SERVICES',
            'KOS YACHT CLUB MEMBERSHIP',
            'FAQ',
            'NEWS',
            'STORE',
            'SUPPORT' // Added Support link
          ].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, '-')}`}
              className={`
                block 
                px-4 
                py-3 
                text-[#21336a] 
                hover:bg-[#21336a] 
                hover:text-white 
                rounded-lg 
                transition-all 
                duration-300
                text-base
                font-semibold
              `}
            >
              {item}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin-dashboard"
              className={`
                block 
                px-4 
                py-3 
                text-[#21336a] 
                hover:bg-[#21336a] 
                hover:text-white 
                rounded-lg 
                transition-all 
                duration-300
                text-base
                font-semibold
              `}
            >
              ADMIN DASHBOARD
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

// Helper functions
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryIcon(category: string) {
  switch(category) {
    case 'destinations':
      return <MapPinIcon className="w-5 h-5 text-[#21336a]" />;
    case 'booking':
      return <TicketIcon className="w-5 h-5 text-[#21336a]" />;
    case 'yachts':
      return (
        <svg className="w-5 h-5 text-[#21336a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10c0-1.105-.895-2-2-2h-1l1.293-1.293a1 1 0 00-1.414-1.414L14 7H9L7.707 5.707a1 1 0 00-1.414 1.414L8 9H7c-1.105 0-2 .895-2 2l.007 1.993A3.003 3.003 0 004 18v1a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011.993-.117L9 17h6l.007 1.993A1.003 1.003 0 0115 19h2a1 1 0 001-1v-1a3.003 3.003 0 00-1.993-2.993L17 15h-1c-1.105 0-2-.895-2-2V10z" />
        </svg>
      );
    case 'experience':
      return <QuestionMarkCircleIcon className="w-5 h-5 text-[#21336a]" />;
    case 'safety':
      return <ShieldCheckIcon className="w-5 h-5 text-[#21336a]" />;
    case 'payment':
      return <CurrencyDollarIcon className="w-5 h-5 text-[#21336a]" />;
    default:
      return <QuestionMarkCircleIcon className="w-5 h-5 text-[#21336a]" />;
  }
}
