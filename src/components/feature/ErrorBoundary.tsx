import { Component, type ErrorInfo, type ReactNode } from "react";
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
// A plain class component: React has no hook equivalent for error boundaries.
// Text is hardcoded in French rather than pulled from i18n — if the crash is
// upstream of i18n's own state, the fallback must not depend on it either.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erreur non interceptée dans l'interface :", error, info.componentStack);
  }
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background-50 px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <i className="ri-error-warning-line text-2xl" aria-hidden="true"></i>
        </span>
        <h1 className="font-heading text-xl font-bold text-foreground-950">
          Une erreur inattendue est survenue
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-foreground-600">
          Le portail a rencontré un problème technique. Vous pouvez réessayer ou revenir à
          l'accueil ; vos données de démonstration n'ont pas été perdues.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-refresh-line text-base" aria-hidden="true"></i>
            Recharger la page
          </button>
          <a
            href={__BASE_PATH__}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300"
          >
            <i className="ri-home-5-line text-base" aria-hidden="true"></i>
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }
}
