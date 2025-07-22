import { useState } from "react";
import FileDropzone from "./file-dropzone";
import PasswordForm from "./password-form";
import ProgressIndicator from "./progress-indicator";
import ResultsSection from "./results-section";
import DecryptionSection from "./decryption-section";
import { processFilesInBatch, encryptFile, decryptFile, type EncryptedFile, type FileProcessResult } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

type Step = 'files' | 'password' | 'processing' | 'results';

interface FileEncryptionProps {
  mode: 'encrypt' | 'decrypt';
}

export default function FileEncryption({ mode }: FileEncryptionProps) {
  const [step, setStep] = useState<Step>('files');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [processedFiles, setProcessedFiles] = useState<EncryptedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    if (mode === 'decrypt') {
      // For decryption, go straight to password since we already have files
      setStep('password');
    } else {
      // For encryption, user needs to proceed manually
      setStep('files');
    }
  };

  const handleContinue = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to continue.",
        variant: "destructive"
      });
      return;
    }
    setStep('password');
  };

  const handlePasswordSubmit = async (submittedPassword: string) => {
    if (!submittedPassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a password to proceed.",
        variant: "destructive"
      });
      return;
    }

    setPassword(submittedPassword);
    setStep('processing');
    setIsProcessing(true);
    setProgress(0);
    setErrors([]);
    
    try {
      const processFunction = mode === 'encrypt' ? encryptFile : decryptFile;
      
      const results = await processFilesInBatch(
        selectedFiles,
        submittedPassword,
        processFunction,
        (current, total, fileName) => {
          setCurrentFile(fileName);
          setProgress(Math.round((current / total) * 100));
        }
      );
      
      const successfulFiles: EncryptedFile[] = [];
      const errorMessages: string[] = [];
      
      results.forEach((result, index) => {
        if (result.success && result.file) {
          successfulFiles.push(result.file);
        } else {
          errorMessages.push(`${selectedFiles[index].name}: ${result.error || 'Unknown error'}`);
        }
      });
      
      setProcessedFiles(successfulFiles);
      setErrors(errorMessages);
      
      if (successfulFiles.length > 0) {
        toast({
          title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} completed`,
          description: `Successfully processed ${successfulFiles.length} of ${selectedFiles.length} files.`,
        });
      }
      
      if (errorMessages.length > 0) {
        toast({
          title: "Some files failed to process",
          description: `${errorMessages.length} files could not be processed.`,
          variant: "destructive"
        });
      }
      
      setStep('results');
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
      setStep('password');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep('files');
    setSelectedFiles([]);
    setPassword('');
    setProcessedFiles([]);
    setErrors([]);
    setProgress(0);
    setCurrentFile('');
    setIsProcessing(false);
  };

  // Step indicator
  const steps = [
    { number: 1, name: 'Choose Files', active: step === 'files' },
    { number: 2, name: 'Set Password', active: step === 'password' },
    { number: 3, name: 'Download', active: step === 'processing' || step === 'results' }
  ];

  if (mode === 'decrypt') {
    return (
      <DecryptionSection 
        onFilesSelected={handleFilesSelected}
        onPasswordSubmit={handlePasswordSubmit}
        isProcessing={isProcessing}
        progress={progress}
        currentFile={currentFile}
        processedFiles={processedFiles}
        errors={errors}
        onReset={handleReset}
        selectedFiles={selectedFiles}
        step={step}
      />
    );
  }

  return (
    <>
      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    stepItem.active || (step === 'results' && stepItem.number <= 3)
                      ? 'bg-primary text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {stepItem.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    stepItem.active || (step === 'results' && stepItem.number <= 3)
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}>
                    {stepItem.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on current step */}
      {step === 'files' && (
        <FileDropzone 
          onFilesSelected={handleFilesSelected}
          selectedFiles={selectedFiles}
          onContinue={handleContinue}
          onClearFiles={() => setSelectedFiles([])}
          mode={mode}
        />
      )}

      {step === 'password' && (
        <PasswordForm 
          onSubmit={handlePasswordSubmit}
          mode={mode}
        />
      )}

      {step === 'processing' && (
        <ProgressIndicator 
          progress={progress}
          currentFile={currentFile}
          totalFiles={selectedFiles.length}
          mode={mode}
        />
      )}

      {step === 'results' && (
        <ResultsSection 
          processedFiles={processedFiles}
          errors={errors}
          onReset={handleReset}
          mode={mode}
        />
      )}
    </>
  );
}
