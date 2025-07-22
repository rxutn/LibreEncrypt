import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Download, Plus, Shield, AlertTriangle } from "lucide-react";
import { downloadFile, formatFileSize, getFileIcon } from "@/lib/file-utils";
import { type EncryptedFile } from "@/lib/crypto";
import JSZip from 'jszip';

interface ResultsSectionProps {
  processedFiles: EncryptedFile[];
  errors: string[];
  onReset: () => void;
  mode: 'encrypt' | 'decrypt';
}

export default function ResultsSection({ processedFiles, errors, onReset, mode }: ResultsSectionProps) {
  const handleDownloadFile = (file: EncryptedFile) => {
    downloadFile(file.data, file.name);
  };

  const handleDownloadAll = async () => {
    if (processedFiles.length === 1) {
      handleDownloadFile(processedFiles[0]);
      return;
    }

    // Create ZIP file for multiple files
    const zip = new JSZip();
    processedFiles.forEach(file => {
      zip.file(file.name, file.data);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}-files.zip`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle className="text-white text-2xl h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mode === 'encrypt' ? 'Encryption Complete' : 'Decryption Complete'}
            </h3>
            <p className="text-gray-600">
              Your files have been successfully {mode === 'encrypt' ? 'encrypted' : 'decrypted'}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {processedFiles.length > 0 && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <span className="font-medium">
                    Files Successfully {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'}
                  </span>
                  <p className="mt-1">
                    {mode === 'encrypt' 
                      ? 'Your files are now protected with AES-256 encryption'
                      : 'Your files have been restored to their original format'
                    }
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">Some files failed to process:</span>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {processedFiles.length > 0 && (
              <>
                <div className="space-y-3 mb-6">
                  {processedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="text-green-600 mr-3 h-5 w-5" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleDownloadFile(file)}>
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <Button onClick={handleDownloadAll} className="w-full mb-4">
                  <Download className="mr-2 h-4 w-4" />
                  {processedFiles.length === 1 ? 'Download File' : 'Download All Files'}
                </Button>
              </>
            )}
            
            <Button variant="outline" onClick={onReset} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {mode === 'encrypt' ? 'Encrypt More Files' : 'Decrypt More Files'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
