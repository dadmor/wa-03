// pages/campaign/CampaignDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lead } from "@/components/reader";
import { Button } from "@/components/ui/button";
import { useFormSchemaStore } from "@/utility/llmFormWizard";
import { FlexBox, GridBox } from "@/components/shared";
import { 
  Zap, 
  Check, 
  Eye, 
  Edit3, 
  RefreshCw, 
  BarChart3, 
  Archive, 
  TrendingUp,
  Rocket
} from "lucide-react";

export const CampaignDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getData } = useFormSchemaStore();
  const campaignData = getData("campaign-wizard");

  const hasSavedCampaign = campaignData && campaignData.title;

  return (
    <>
      <Lead
        title="Kampanie marketingowe"
        description="Zarządzaj swoimi kampaniami i twórz nowe strategie"
      />

      <div className="space-y-6">
        {/* Kreator nowej kampanii */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <FlexBox variant="start" className="mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Kreator kampanii AI</h2>
              <p className="text-gray-600">Stwórz kampanię w 5 krokach z pomocą sztucznej inteligencji</p>
            </div>
          </FlexBox>
          
          <GridBox variant="1-2-2" className="gap-4">
            <div className="space-y-2">
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Automatyczna analiza strony WWW</span>
              </FlexBox>
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Generowanie grupy docelowej</span>
              </FlexBox>
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Sugestie budżetu i strategii</span>
              </FlexBox>
            </div>
            <div className="space-y-2">
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Analiza branży i konkurencji</span>
              </FlexBox>
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Pełna edycja i dostosowanie</span>
              </FlexBox>
              <FlexBox variant="start" className="text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Eksport gotowej strategii</span>
              </FlexBox>
            </div>
          </GridBox>

          <div className="mt-6">
            <Button 
              onClick={() => navigate("/campaign/step1")}
              className="w-full md:w-auto"
              size="lg"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Rozpocznij nową kampanię
            </Button>
          </div>
        </div>

        {/* Zapisana kampania */}
        {hasSavedCampaign && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <FlexBox variant="between-center" className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ostatnia kampania</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Zapisana
              </span>
            </FlexBox>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tytuł kampanii</p>
                <p className="font-medium text-gray-900">{campaignData.title}</p>
              </div>
              
              {campaignData.industry && (
                <div>
                  <p className="text-sm text-gray-600">Branża</p>
                  <p className="text-gray-900">{campaignData.industry}</p>
                </div>
              )}
              
              {campaignData.budgetRecommendation && (
                <div>
                  <p className="text-sm text-gray-600">Budżet</p>
                  <p className="text-gray-900">{campaignData.budgetRecommendation.toLocaleString()} PLN</p>
                </div>
              )}
            </div>

            <FlexBox variant="start" className="mt-6 gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate("/campaign/step4")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Podgląd
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/campaign/step5")}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edytuj
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/campaign/step1")}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nowa wersja
              </Button>
            </FlexBox>
          </div>
        )}

        {/* Przydatne linki */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Przydatne narzędzia</h3>
          
          <GridBox variant="1-2-3" className="gap-4">
            <button
              onClick={() => navigate("/website-analyses")}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <FlexBox variant="start" className="mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Analizy stron</span>
              </FlexBox>
              <p className="text-sm text-gray-600">Zobacz wszystkie przeprowadzone analizy</p>
            </button>

            <button
              onClick={() => navigate("/marketing-strategies")}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <FlexBox variant="start" className="mb-2">
                <Archive className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Strategie</span>
              </FlexBox>
              <p className="text-sm text-gray-600">Zarządzaj strategiami marketingowymi</p>
            </button>

            <button
              onClick={() => navigate("/google-ads-campaigns")}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <FlexBox variant="start" className="mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium">Google Ads</span>
              </FlexBox>
              <p className="text-sm text-gray-600">Kampanie reklamowe Google</p>
            </button>
          </GridBox>
        </div>
      </div>
    </>
  );
};