export interface EncryptedFile {
  name: string;
  size: number;
  data: ArrayBuffer;
  originalName: string;
}

export interface FileProcessResult {
  success: boolean;
  file?: EncryptedFile;
  error?: string;
}

// Generate a cryptographically secure key from password using PBKDF2
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive AES-256 key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // 100k iterations for security
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt a file using AES-256-GCM
export async function encryptFile(file: File, password: string, onProgress?: (progress: number) => void): Promise<FileProcessResult> {
  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Derive encryption key
    const key = await deriveKeyFromPassword(password, salt);
    
    // Read file data
    const fileData = await file.arrayBuffer();
    
    if (onProgress) onProgress(50);
    
    // Encrypt the file data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      fileData
    );
    
    if (onProgress) onProgress(75);
    
    // Create the final encrypted file format: salt (16) + iv (12) + encrypted data
    const finalData = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    finalData.set(salt, 0);
    finalData.set(iv, salt.length);
    finalData.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    if (onProgress) onProgress(100);
    
    return {
      success: true,
      file: {
        name: `${file.name}.encrypted`,
        size: finalData.byteLength,
        data: finalData.buffer,
        originalName: file.name
      }
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    };
  }
}

// Decrypt a file using AES-256-GCM
export async function decryptFile(file: File, password: string, onProgress?: (progress: number) => void): Promise<FileProcessResult> {
  try {
    // Read encrypted file data
    const encryptedData = await file.arrayBuffer();
    const dataView = new Uint8Array(encryptedData);
    
    if (dataView.length < 28) { // salt (16) + iv (12) minimum
      throw new Error('Invalid encrypted file format');
    }
    
    // Extract salt, iv, and encrypted content
    const salt = dataView.slice(0, 16);
    const iv = dataView.slice(16, 28);
    const encryptedContent = dataView.slice(28);
    
    if (onProgress) onProgress(25);
    
    // Derive decryption key
    const key = await deriveKeyFromPassword(password, salt);
    
    if (onProgress) onProgress(50);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedContent
    );
    
    if (onProgress) onProgress(75);
    
    // Extract original filename
    let originalName = file.name;
    if (originalName.endsWith('.encrypted')) {
      originalName = originalName.slice(0, -10); // Remove .encrypted extension
    }
    
    if (onProgress) onProgress(100);
    
    return {
      success: true,
      file: {
        name: originalName,
        size: decryptedData.byteLength,
        data: decryptedData,
        originalName: originalName
      }
    };
  } catch (error) {
    console.error('Decryption error:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? (error.message.includes('decrypt') ? 'Invalid password or corrupted file' : error.message)
        : 'Decryption failed'
    };
  }
}

// Batch process multiple files
export async function processFilesInBatch(
  files: File[], 
  password: string, 
  processFunction: (file: File, password: string, onProgress?: (progress: number) => void) => Promise<FileProcessResult>,
  onOverallProgress?: (current: number, total: number, currentFileName: string) => void
): Promise<FileProcessResult[]> {
  const results: FileProcessResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onOverallProgress) {
      onOverallProgress(i, files.length, file.name);
    }
    
    const result = await processFunction(file, password, (fileProgress) => {
      // Individual file progress can be used if needed
    });
    
    results.push(result);
    
    if (onOverallProgress) {
      onOverallProgress(i + 1, files.length, file.name);
    }
  }
  
  return results;
}
