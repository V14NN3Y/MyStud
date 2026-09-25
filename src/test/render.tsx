import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import { DemoSessionProvider } from "@/hooks/DemoSessionProvider";
import { NotificationsProvider } from "@/hooks/NotificationsProvider";
// Mirrors the provider stack App.tsx wraps every real page in, so components
// that reach for useDemoSession()/useNotifications() (navbar, notification bell...)
// work the same way in tests as they do in the running app.
export function renderWithProviders(ui: ReactElement, { route = "/" }: { route?: string } = {}) {
  function Providers({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[route]}>
          <DemoSessionProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </DemoSessionProvider>
        </MemoryRouter>
      </I18nextProvider>
    );
  }
  return render(ui, { wrapper: Providers });
}
export * from "@testing-library/react";
