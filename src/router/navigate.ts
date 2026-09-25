import type { useNavigate, NavigateFunction } from "react-router-dom";
declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}
let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;
export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});
export function resolveNavigate(navigate: ReturnType<typeof useNavigate>) {
  window.REACT_APP_NAVIGATE = navigate;
  navigateResolver(navigate);
}
