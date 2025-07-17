// components/FormField.tsx

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const FormField = ({ 
  children, 
  label,
  htmlFor,
  error,
  required = false,
  className = ""
}: FormFieldProps) => {
  const baseClasses = "space-y-2";
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return (
    <div className={combinedClasses}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label} {required && "*"}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
