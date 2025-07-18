
import { ReactNode } from "react";

interface LeadProps {
  title: ReactNode;
  description: string;
}

export const StepsHeader = ({ title, description }: LeadProps) => {
  return (
    <header className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        {title}
        {/* <Edit3 className="w-8 h-8 text-blue-500" />
        Krok 5: Edytuj i zapisz kampanię */}
      </h3>
      <p className="text-gray-600">
        {description}
        {/* Dostosuj wszystkie elementy kampanii przed zapisaniem */}
      </p>
    </header>
  );
};

export default StepsHeader;