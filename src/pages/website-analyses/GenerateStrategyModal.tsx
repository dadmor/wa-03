// src/components/website-analyses/GenerateStrategyModal.tsx
import React, { useState, useEffect } from "react";
import { useCreate } from "@refinedev/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Wallet,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useLLMOperation, useFormSchemaStore } from "@/utility/formSchemaStore";
import { CAMPAIGN_GENERATION_OPERATION } from "@/pages/web-campaign-steps/campaignWizard.constants";

interface GenerateStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteAnalysis: {
    id: string;
    url: string;
    description: string;
    keywords: string[];
    industry: string;
  };
  onSuccess?: () => void;
}

export const GenerateStrategyModal: React.FC<GenerateStrategyModalProps> = ({
  isOpen,
  onClose,
  websiteAnalysis,
  onSuccess,
}) => {
  const { mutate: createMarketingStrategy } = useCreate();
  const { register } = useFormSchemaStore();
  const llmGeneration = useLLMOperation(
    "strategy-modal",
    "generate-campaign"
  );

  // Form states
  const [industry, setIndustry] = useState(websiteAnalysis.industry);
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budgetRecommendation, setBudgetRecommendation] = useState(0);
  const [notes, setNotes] = useState("");

  // UI states
  const [step, setStep] = useState<"configure" | "generating" | "edit" | "saved">("configure");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Rejestruj schemat dla modala
    register({
      id: "strategy-modal",
      title: "Generator strategii - Modal",
      schema: {
        config: {
          title: "Konfiguracja",
          type: "object",
          properties: {
            industry: { type: "string" },
          },
        },
      },
    });

    // Rejestruj operację LLM
    llmGeneration.registerOperation(CAMPAIGN_GENERATION_OPERATION);
    
    return () => {
      llmGeneration.unregisterOperation();
    };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("configure");
      setIndustry(websiteAnalysis.industry);
      setTitle("");
      setTargetAudience("");
      setBudgetRecommendation(0);
      setNotes("");
      setErrors({});
    }
  }, [isOpen, websiteAnalysis.industry]);

  const handleGenerate = async () => {
    setStep("generating");
    
    try {
      const result = await llmGeneration.executeOperation({
        url: websiteAnalysis.url,
        description: websiteAnalysis.description,
        keywords: websiteAnalysis.keywords,
        industry: industry,
      });

      if (result) {
        setTitle(result.title || "");
        setTargetAudience(result.targetAudience || "");
        setBudgetRecommendation(result.budgetRecommendation || 0);
        setNotes(result.notes || "");
        setStep("edit");
      }
    } catch (error) {
      console.error("Error generating strategy:", error);
      setStep("configure");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = "Tytuł jest wymagany (min. 3 znaki)";
    }

    if (!targetAudience.trim() || targetAudience.length < 50) {
      newErrors.targetAudience = "Grupa docelowa jest wymagana (min. 50 znaków)";
    }

    if (!budgetRecommendation || budgetRecommendation < 500) {
      newErrors.budgetRecommendation = "Budżet musi być minimum 500 PLN";
    }

    if (!notes.trim() || notes.length < 100) {
      newErrors.notes = "Notatki są wymagane (min. 100 znaków)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    createMarketingStrategy(
      {
        resource: "marketing_strategies",
        values: {
          website_analysis_id: websiteAnalysis.id,
          title: title.trim(),
          target_audience: targetAudience.trim(),
          budget_recommendation: budgetRecommendation,
          notes: notes.trim(),
          industry_override: industry,
        },
      },
      {
        onSuccess: () => {
          setSaving(false);
          setStep("saved");
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 2000);
        },
        onError: (error) => {
          setSaving(false);
          console.error("Error saving strategy:", error);
          alert("Wystąpił błąd podczas zapisywania strategii");
        },
      }
    );
  };

  const handleClose = () => {
    if (step === "generating" || saving) return; // Prevent closing during operations
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Generuj nową strategię marketingową
          </DialogTitle>
          <DialogDescription>
            Dla strony: <span className="font-medium">{websiteAnalysis.url}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Configure */}
        {step === "configure" && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Branża (możesz dostosować)</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="np. E-commerce mody"
              />
              <p className="text-sm text-muted-foreground">
                Zmiana branży pozwoli wygenerować strategię dostosowaną do innego segmentu
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                AI przeanalizuje Twoją stronę i zaproponuje kompletną strategię marketingową
                dostosowaną do wybranej branży.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Anuluj
              </Button>
              <Button onClick={handleGenerate} disabled={!industry.trim()}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generuj strategię
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === "generating" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
            <p className="text-lg font-medium">Generuję strategię marketingową...</p>
            <p className="text-sm text-muted-foreground">
              AI analizuje Twoją stronę i przygotowuje rekomendacje
            </p>
          </div>
        )}

        {/* Step 3: Edit */}
        {step === "edit" && (
          <div className="space-y-6 py-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Strategia została wygenerowana! Możesz ją teraz edytować przed zapisaniem.
              </AlertDescription>
            </Alert>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tytuł kampanii <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Wprowadź tytuł kampanii..."
                className={errors.title ? "border-red-300" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Grupa docelowa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Opisz grupę docelową..."
                rows={4}
                className={`resize-none ${errors.targetAudience ? "border-red-300" : ""}`}
              />
              {errors.targetAudience && (
                <p className="text-sm text-red-600">{errors.targetAudience}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Budżet miesięczny (PLN) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                value={budgetRecommendation}
                onChange={(e) => setBudgetRecommendation(parseInt(e.target.value) || 0)}
                placeholder="Minimum 500 PLN"
                min={500}
                className={errors.budgetRecommendation ? "border-red-300" : ""}
              />
              {errors.budgetRecommendation && (
                <p className="text-sm text-red-600">{errors.budgetRecommendation}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Notatki strategiczne <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dodaj notatki strategiczne..."
                rows={6}
                className={`resize-none ${errors.notes ? "border-red-300" : ""}`}
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes}</p>
              )}
              <p className="text-sm text-gray-500">
                {notes.length} znaków (minimum 100)
              </p>
            </div>

            <Separator />

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={saving}>
                Anuluj
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Zapisuję...
                  </>
                ) : (
                  "Zapisz strategię"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 4: Saved */}
        {step === "saved" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
            <p className="text-lg font-medium">Strategia została zapisana!</p>
            <p className="text-sm text-muted-foreground">
              Zaraz zostaniesz przekierowany...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};