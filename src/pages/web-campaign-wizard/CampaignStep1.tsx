// pages/campaign/CampaignStep1.tsx - UPDATED WITH CONSTANTS
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormSchemaStore, useLLMOperation } from "@/utility/formSchemaStore";
import StepsHero from "./StepsHero";
import StepsHeader from "./StepsHeader";
import {
  CAMPAIGN_WIZARD_SCHEMA,
  WEBSITE_ANALYSIS_OPERATION,
  CAMPAIGN_UI_TEXTS,
  CAMPAIGN_PATHS,
  CAMPAIGN_VALIDATION,
} from "./campaignWizard.constants";

export const CampaignStep1: React.FC = () => {
  const navigate = useNavigate();
  const { register, setData } = useFormSchemaStore();
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const llmAnalysis = useLLMOperation("campaign-wizard", "analyze-website");
  const { steps, errors } = CAMPAIGN_UI_TEXTS;

  useEffect(() => {
    // Rejestracja schematu z pliku stałych
    register(CAMPAIGN_WIZARD_SCHEMA);

    // Rejestracja operacji LLM z pliku stałych
    llmAnalysis.registerOperation(WEBSITE_ANALYSIS_OPERATION);

    return () => {
      llmAnalysis.unregisterOperation();
    };
  }, []);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError(errors.urlRequired);
      return false;
    }

    if (!CAMPAIGN_VALIDATION.url.pattern.test(url)) {
      setUrlError(CAMPAIGN_VALIDATION.url.errorMessage);
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    setUrlError("");

    if (!validateUrl(url)) {
      return;
    }

    try {
      setData("campaign-wizard", { url: url.trim() });
      await llmAnalysis.executeOperation({ url: url.trim() });
      navigate(CAMPAIGN_PATHS.step2);
    } catch (error) {
      console.error(errors.analysisError, error);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={1} />

      <div className="p-6">
        <StepsHeader
          title={<>{steps[1].title}</>}
          description={steps[1].description}
        />

        {urlError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 text-sm">{urlError}</span>
          </div>
        )}

        {llmAnalysis.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 text-sm">
              {errors.analysisError} {llmAnalysis.error}
            </span>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={
              CAMPAIGN_WIZARD_SCHEMA.schema.step1.properties.url.placeholder
            }
            disabled={llmAnalysis.loading}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={llmAnalysis.loading || !url.trim()}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
          >
            {llmAnalysis.loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {steps[1].loading}
              </>
            ) : (
              steps[1].button
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
