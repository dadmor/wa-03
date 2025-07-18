// src/pages/website-analyses/strategy-wizard/index.tsx
import { Route } from "react-router";
import { StrategyStep1 } from "./StrategyStep1";
import { StrategyStep2 } from "./StrategyStep2";
import { StrategyStep3 } from "./StrategyStep3";
import { StrategyStep4 } from "./StrategyStep4";

// Komponenty
export { StrategyStep1 } from './StrategyStep1';
export { StrategyStep2 } from './StrategyStep2';
export { StrategyStep3 } from './StrategyStep3';
export { StrategyStep4 } from './StrategyStep4';

// Routes - zwracamy JSX bezpośrednio, nie funkcję komponenta
export const strategyWizardRoutes = [
  <Route key="strategy-step1" path="/website-analyses/:id/strategy/step1" element={<StrategyStep1 />} />,
  <Route key="strategy-step2" path="/website-analyses/:id/strategy/step2" element={<StrategyStep2 />} />,
  <Route key="strategy-step3" path="/website-analyses/:id/strategy/step3" element={<StrategyStep3 />} />,
  <Route key="strategy-step4" path="/website-analyses/:id/strategy/step4" element={<StrategyStep4 />} />,
];