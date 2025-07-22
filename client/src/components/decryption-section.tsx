import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Unlock, FolderOpen, X, File, Eye, EyeOff } from "lucide-react";
import { formatFileSize } from "@/lib/file-utils";
import { validateFile } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import ProgressIndicator from "./progress-indicator";
import ResultsSection from "./results-section";
import { type EncryptedFile } from "@/lib/crypto";

interface DecryptionSectionProps {
  onFilesSelected: (files: File[]) => void;
  onPasswordSubmit: (password: string) => void;
  isProcessing: boolean;
  progress: number;
  currentFile: string;
  processedFiles: EncryptedFile[];
  errors: string[];
  onReset: () => void;
  selectedFiles: File[];
  step: string;
}

export default function DecryptionSection({
  onFilesSelected,
  onPasswordSubmit,
  isProcessing,
  progress,
  currentFile,
  processedFiles,
  errors,
  onReset,
  selectedFiles,
  step
}: DecryptionSectionProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateFile(file, 'decrypt');
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Some files were rejected",
        description: errors.join(', '),
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter the decryption password.",
        variant: "destructive"
      });
      return;
    }
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select encrypted files to decrypt.",
        variant: "destructive"
      });
      return;
    }
    onPasswordSubmit(password);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  if (step === 'processing') {
    return (
      <ProgressIndicator
        progress={progress}
        currentFile={currentFile}
        totalFiles={selectedFiles.length}
        mode="decrypt"
      />
    );
  }

  if (step === 'results') {
    return (
      <ResultsSection
        processedFiles={processedFiles}
        errors={errors}
        onReset={onReset}
        mode="decrypt"
      />
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Decrypt Files</h3>
          <p className="text-gray-600">Have encrypted files? Decrypt them here</p>
        </div>

        {/* File Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Unlock className="text-4xl text-gray-400 mb-4 mx-auto h-12 w-12" />
          <p className="text-gray-600 mb-4">Drop encrypted files here or</p>
          <Button
            variant="outline"
            onClick={() => document.getElementById('decrypt-file-input')?.click()}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Browse Encrypted Files
          </Button>
          <input
            id="decrypt-file-input"
            type="file"
            multiple
            accept=".encrypted"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Selected Files</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <File className="text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="decryptPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Decryption Password
            </Label>
            <div className="relative">
              <Input
                id="decryptPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password used for encryption"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={selectedFiles.length === 0 || !password.trim() || isProcessing}
          >
            <Unlock className="mr-2 h-4 w-4" />
            Decrypt Files
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
