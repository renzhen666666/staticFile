import React, { useState } from 'react';
import { FileIcon, Copy, Trash2, Lock, Calendar, Share2, Eye, Edit2, Folder } from 'lucide-react';
import type { File } from '../types';
import { formatFileSize, formatDate, isExpired, copyToClipboard, getFileIcon, isPreviewable, getFolders, saveFileMapping, removeFileMapping } from '../utils/helpers';
import { fileAPI, shareAPI } from '../utils/api';

interface FileListProps {
  files: File[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; downloadUrl: string } | null>(null);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editingDisplayName, setEditingDisplayName] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState<number | null>(null);
  const folders = getFolders();

  const handleCopyLink = async (shortLink: string) => {
    const link = `${window.location.origin}/share/${shortLink}`;
    const success = await copyToClipboard(link);
    if (success) {
      alert('链接已复制到剪贴板');
    } else {
      alert('复制失败，请手动复制');
    }
  };

  const handleShowQRCode = async (shortLink: string, fileId: number) => {
    try {
      const response = await shareAPI.generateQRCode(shortLink);
      setQrCodeData(response.data);
      setShowQRCode(fileId);
    } catch (error) {
      alert('生成二维码失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个文件吗？')) {
      try {
        await fileAPI.deleteFile(id);
        onDelete(id);
        removeFileMapping(id);
      } catch (error) {
        alert('删除失败');
      }
    }
  };

  const handlePreview = (file: File) => {
    const link = `${window.location.origin}/share/${file.shortLink}`;
    window.open(link, '_blank');
  };

  const handleRename = (file: File) => {
    setEditingFileId(file.id);
    setEditingDisplayName(file.displayName || file.originalName);
  };

  const handleSaveRename = async (file: File) => {
    if (editingDisplayName.trim()) {
      saveFileMapping(file.id, { displayName: editingDisplayName.trim(), folderId: file.folderId });
      setEditingFileId(null);
      setEditingDisplayName('');
    }
  };

  const handleCancelRename = () => {
    setEditingFileId(null);
    setEditingDisplayName('');
  };

  const handleMoveToFolder = (file: File, folderId: string | null) => {
    saveFileMapping(file.id, { displayName: file.displayName, folderId: folderId || undefined });
    setShowFolderMenu(null);
  };

  const getFileName = (file: File) => {
    return file.displayName || file.originalName;
  };

  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">暂无文件</p>
        </div>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow animate-fade-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="text-3xl">{getFileIcon(file.mimeType)}</div>
                <div className="min-w-0 flex-1">
                  {editingFileId === file.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingDisplayName}
                        onChange={(e) => setEditingDisplayName(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveRename(file)}
                      />
                      <button
                        onClick={() => handleSaveRename(file)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {getFileName(file)}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>•</span>
                        <span>{formatDate(file.createdAt)}</span>
                        <span>•</span>
                        <span>下载 {file.downloadCount} 次</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {file.password && (
                          <span className="inline-flex items-center text-xs text-amber-600 dark:text-amber-400">
                            <Lock className="w-3 h-3 mr-1" />
                            已加密
                          </span>
                        )}
                        {file.expiresAt && (
                          <span className={cn(
                            'inline-flex items-center text-xs',
                            isExpired(file.expiresAt) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                          )}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {isExpired(file.expiresAt) ? '已过期' : `有效期至 ${formatDate(file.expiresAt)}`}
                          </span>
                        )}
                        {file.folderId && (
                          <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400">
                            <Folder className="w-3 h-3 mr-1" />
                            {folders.find(f => f.id === file.folderId)?.name || '未知文件夹'}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {editingFileId !== file.id && (
                  <>
                    <button
                      onClick={() => handleRename(file)}
                      className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="重命名"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowFolderMenu(showFolderMenu === file.id ? null : file.id)}
                        className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="移动到文件夹"
                      >
                        <Folder className="w-4 h-4" />
                      </button>
                      {showFolderMenu === file.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-48">
                          <div className="py-1">
                            <button
                              onClick={() => handleMoveToFolder(file, null)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                            >
                              全部文件
                            </button>
                            {folders.map((folder) => (
                              <button
                                key={folder.id}
                                onClick={() => handleMoveToFolder(file, folder.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                              >
                                📁 {folder.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {isPreviewable(file.mimeType) && editingFileId !== file.id && (
                  <button
                    onClick={() => handlePreview(file)}
                    className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="预览"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {editingFileId !== file.id && (
                  <button
                    onClick={() => handleCopyLink(file.shortLink)}
                    className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="复制链接"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleShowQRCode(file.shortLink, file.id)}
                  className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="二维码"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showQRCode === file.id && qrCodeData && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
                <div className="flex items-center justify-center space-x-4">
                  <img src={qrCodeData.qrCode} alt="QR Code" className="w-32 h-32" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-1">分享链接</p>
                    <p className="break-all">{qrCodeData.downloadUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
