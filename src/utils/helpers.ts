export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isExpired(dateString: string | null): boolean {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.startsWith('text/')) return '📃';
  return '📁';
}

export function isPreviewable(mimeType: string): boolean {
  return mimeType.startsWith('image/') || 
         mimeType.startsWith('video/') || 
         mimeType.startsWith('audio/') ||
         mimeType === 'application/pdf';
}

export function getFolders(): any[] {
  const folders = localStorage.getItem('folders');
  return folders ? JSON.parse(folders) : [];
}

export function saveFolder(folder: any): void {
  const folders = getFolders();
  folders.push(folder);
  localStorage.setItem('folders', JSON.stringify(folders));
}

export function deleteFolder(folderId: string): void {
  const folders = getFolders().filter(f => f.id !== folderId);
  localStorage.setItem('folders', JSON.stringify(folders));
  
  const fileMappings = getFileMappings();
  const newMappings = fileMappings.filter(m => m.folderId !== folderId);
  localStorage.setItem('fileMappings', JSON.stringify(newMappings));
}

export function updateFolderName(folderId: string, newName: string): void {
  const folders = getFolders().map(f => 
    f.id === folderId ? { ...f, name: newName } : f
  );
  localStorage.setItem('folders', JSON.stringify(folders));
}

export function getFileMappings(): any[] {
  const mappings = localStorage.getItem('fileMappings');
  return mappings ? JSON.parse(mappings) : [];
}

export function saveFileMapping(fileId: number, data: { displayName?: string; folderId?: string }): void {
  const mappings = getFileMappings();
  const existingIndex = mappings.findIndex(m => m.fileId === fileId);
  
  if (existingIndex >= 0) {
    mappings[existingIndex] = { ...mappings[existingIndex], ...data };
  } else {
    mappings.push({ fileId, ...data });
  }
  
  localStorage.setItem('fileMappings', JSON.stringify(mappings));
}

export function removeFileMapping(fileId: number): void {
  const mappings = getFileMappings().filter(m => m.fileId !== fileId);
  localStorage.setItem('fileMappings', JSON.stringify(mappings));
}

export function getFileMapping(fileId: number): any {
  const mappings = getFileMappings();
  return mappings.find(m => m.fileId === fileId);
}

export function getFilesInFolder(folderId: string, files: any[]): any[] {
  return files.filter(f => getFileMapping(f.id)?.folderId === folderId);
}
