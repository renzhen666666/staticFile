import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { DashboardStats } from '../components/DashboardStats';
import { fileAPI } from '../utils/api';
import type { FileStats } from '../types';

export const HomePage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState<FileStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fileAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleUpload = async (file: File, password?: string, expiresInDays?: number) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    if (password) formData.append('password', password);
    if (expiresInDays) formData.append('expiresInDays', expiresInDays.toString());

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await fileAPI.upload(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
        loadStats();
        alert('文件上传成功！');
      }, 500);
    } catch (error: any) {
      setUploading(false);
      setUploadProgress(0);
      alert(error.response?.data?.error || '上传失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">上传文件</h2>
        <FileUpload
          onUpload={handleUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
      </div>

      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-lg font-bold mb-2">快速分享</h3>
        <p className="text-primary-100">
          上传文件后，系统会自动生成短链接，方便您快速分享给他人。
          支持设置访问密码和有效期，确保文件安全。
        </p>
      </div>
    </div>
  );
};
