import { useNavigate, useRoutes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import routes from "./config";
import RouteLoading from "@/components/feature/RouteLoading";
import { resolveNavigate } from "./navigate";
export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  useEffect(() => {
    resolveNavigate(navigate);
  });
  return <Suspense fallback={<RouteLoading />}>{element}</Suspense>;
}
