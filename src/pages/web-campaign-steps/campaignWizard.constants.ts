// src/pages/web-campaign-steps/campaignWizard.constants.ts

import { LLMOperation } from "@/utility/formSchemaStore";

// ===== FORM SCHEMA =====
export const CAMPAIGN_WIZARD_SCHEMA = {
  id: "campaign-wizard",
  title: "Kreator kampanii marketingowej",
  schema: {
    step1: {
      title: "Analiza strony",
      type: "object",
      properties: {
        url: {
          type: "url",
          title: "Adres strony internetowej",
          placeholder: "https://twojafirma.pl",
        },
      },
      required: ["url"],
    },
    step2: {
      title: "Przegląd analizy",
      type: "object",
      properties: {
        description: { type: "textarea", title: "Opis", readOnly: true },
        keywords: { type: "tags", title: "Słowa kluczowe", readOnly: true },
        industry: { type: "text", title: "Branża", readOnly: true },
      },
    },
    step3: {
      title: "Dostosowanie branży",
      type: "object",
      properties: {
        industry: {
          type: "text",
          title: "Branża (edytowalna)",
          placeholder: "Dostosuj branżę...",
        },
      },
      required: ["industry"],
    },
    step4: {
      title: "Podgląd kampanii",
      type: "object",
      properties: {
        title: { type: "text", title: "Tytuł kampanii", readOnly: true },
        targetAudience: {
          type: "textarea",
          title: "Grupa docelowa",
          readOnly: true,
        },
        budgetRecommendation: {
          type: "number",
          title: "Budżet (PLN)",
          readOnly: true,
        },
        notes: {
          type: "textarea",
          title: "Notatki strategiczne",
          readOnly: true,
        },
      },
    },
    step5: {
      title: "Finalizacja",
      type: "object",
      properties: {
        title: {
          type: "text",
          title: "Tytuł kampanii",
          placeholder: "Edytuj tytuł...",
        },
        targetAudience: {
          type: "textarea",
          title: "Grupa docelowa",
          placeholder: "Opisz grupę docelową...",
        },
        budgetRecommendation: {
          type: "number",
          title: "Budżet (PLN)",
          placeholder: "Wprowadź budżet...",
        },
        notes: {
          type: "textarea",
          title: "Notatki strategiczne",
          placeholder: "Dodaj notatki...",
        },
      },
      required: ["title", "targetAudience", "budgetRecommendation", "notes"],
    },
  },
};

// ===== LLM OPERATIONS =====
export const WEBSITE_ANALYSIS_OPERATION: LLMOperation = {
  id: "analyze-website",
  name: "Analiza strony internetowej",
  config: {
    endpoint: "https://diesel-power-backend.onrender.com/api/chat",
  },
  prompt: {
    system:
      "Jesteś ekspertem od analizy stron internetowych i marketingu cyfrowego.",
    user: `
Przeanalizuj stronę internetową: {{url}}

Wygeneruj JSON:
{
  "description": "<opis działalności 30-100 słów>",
  "keywords": ["słowo1", "słowo2", "słowo3"],
  "industry": "<konkretna branża>"
}

Wymagania:
- Opis: główne działania/usługi firmy
- Keywords: 5-10 słów kluczowych związanych z branżą
- Industry: konkretna branża (np. "e-commerce mody", "usługi finansowe")
    `,
    responseFormat: "json",
  },
  inputMapping: (data) => ({ url: data.url }),
  outputMapping: (llmResult, currentData) => ({
    ...currentData,
    description: llmResult.description,
    keywords: llmResult.keywords,
    industry: llmResult.industry,
    originalIndustry: llmResult.industry,
  }),
  validation: (result) =>
    !!(result.description && result.keywords && result.industry),
};

export const CAMPAIGN_GENERATION_OPERATION: LLMOperation = {
  id: "generate-campaign",
  name: "Generowanie kampanii marketingowej",
  config: {
    endpoint: "https://diesel-power-backend.onrender.com/api/chat",
  },
  prompt: {
    system:
      "Jesteś ekspertem od marketingu cyfrowego. Tworzysz strategie marketingowe.",
    user: `
Na podstawie analizy strony wygeneruj strategię marketingową:

URL: {{url}}
Opis: {{description}}
Słowa kluczowe: {{keywords}}
Branża: {{industry}}

Wygeneruj JSON:
{
  "title": "<kreatywny tytuł kampanii>",
  "targetAudience": "<szczegółowy opis grupy docelowej - demografia, zainteresowania, zachowania>",
  "budgetRecommendation": <liczba - budżet miesięczny PLN>,
  "notes": "<szczegółowe notatki strategiczne: kanały, timing, content marketing, SEO/SEM, social media, KPI, testy A/B, konkurencja, USP - min 300 słów>"
}

Wymagania:
- Tytuł: angażujący i strategiczny
- Grupa docelowa: bardzo konkretna (wiek, płeć, wykształcenie, zainteresowania)
- Budżet: realistyczny dla branży (1000-50000 PLN)
- Notatki: bardzo szczegółowe z konkretnymi działaniami
    `,
    responseFormat: "json",
  },
  inputMapping: (data) => ({
    url: data.url,
    description: data.description,
    keywords: Array.isArray(data.keywords)
      ? data.keywords.join(", ")
      : data.keywords,
    industry: data.industry,
  }),
  outputMapping: (llmResult, currentData) => ({
    ...currentData,
    title: llmResult.title,
    targetAudience: llmResult.targetAudience,
    budgetRecommendation: llmResult.budgetRecommendation,
    notes: llmResult.notes,
  }),
  validation: (result) =>
    !!(
      result.title &&
      result.targetAudience &&
      result.budgetRecommendation &&
      result.notes
    ),
};

