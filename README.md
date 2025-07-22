# SecureFile - Client-Side File Encryption

A secure, privacy-focused file encryption application that processes files entirely in your browser using AES-256 encryption. No uploads, no servers, no limits.

![SecureFile Logo](attached_assets/encrypt_1753221068545.png)

## Features

- 🔒 **AES-256-GCM Encryption** - Military-grade encryption standard
- 🌐 **100% Client-Side** - All processing happens in your browser
- 🚫 **No Server Upload** - Files never leave your device
- ♾️ **No Size Limits** - Encrypt files of any size
- 🔑 **PBKDF2 Key Derivation** - 100,000 iterations for security
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎯 **Drag & Drop Interface** - Easy file selection
- 📦 **Batch Processing** - Encrypt/decrypt multiple files
- 💾 **ZIP Download** - Download all processed files at once

## How It Works

1. **Select Files** - Drag and drop or browse for files to encrypt/decrypt
2. **Set Password** - Choose a strong password (with strength indicator)
3. **Process Files** - Files are processed locally using Web Crypto API
4. **Download Results** - Get your encrypted/decrypted files instantly

## Security

- All encryption/decryption happens client-side using the Web Crypto API
- Files are never uploaded to any server
- Your password is never stored or transmitted
- Uses AES-256-GCM with PBKDF2 key derivation (100,000 iterations)
- Source code is open and auditable

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Encryption**: Web Crypto API
- **File Handling**: JSZip for batch downloads
- **Routing**: Wouter

## Deployment

This application is designed to be deployed as a static website. Build the project and upload the `dist/public` folder to any static hosting service.

### Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# The built files will be in dist/public/
```

### Static Hosting Options

- Vercel
- Netlify  
- GitHub Pages
- Firebase Hosting
- AWS S3
- Cloudflare Pages

## License

CC0 - Public Domain / No Copyright Required

This project is released into the public domain. You can use, modify, and distribute it freely without any restrictions.

## Credits

Free & Open Source - Proposed by [anatole.co](https://anatole.co)

## Contributing

Since this is public domain software, feel free to fork, modify, and improve it however you like!