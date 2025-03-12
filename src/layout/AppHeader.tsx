"use client";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import React, { useEffect, useState } from "react";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode based on system preference or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference if no saved preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update the document class
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          <div className="flex items-center">
            <button
              className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border mr-3"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                // Sun icon for light mode
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM12 5.25C8.27208 5.25 5.25 8.27208 5.25 12C5.25 15.7279 8.27208 18.75 12 18.75C15.7279 18.75 18.75 15.7279 18.75 12C18.75 8.27208 15.7279 5.25 12 5.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5564 3.75 20.25 7.44365 20.25 12C20.25 16.5564 16.5564 20.25 12 20.25C7.44365 20.25 3.75 16.5564 3.75 12ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25ZM22 12C22.4142 12 22.75 11.6642 22.75 11.25C22.75 10.8358 22.4142 10.5 22 10.5H21C20.5858 10.5 20.25 10.8358 20.25 11.25C20.25 11.6642 20.5858 12 21 12H22ZM3.75 11.25C3.75 11.6642 3.41421 12 3 12H2C1.58579 12 1.25 11.6642 1.25 11.25C1.25 10.8358 1.58579 10.5 2 10.5H3C3.41421 10.5 3.75 10.8358 3.75 11.25ZM19.779 4.2207C20.0718 4.51363 20.0716 4.98849 19.7787 5.28133L19.0858 5.97427C18.7929 6.26711 18.318 6.26689 18.0252 5.97378C17.7324 5.68066 17.7326 5.20581 18.0257 4.91296L18.7185 4.22003C19.0114 3.92719 19.4863 3.92741 19.779 4.2207ZM5.97467 18.0251C6.26759 18.318 5.20524 18.7927 4.91262 19.0853L4.2199 19.7781C3.9271 20.0711 3.45224 20.0713 3.15921 19.7784C2.86618 19.4855 2.86603 19.0107 3.15884 18.7178L3.85156 18.025C4.14438 17.7321 4.61924 17.7322 4.91227 18.0252L5.97467 18.0251ZM19.78 19.779C19.4871 20.0719 19.0122 20.0717 18.7194 19.7786L18.0264 19.0857C17.7336 18.7929 17.7337 18.318 18.0268 18.0252C18.3199 17.7324 18.7948 17.7325 19.0876 18.0257L19.7806 18.7186C20.0734 19.0114 20.0732 19.4863 19.78 19.779ZM5.97394 4.91227C6.26664 5.2053 6.26642 5.68016 5.97338 5.97296L5.28043 6.66568C4.9874 6.95848 4.51254 6.95826 4.21975 6.66522C3.92695 6.37219 3.92717 5.89733 4.2202 5.60453L4.91316 4.91181C5.20619 4.61901 5.68105 4.61923 5.97394 4.91227Z" 
                    fill="currentColor"
                  />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7767 21.25 20.7078 17.6293 21.1984 12.9826C21.2023 12.9333 21.1967 12.8838 21.1818 12.8364C21.1669 12.7891 21.1429 12.7447 21.1108 12.7053C21.0788 12.666 21.0392 12.6324 20.9944 12.6064C20.9496 12.5803 20.9005 12.5622 20.8493 12.5528C20.7981 12.5435 20.7456 12.5432 20.6942 12.5519C20.6429 12.5605 20.5935 12.578 20.5483 12.6034C20.5032 12.6288 20.4632 12.6617 20.4307 12.7005C20.3982 12.7393 20.3738 12.7833 20.3585 12.8302C19.8489 14.5391 18.8384 16.0343 17.4833 17.1219C16.1282 18.2095 14.4922 18.8333 12.7941 18.9028C11.096 18.9723 9.41797 18.4839 7.98931 17.5016C6.56066 16.5193 5.45475 15.0909 4.83146 13.4335C4.20817 11.7761 4.09903 9.96815 4.52053 8.24826C4.94203 6.52837 5.87201 4.9785 7.18335 3.81118C8.49469 2.64387 10.1251 1.911 11.8347 1.7093C11.8895 1.70359 11.942 1.68796 11.9886 1.66354C12.0353 1.63912 12.0749 1.60655 12.1047 1.5678C12.1346 1.52905 12.154 1.48499 12.1618 1.43855C12.1695 1.39211 12.1654 1.34458 12.1497 1.29975C12.134 1.25493 12.1071 1.21388 12.0714 1.17948C12.0356 1.14508 11.992 1.11814 11.9436 1.10049C11.8952 1.08284 11.8433 1.0749 11.7915 1.07717C11.7397 1.07945 11.6889 1.09188 11.6426 1.11356C11.4363 1.19608 11.2282 1.28393 11.0174 2.80157Z" 
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
            
            {/* User Dropdown */}
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;