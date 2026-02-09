import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { fileAPI } from '../utils/api';

export const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        alert('文件上传成功！');
      }, 500);
    } catch (error: any) {
      setUploading(false);
      setUploadProgress(0);
      alert(error.response?.data?.error || '上传失败，请重试');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">上传文件</h2>
      <FileUpload
        onUpload={handleUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};
