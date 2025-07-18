// pages/campaign/CampaignStep4.tsx - Podgląd kampanii
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFormSchemaStore } from "@/utility/formSchemaStore";
import StepsHero from "./StepsHero";
import { Edit3, Eye } from "lucide-react";
import StepsHeader from "./StepsHeader";

export const CampaignStep4: React.FC = () => {
  const navigate = useNavigate();
  const { getData } = useFormSchemaStore();
  const formData = getData("campaign-wizard");

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={4} />
      <div className="space-y-6 p-8">
        <StepsHeader
          title={
            <>
              <Eye className="w-8 h-8 text-zinc-500" />
              <span>AI przygotowała kompletną strategię marketingową  </span>
            </>
          }
          description="Dostosuj wszystkie elementy kampanii przed zapisaniem"
        />

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tytuł kampanii
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
          <Button variant="outline" onClick={() => navigate("/campaign/step3")}>
            Wstecz
          </Button>
          <Button onClick={() => navigate("/campaign/step5")}>
            Edytuj kampanię
          </Button>
        </div>
      </div>
    </div>
  );
};
