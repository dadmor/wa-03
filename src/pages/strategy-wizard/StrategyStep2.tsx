// src/pages/website-analyses/strategy-wizard/StrategyStep2.tsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormSchemaStore, useLLMOperation } from "@/utility/llmFormWizard";
import { Button } from "@/components/ui/button";
import { STRATEGY_GENERATION_OPERATION } from "./strategyWizard.constants";
import StepsHeader from "../web-campaign-wizard/StepsHeader";
import StepsHero from "../web-campaign-wizard/StepsHero";

export const StrategyStep2: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getData } = useFormSchemaStore();
  const formData = getData("strategy-wizard");

  const llmGeneration = useLLMOperation("strategy-wizard", "generate-strategy");

  useEffect(() => {
    // Rejestracja operacji LLM
    llmGeneration.registerOperation(STRATEGY_GENERATION_OPERATION);

    // Automatycznie generuj strategię po wejściu
    if (formData && !llmGeneration.loading) {
      handleGenerate();
    }

    return () => {
      llmGeneration.unregisterOperation();
    };
  }, []);

  const handleGenerate = async () => {
    try {
      await llmGeneration.executeOperation({
        url: formData.url,
        description: formData.description,
        keywords: formData.keywords,
        industry: formData.industry,
      });

      // Po udanym wygenerowaniu przejdź do kroku 3
      navigate(`/website-analyses/${id}/strategy/step3`);
    } catch (error) {
      console.error("Błąd generowania strategii:", error);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={2} />

      <div className="p-6">
        <StepsHeader
          title="Generowanie strategii"
          description="AI analizuje Twoją stronę i przygotowuje strategię marketingową"
        />

        <div className="py-12 text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Generuję strategię marketingową...
            </p>
            <p className="text-sm text-gray-600">
              To może potrwać kilkanaście sekund
            </p>
          </div>
        </div>

        {llmGeneration.error && (
          <div className="mt-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800">
                Błąd generowania: {llmGeneration.error}
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/website-analyses/${id}/strategy/step1`)
                }
              >
                Wróć
              </Button>
              <Button onClick={handleGenerate}>Spróbuj ponownie</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
