import React from 'react';
import { FileIcon, Download, HardDrive, TrendingUp } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';
import type { FileStats } from '../types';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('500', '100')} dark:${color.replace('text-', 'bg-').replace('500', '900')}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface DashboardStatsProps {
  stats: FileStats | null;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatsCard
        icon={<FileIcon className="w-6 h-6 text-primary-500" />}
        title="总文件数"
        value={stats.totalFiles}
        color="text-primary-500"
      />
      <StatsCard
        icon={<HardDrive className="w-6 h-6 text-green-500" />}
        title="存储空间"
        value={formatFileSize(stats.totalSize)}
        color="text-green-500"
      />
      <StatsCard
        icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
        title="总下载次数"
        value={stats.totalDownloads}
        color="text-purple-500"
      />
    </div>
  );
};
