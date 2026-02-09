import React from 'react';
import { Home, Upload, FolderOpen, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/helpers';

interface NavbarProps {
  currentPage: 'home' | 'upload' | 'files';
  onPageChange: (page: 'home' | 'upload' | 'files') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Upload className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">StaticFile</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onPageChange('home')}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                currentPage === 'home'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </button>
            <button
              onClick={() => onPageChange('upload')}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                currentPage === 'upload'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Upload className="w-4 h-4" />
              <span>上传</span>
            </button>
            <button
              onClick={() => onPageChange('files')}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                currentPage === 'files'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <FolderOpen className="w-4 h-4" />
              <span>我的文件</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2 px-3 py-2">
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden flex justify-around py-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onPageChange('home')}
            className={cn(
              'flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors',
              currentPage === 'home'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">首页</span>
          </button>
          <button
            onClick={() => onPageChange('upload')}
            className={cn(
              'flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors',
              currentPage === 'upload'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">上传</span>
          </button>
          <button
            onClick={() => onPageChange('files')}
            className={cn(
              'flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors',
              currentPage === 'files'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-xs">我的文件</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
