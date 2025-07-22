import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, Lock, Unlock } from "lucide-react";

interface ProgressIndicatorProps {
  progress: number;
  currentFile: string;
  totalFiles: number;
  mode: 'encrypt' | 'decrypt';
}

export default function ProgressIndicator({ progress, currentFile, totalFiles, mode }: ProgressIndicatorProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Settings className="text-white text-2xl animate-spin h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {mode === 'encrypt' ? 'Encrypting Files' : 'Decrypting Files'}
          </h3>
          <p className="text-gray-600">
            Please wait while we {mode === 'encrypt' ? 'secure' : 'restore'} your files...
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="truncate">
                {currentFile ? `Processing: ${currentFile}` : 'Initializing...'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              {mode === 'encrypt' ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              <span>
                {mode === 'encrypt' ? 'Securing' : 'Restoring'} files with AES-256 encryption
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