// ===== VALIDATION RULES =====
export const CAMPAIGN_VALIDATION = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    errorMessage: "Tytuł jest wymagany (3-100 znaków)",
  },
  targetAudience: {
    required: true,
    minLength: 50,
    maxLength: 1000,
    errorMessage: "Grupa docelowa jest wymagana (min. 50 znaków)",
  },
  budgetRecommendation: {
    required: true,
    min: 500,
    max: 100000,
    errorMessage: "Budżet musi być między 500 a 100,000 PLN",
  },
  notes: {
    required: true,
    minLength: 100,
    errorMessage: "Notatki są wymagane (min. 100 znaków)",
  },
  url: {
    required: true,
    pattern: /^https?:\/\/.+\..+/,
    errorMessage: "Podaj poprawny adres URL (np. https://example.com)",
  },
};

// ===== UI TEXTS =====
export const CAMPAIGN_UI_TEXTS = {
  steps: {
    1: {
      title: "Podaj adres strony www do analizy",
      description:
        "Nasza AI przeanalizuje Twoją stronę i zaproponuje najlepszą strategię marketingową",
      button: "Analizuj stronę",
      loading: "Analizuję stronę...",
    },
    2: {
      title: "Przegląd danych ze strony",
      description: "Przeanalizowaliśmy Twoją stronę. Sprawdź wyniki analizy.",
      success: "✓ Analiza zakończona pomyślnie",
    },
    3: {
      title: "Krok 3: Potwierdź lub zmień branżę",
      description:
        "Możesz dostosować wykrytą branżę, aby lepiej dopasować strategię",
      button: "Generuj kampanię",
      loading: "Generuję kampanię...",
      loadingInfo:
        "⚡ Generuję strategię marketingową na podstawie analizy strony...",
    },
    4: {
      title: "AI przygotowała kompletną strategię marketingową",
      description: "Dostosuj wszystkie elementy kampanii przed zapisaniem",
      info: "💡 W następnym kroku będziesz mógł edytować wszystkie dane według swoich potrzeb.",
    },
    5: {
      title: "Krok 5: Edytuj i zapisz kampanię",
      description:
        "Dostosuj wszystkie elementy kampanii przed zapisaniem do bazy danych",
      saveInfo:
        "💾 Dane zostaną zapisane w bazie danych Supabase jako analiza strony i strategia marketingowa",
      button: "Zapisz kampanię",
      loading: "Zapisuję do bazy...",
      success:
        "✓ Kampania została zapisana pomyślnie! Przekierowuję do listy strategii...",
    },
  },
  dashboard: {
    title: "Kampanie marketingowe",
    description: "Zarządzaj swoimi kampaniami i twórz nowe strategie",
    wizardTitle: "Kreator kampanii AI",
    wizardDescription:
      "Stwórz kampanię w 5 krokach z pomocą sztucznej inteligencji",
    features: [
      "Automatyczna analiza strony WWW",
      "Generowanie grupy docelowej",
      "Sugestie budżetu i strategii",
      "Analiza branży i konkurencji",
      "Pełna edycja i dostosowanie",
      "Eksport gotowej strategii",
    ],
  },
  errors: {
    urlRequired: "Podaj adres URL strony",
    analysisError: "Błąd analizy:",
    generationError: "Błąd generowania kampanii:",
    saveError: "Wystąpił błąd podczas zapisu",
    websiteAnalysisSaveError: "Wystąpił błąd podczas zapisu analizy strony",
    strategyeSaveError: "Wystąpił błąd podczas zapisu strategii marketingowej",
    unexpectedError: "Wystąpił nieoczekiwany błąd",
  },
};

// ===== API ENDPOINTS =====
export const API_CONFIG = {
  llmEndpoint: "https://diesel-power-backend.onrender.com/api/chat",
  saveTimeout: 2000, // ms - czas przed przekierowaniem po zapisie
};

// ===== NAVIGATION PATHS =====
export const CAMPAIGN_PATHS = {
  dashboard: "/campaign",
  step1: "/campaign/step1",
  step2: "/campaign/step2",
  step3: "/campaign/step3",
  step4: "/campaign/step4",
  step5: "/campaign/step5",
  marketingStrategies: "/marketing-strategies",
  websiteAnalyses: "/website-analyses",
  googleAdsCampaigns: "/google-ads-campaigns",
};
