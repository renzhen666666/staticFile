import React, { useState } from 'react';
import { Lock, Download, Eye } from 'lucide-react';
import { shareAPI } from '../utils/api';
import { formatFileSize, formatDate, isExpired, getFileIcon, isPreviewable } from '../utils/helpers';
import type { ShareFile } from '../types';

interface SharePageProps {
  shortLink: string;
}

export const SharePage: React.FC<SharePageProps> = ({ shortLink }) => {
  const [file, setFile] = useState<ShareFile | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await shareAPI.getFile(shortLink, password || undefined);
      setFile(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || '加载文件失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFile();
  }, [shortLink]);

  const handleDownload = () => {
    shareAPI.downloadFile(shortLink, password || undefined);
  };

  const handlePreview = () => {
    if (file && isPreviewable(file.mimeType)) {
      const link = `${window.location.origin}/share/${shortLink}`;
      window.open(link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">出错了</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            {file?.hasPassword && (
              <div className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入访问密码"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={loadFile}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  确认
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getFileIcon(file.mimeType)}</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {file.originalName}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatFileSize(file.fileSize)}</span>
              {file.expiresAt && (
                <>
                  <span>•</span>
                  <span className={isExpired(file.expiresAt) ? 'text-red-500' : ''}>
                    {isExpired(file.expiresAt) ? '已过期' : `有效期至 ${formatDate(file.expiresAt)}`}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              下载文件
            </button>
            {isPreviewable(file.mimeType) && (
              <button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5" />
                预览文件
              </button>
            )}
          </div>

          {file.hasPassword && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Lock className="w-5 h-5" />
                <span className="font-medium">此文件已加密</span>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                请输入正确的访问密码以下载文件
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
