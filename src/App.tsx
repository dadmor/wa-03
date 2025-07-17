import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Layout } from "./components/layout";
import { authProvider, supabaseClient } from "./utility";
import {
  websiteAnalysisResource,
  websiteAnalysisRoutes,
} from "./pages/website-analyses";
import {
  marketingStrategyResource,
  marketingStrategyRoutes,
} from "./pages/marketing-strategies";
import {
  googleAdsCampaignResource,
  googleAdsCampaignRoutes,
} from "./pages/google-ads-campaigns";
import { profileResource, profileRoutes } from "./pages/profiles";
import { authRoutes } from "./pages/auth";



import LandingPage from "./pages/Landing";
import { webCampaignResource, webCampaignRoutes } from "./pages/web-campaign-steps";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider(supabaseClient)}
        liveProvider={liveProvider(supabaseClient)}
        authProvider={authProvider}
        routerProvider={routerBindings}
        resources={[
          webCampaignResource,
          websiteAnalysisResource,
          marketingStrategyResource,
          googleAdsCampaignResource,
          profileResource,
          
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          useNewQueryKeys: true,
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          {...authRoutes}

          {/* Dashboard route - dla zalogowanych użytkowników */}
          <Route
            path="/dashboard"
            element={
              <Authenticated
                key="dashboard"
                fallback={<CatchAllNavigate to="/login" />}
              >
                <NavigateToResource resource="campaigns" />
              </Authenticated>
            }
          />

          {/* Protected routes */}
          <Route
            element={
              <Authenticated
                key="protected-layout"
                fallback={<CatchAllNavigate to="/login" />}
              >
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            {...webCampaignRoutes}
            {...websiteAnalysisRoutes}
            {...marketingStrategyRoutes}
            {...googleAdsCampaignRoutes}
            {...profileRoutes}
           
            <Route path="*" element={<ErrorComponent />} />
          </Route>
        </Routes>

        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </BrowserRouter>
  );
}
export default App;
