import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { checkPasswordStrength } from "@/lib/file-utils";
import { useToast } from "@/hooks/use-toast";

interface PasswordFormProps {
  onSubmit: (password: string) => void;
  mode: 'encrypt' | 'decrypt';
}

export default function PasswordForm({ onSubmit, mode }: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a password.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (mode === 'encrypt') {
      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure both password fields match.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (passwordStrength.score < 2) {
        toast({
          title: "Weak password",
          description: "Please use a stronger password for better security.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthTextColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'text-red-600';
      case 2:
        return 'text-yellow-600';
      case 3:
        return 'text-blue-600';
      case 4:
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          {mode === 'encrypt' ? (
            <Lock className="text-4xl text-primary mb-4 mx-auto h-12 w-12" />
          ) : (
            <Unlock className="text-4xl text-primary mb-4 mx-auto h-12 w-12" />
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {mode === 'encrypt' ? 'Set Encryption Password' : 'Enter Decryption Password'}
          </h3>
          <p className="text-gray-600">
            {mode === 'encrypt' 
              ? 'Choose a strong password to protect your files' 
              : 'Enter the password used to encrypt these files'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter strong password' : 'Enter decryption password'}
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

          {mode === 'encrypt' && (
            <>
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Password Strength</span>
                    <span className={`text-sm font-medium ${getStrengthTextColor(passwordStrength.score)}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Key className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {mode === 'encrypt' ? (
                  <Lock className="mr-2 h-4 w-4" />
                ) : (
                  <Unlock className="mr-2 h-4 w-4" />
                )}
                {mode === 'encrypt' ? 'Encrypt Files' : 'Decrypt Files'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
