// src/pages/website-analyses/strategy-wizard/StrategyStep3.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFormSchemaStore } from "@/utility/formSchemaStore";

import { Eye } from "lucide-react";
import StepsHero from "../web-campaign-wizard/StepsHero";
import StepsHeader from "../web-campaign-wizard/StepsHeader";

export const StrategyStep3: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getData } = useFormSchemaStore();
  const formData = getData("strategy-wizard");

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={3} />
      <div className="space-y-6 p-8">
        <StepsHeader
          title={
            <>
              <Eye className="w-8 h-8 text-zinc-500" />
              <span>AI przygotowała kompletną strategię marketingową</span>
            </>
          }
          description="Przejrzyj wygenerowaną strategię przed edycją"
        />

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tytuł strategii
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
              {formData.title}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupa docelowa
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800 max-h-32 overflow-y-auto">
              {formData.targetAudience}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sugerowany budżet
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
              {formData.budgetRecommendation?.toLocaleString()} PLN
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notatki strategiczne
            </label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800 max-h-48 overflow-y-auto">
              {formData.notes}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 W następnym kroku będziesz mógł edytować wszystkie dane według
            swoich potrzeb.
          </p>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/website-analyses/${id}/strategy/step2`)}
          >
            Wstecz
          </Button>
          <Button onClick={() => navigate(`/website-analyses/${id}/strategy/step4`)}>
            Edytuj strategię
          </Button>
        </div>
      </div>
    </div>
  );
};