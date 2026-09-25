import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AppRoutes } from "./router";
import i18n from "./i18n";
import { DemoSessionProvider } from "@/hooks/useDemoSession";
import { NotificationsProvider } from "@/hooks/useNotifications";
import useScrollReveal from "@/hooks/useScrollReveal";
import CompareBar from "@/components/feature/CompareBar";
function AppShell() {
  useScrollReveal();
  return (
    <>
      <AppRoutes />
      <CompareBar />
    </>
  );
}
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <DemoSessionProvider>
          <NotificationsProvider>
            <AppShell />
          </NotificationsProvider>
        </DemoSessionProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}
export default App;
