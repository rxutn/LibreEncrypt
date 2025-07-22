import { useState } from "react";
import { Shield, Lock, Globe, Infinity } from "lucide-react";
import FileEncryption from "@/components/file-encryption";
import logoPath from "@assets/encrypt_1753221068545.png";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src={logoPath} alt="SecureFile" className="w-8 h-8 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">SecureFile</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="text-green-600 mr-2 h-4 w-4" />
                <span>100% Client-Side</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img src={logoPath} alt="SecureFile" className="w-24 h-24 mx-auto mb-4" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Secure File Encryption</h2>
          <p className="text-xl text-gray-600 mb-2">AES-256 encryption in your browser</p>
          <p className="text-sm text-gray-500">No uploads • No servers • No limits</p>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
            <Lock className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
            <Globe className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Browser-Only Processing</span>
          </div>
          <div className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200">
            <Infinity className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">No Size Limits</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('encrypt')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'encrypt'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Encrypt Files
            </button>
            <button
              onClick={() => setActiveTab('decrypt')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'decrypt'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Decrypt Files
            </button>
          </div>
        </div>

        {/* File Encryption Component */}
        <FileEncryption mode={activeTab} />

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="text-blue-500 text-xl h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How it works</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>All encryption happens locally in your browser using Web Crypto API</li>
                  <li>Files are never uploaded to any server</li>
                  <li>AES-256-GCM encryption with PBKDF2 key derivation</li>
                  <li>Your password is never stored or transmitted</li>
                  <li>
                    <a 
                      href="https://github.com/rxutn/SecureFile" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-800 hover:text-blue-900 underline"
                    >
                      Source code is open and auditable
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <img src={logoPath} alt="SecureFile" className="w-5 h-5 mr-2" />
              <span className="font-semibold text-gray-900">SecureFile</span>
            </div>
            <p className="text-gray-600 text-sm">Open-source client-side file encryption • Privacy by design</p>
            <p className="text-gray-500 text-xs mt-2">
              <a 
                href="https://anatole.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Free & Open Source - Proposed by anatole.co
              </a>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              <a 
                href="https://creativecommons.org/public-domain/cc0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                CC0 - Public Domain / No Copyright Required
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
