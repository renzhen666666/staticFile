import React, { useState } from 'react';
import { FolderPlus, Edit2, Trash2 } from 'lucide-react';
import { getFolders, saveFolder, deleteFolder, updateFolderName } from '../utils/helpers';
import type { Folder } from '../types';

interface FolderManagerProps {
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFolderChange: () => void;
}

export const FolderManager: React.FC<FolderManagerProps> = ({ 
  currentFolderId, 
  onFolderSelect, 
  onFolderChange 
}) => {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const folders = getFolders();

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folderData: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        createdAt: new Date().toISOString()
      };
      saveFolder(folderData);
      setNewFolderName('');
      setShowCreateFolder(false);
      onFolderChange();
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('确定要删除这个文件夹吗？文件夹中的文件将移到根目录。')) {
      deleteFolder(folderId);
      if (currentFolderId === folderId) {
        onFolderSelect(null);
      }
      onFolderChange();
    }
  };

  const handleEditFolder = (folderId: string, name: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  const handleSaveFolderName = () => {
    if (editingFolderId && editingFolderName.trim()) {
      updateFolderName(editingFolderId, editingFolderName.trim());
      setEditingFolderId(null);
      setEditingFolderName('');
      onFolderChange();
    }
  };

  const handleCancelEdit = () => {
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">文件夹</h2>
        <button
          onClick={() => setShowCreateFolder(!showCreateFolder)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          新建文件夹
        </button>
      </div>

      {showCreateFolder && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-slide-down">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="输入文件夹名称"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <button
              onClick={handleCreateFolder}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              创建
            </button>
            <button
              onClick={() => setShowCreateFolder(false)}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div
          onClick={() => onFolderSelect(null)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            currentFolderId === null
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="text-4xl mb-2">📁</div>
          <div className="font-medium text-gray-900 dark:text-white">全部文件</div>
        </div>

        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onFolderSelect(folder.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              currentFolderId === folder.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {editingFolderId === folder.id ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveFolderName()}
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveFolderName}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(folder.id, folder.name);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="重命名"
                    >
                      <Edit2 className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="font-medium text-gray-900 dark:text-white truncate">{folder.name}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
