// pages/campaign/CampaignStep3.tsx - UPDATED WITH CONSTANTS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFormSchemaStore, useLLMOperation } from "@/utility/llmFormWizard";
import StepsHero from "./StepsHero";
import StepsHeader from "./StepsHeader";
import {
  CAMPAIGN_GENERATION_OPERATION,
  CAMPAIGN_UI_TEXTS,
  CAMPAIGN_PATHS,
} from "./campaignWizard.constants";

export const CampaignStep3: React.FC = () => {
  const navigate = useNavigate();
  const { getData, setData } = useFormSchemaStore();
  const formData = getData("campaign-wizard");
  const [industry, setIndustry] = useState(formData.industry || "");

  const llmCampaignGeneration = useLLMOperation(
    "campaign-wizard",
    "generate-campaign"
  );

  const { steps, errors } = CAMPAIGN_UI_TEXTS;

  useEffect(() => {
    llmCampaignGeneration.registerOperation(CAMPAIGN_GENERATION_OPERATION);

    return () => {
      llmCampaignGeneration.unregisterOperation();
    };
  }, []);

  const handleNext = async () => {
    if (!industry.trim()) return;

    try {
      // Zapisz zaktualizowaną branżę
      setData("campaign-wizard", { ...formData, industry: industry.trim() });

      // Generuj kampanię z zaktualizowaną branżą
      await llmCampaignGeneration.executeOperation({
        ...formData,
        industry: industry.trim(),
      });

      navigate(CAMPAIGN_PATHS.step4);
    } catch (error) {
      console.error(errors.generationError, error);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={3} />
      <div className="space-y-6 p-8">
        <StepsHeader
          title={<>{steps[3].title}</>}
          description={steps[3].description}
        />

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branża
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Dostosuj branżę..."
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Automatycznie wykryto:{" "}
              <strong>{formData.originalIndustry}</strong>
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(CAMPAIGN_PATHS.step2)}
            >
              Wstecz
            </Button>

            <Button
              onClick={handleNext}
              disabled={llmCampaignGeneration.loading || !industry.trim()}
            >
              {llmCampaignGeneration.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {steps[3].loading}
                </>
              ) : (
                steps[3].button
              )}
            </Button>
          </div>
        </div>

        {llmCampaignGeneration.loading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-800 text-sm">
              {steps[3].loadingInfo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
