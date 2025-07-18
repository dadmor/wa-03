// src/pages/website-analyses/strategy-wizard/strategyWizard.constants.ts

import { LLMOperation } from "@/utility/formSchemaStore";

// ===== FORM SCHEMA =====
export const STRATEGY_WIZARD_SCHEMA = {
  id: "strategy-wizard",
  title: "Kreator strategii marketingowej",
  schema: {
    step1: {
      title: "Konfiguracja branży",
      type: "object",
      properties: {
        industry: {
          type: "text",
          title: "Branża",
          placeholder: "np. E-commerce mody",
        },
      },
      required: ["industry"],
    },
    step2: {
      title: "Generowanie strategii",
      type: "object",
      properties: {},
    },
    step3: {
      title: "Przegląd strategii",
      type: "object",
      properties: {
        title: { type: "text", title: "Tytuł", readOnly: true },
        targetAudience: { type: "textarea", title: "Grupa docelowa", readOnly: true },
        budgetRecommendation: { type: "number", title: "Budżet", readOnly: true },
        notes: { type: "textarea", title: "Notatki", readOnly: true },
      },
    },
    step4: {
      title: "Edycja i zapis",
      type: "object",
      properties: {
        title: {
          type: "text",
          title: "Tytuł strategii",
          placeholder: "Wprowadź tytuł...",
        },
        targetAudience: {
          type: "textarea",
          title: "Grupa docelowa",
          placeholder: "Opisz grupę docelową...",
        },
        budgetRecommendation: {
          type: "number",
          title: "Budżet miesięczny (PLN)",
          placeholder: "Minimum 500 PLN",
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
export const STRATEGY_GENERATION_OPERATION: LLMOperation = {
  id: "generate-strategy",
  name: "Generowanie strategii marketingowej",
  config: {
    endpoint: "https://diesel-power-backend.onrender.com/api/chat",
  },
  prompt: {
    system: "Jesteś ekspertem od marketingu cyfrowego. Tworzysz strategie marketingowe.",
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
    keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords,
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
    !!(result.title && result.targetAudience && result.budgetRecommendation && result.notes),
};

// ===== VALIDATION RULES =====
export const STRATEGY_VALIDATION = {
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
};

// ===== UI TEXTS =====
export const STRATEGY_UI_TEXTS = {
  steps: {
    1: {
      title: "Konfiguracja branży",
      description: "Możesz dostosować branżę dla nowej strategii marketingowej",
      button: "Dalej",
    },
    2: {
      title: "Generowanie strategii",
      description: "AI analizuje Twoją stronę i przygotowuje strategię marketingową",
      loading: "Generuję strategię marketingową...",
    },
    3: {
      title: "Przegląd wygenerowanej strategii",
      description: "Sprawdź wygenerowaną strategię przed edycją",
      button: "Edytuj strategię",
    },
    4: {
      title: "Edytuj i zapisz strategię",
      description: "Dostosuj strategię i zapisz ją w systemie",
      button: "Zapisz strategię",
      loading: "Zapisuję...",
      success: "✓ Strategia została zapisana pomyślnie!",
    },
  },
  errors: {
    generationError: "Błąd generowania strategii:",
    saveError: "Wystąpił błąd podczas zapisu strategii",
  },
};

// ===== NAVIGATION PATHS =====
export const STRATEGY_PATHS = {
  step1: (id: string) => `/website-analyses/${id}/strategy/step1`,
  step2: (id: string) => `/website-analyses/${id}/strategy/step2`,
  step3: (id: string) => `/website-analyses/${id}/strategy/step3`,
  step4: (id: string) => `/website-analyses/${id}/strategy/step4`,
  analysisShow: (id: string) => `/website-analyses/show/${id}`,
};