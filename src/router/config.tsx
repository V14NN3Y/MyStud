import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
// Every other page is code-split: it only ships to the browser when the
// visitor actually navigates there, instead of bloating the initial bundle
// every visitor downloads to see the home page.
const Formations = lazy(() => import("@/pages/formations/page"));
const FormationDetail = lazy(() => import("@/pages/formations/detail/page"));
const CompareFormations = lazy(() => import("@/pages/formations/compare/page"));
const Etablissements = lazy(() => import("@/pages/etablissements/page"));
const EtablissementDetail = lazy(() => import("@/pages/etablissements/detail/page"));
const Bourses = lazy(() => import("@/pages/bourses/page"));
const BourseSuivi = lazy(() => import("@/pages/bourses/suivi/page"));
const Annonces = lazy(() => import("@/pages/annonces/page"));
const Emplois = lazy(() => import("@/pages/emplois/page"));
const Ministere = lazy(() => import("@/pages/ministere/page"));
const Acces = lazy(() => import("@/pages/acces/page"));
const Espace = lazy(() => import("@/pages/espace/page"));
const Etudiant = lazy(() => import("@/pages/etudiant/page"));
const Notifications = lazy(() => import("@/pages/notifications/page"));
const Faq = lazy(() => import("@/pages/faq/page"));
const Universite = lazy(() => import("@/pages/universite/page"));
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/formations",
    element: <Formations />,
  },
  {
    path: "/formations/:id",
    element: <FormationDetail />,
  },
  {
    path: "/formations/comparer",
    element: <CompareFormations />,
  },
  {
    path: "/etablissements",
    element: <Etablissements />,
  },
  {
    path: "/etablissements/:id",
    element: <EtablissementDetail />,
  },
  {
    path: "/bourses",
    element: <Bourses />,
  },
  {
    path: "/bourses/suivi",
    element: <BourseSuivi />,
  },
  {
    path: "/stages-emplois",
    element: <Emplois />,
  },
  {
    path: "/ministere",
    element: <Ministere />,
  },
  {
    path: "/universite",
    element: <Universite />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/annonces",
    element: <Annonces />,
  },
  {
    path: "/acces",
    element: <Acces />,
  },
  {
    path: "/espace",
    element: <Espace />,
  },
  {
    path: "/espace/etudiant",
    element: <Etudiant />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
export default routes;
