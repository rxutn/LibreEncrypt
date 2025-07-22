// Format file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get file icon based on extension
export function getFileIcon(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  const iconMap: { [key: string]: string } = {
    // Documents
    'pdf': 'file-text',
    'doc': 'file-text',
    'docx': 'file-text',
    'txt': 'file-text',
    'rtf': 'file-text',
    // Spreadsheets
    'xls': 'file-spreadsheet',
    'xlsx': 'file-spreadsheet',
    'csv': 'file-spreadsheet',
    // Presentations
    'ppt': 'file-presentation',
    'pptx': 'file-presentation',
    // Images
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'png': 'file-image',
    'gif': 'file-image',
    'bmp': 'file-image',
    'svg': 'file-image',
    'webp': 'file-image',
    // Video
    'mp4': 'file-video',
    'avi': 'file-video',
    'mkv': 'file-video',
    'mov': 'file-video',
    'wmv': 'file-video',
    'flv': 'file-video',
    'webm': 'file-video',
    // Audio
    'mp3': 'file-audio',
    'wav': 'file-audio',
    'ogg': 'file-audio',
    'flac': 'file-audio',
    'aac': 'file-audio',
    'm4a': 'file-audio',
    // Code
    'js': 'file-code',
    'ts': 'file-code',
    'jsx': 'file-code',
    'tsx': 'file-code',
    'html': 'file-code',
    'css': 'file-code',
    'json': 'file-code',
    'xml': 'file-code',
    'py': 'file-code',
    'java': 'file-code',
    'cpp': 'file-code',
    'c': 'file-code',
    // Archives
    'zip': 'file-archive',
    'rar': 'file-archive',
    '7z': 'file-archive',
    'tar': 'file-archive',
    'gz': 'file-archive',
    // Encrypted
    'encrypted': 'shield'
  };
  
  return iconMap[ext] || 'file';
}

// Download a file
export function downloadFile(data: ArrayBuffer, filename: string, mimeType?: string): void {
  const blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Validate file for encryption/decryption
export function validateFile(file: File, mode: 'encrypt' | 'decrypt'): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  if (mode === 'decrypt' && !file.name.endsWith('.encrypted')) {
    return { valid: false, error: 'File does not appear to be encrypted' };
  }
  
  return { valid: true };
}

// Check password strength
export function checkPasswordStrength(password: string): {
  score: number; // 0-4
  label: string;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];
  
  if (password.length >= 8) score++;
  else suggestions.push('Use at least 8 characters');
  
  if (/[a-z]/.test(password)) score++;
  else suggestions.push('Include lowercase letters');
  
  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('Include uppercase letters');
  
  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Include numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else suggestions.push('Include special characters');
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return {
    score,
    label: labels[score] || 'Very Weak',
    suggestions
  };
}
