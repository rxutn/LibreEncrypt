# replit.md

## Overview

This is a full-stack web application built for secure file encryption and decryption. The application uses a modern tech stack with React/TypeScript frontend, Express.js backend, and PostgreSQL database integration via Drizzle ORM. The primary focus is on client-side file encryption using AES-256 encryption, ensuring user files never leave their browser unencrypted.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **File Processing**: Web Crypto API for client-side encryption/decryption

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with `/api` prefix routing
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Pooled connections via @neondatabase/serverless

## Key Components

### File Encryption System
- **Encryption**: AES-256-GCM with PBKDF2 key derivation
- **Security**: 100,000 PBKDF2 iterations, random salt and IV generation
- **Client-Side Processing**: All encryption/decryption happens in the browser
- **File Handling**: Supports multiple file types with validation
- **Progress Tracking**: Real-time progress updates during processing

### User Interface Components
- **File Dropzone**: Drag-and-drop file selection with validation
- **Password Form**: Secure password input with strength checking
- **Progress Indicator**: Visual feedback during file processing
- **Results Section**: Download processed files individually or as ZIP

### Storage Layer
- **In-Memory Storage**: MemStorage class for development/testing
- **Database Storage**: Prepared for PostgreSQL integration via Drizzle
- **User Management**: Basic user schema with username/password

## Data Flow

### File Processing Flow
1. User selects files via drag-and-drop or file picker
2. Files are validated for type and size constraints
3. User enters password with strength validation
4. Files are processed client-side using Web Crypto API
5. Encrypted/decrypted files are made available for download
6. No file data is transmitted to the server

### Authentication Flow (Prepared)
1. User registration/login via API endpoints
2. Session management with secure cookies
3. Protected routes for authenticated users
4. User data stored in PostgreSQL via Drizzle ORM

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router alternative (Wouter)
- **UI Framework**: Radix UI primitives for accessibility
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **File Handling**: JSZip for creating downloadable ZIP archives
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Core**: Express.js, Drizzle ORM, Drizzle Kit
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **Security**: Session management via connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for bundling

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict type checking with path mapping
- **Development**: Replit-specific plugins for enhanced development experience

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **API Server**: Express server with automatic restart via tsx
- **Database**: Drizzle migrations with push command
- **Environment**: NODE_ENV-based configuration

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving both API and static files
- **Database**: PostgreSQL via DATABASE_URL environment variable

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **TypeScript**: Shared types via `shared/` directory
- **Path Mapping**: Absolute imports configured for better DX
- **Static Assets**: Vite handles asset optimization and bundling

The application is designed with security as a priority, implementing client-side encryption to ensure user data privacy. The modular architecture allows for easy extension of features while maintaining clean separation of concerns between frontend encryption logic and backend API services.