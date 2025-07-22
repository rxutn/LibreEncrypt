import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, FolderOpen, X, File } from "lucide-react";
import { formatFileSize } from "@/lib/file-utils";
import { validateFile } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onContinue: () => void;
  onClearFiles: () => void;
  mode: 'encrypt' | 'decrypt';
}

export default function FileDropzone({ onFilesSelected, selectedFiles, onContinue, onClearFiles, mode }: FileDropzoneProps) {
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
  }, [mode]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [mode]);

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateFile(file, mode);
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
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  if (selectedFiles.length > 0) {
    return (
      <Card className="shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Selected Files</h3>
            <Button variant="ghost" size="sm" onClick={onClearFiles}>
              <X className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          </div>
          
          <div className="space-y-3 mb-6">
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
          
          <Button onClick={onContinue} className="w-full">
            Continue to Encryption
            <span className="ml-2">→</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors duration-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-6">
            <CloudUpload className="text-6xl text-gray-400 mb-4 mx-auto h-16 w-16" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop files to {mode}
          </h3>
          
          <p className="text-gray-600 mb-6">or click to browse your computer</p>
          
          <Button 
            onClick={() => document.getElementById('file-input')?.click()}
            className="mb-4"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
          
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept={mode === 'decrypt' ? '.encrypted' : undefined}
          />
          
          <p className="text-sm text-gray-500">
            {mode === 'encrypt' 
              ? 'Supports all file types • No size restrictions'
              : 'Drop .encrypted files here'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
