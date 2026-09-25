import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import Formations from "@/pages/formations/page";
import FormationDetail from "@/pages/formations/detail/page";
import CompareFormations from "@/pages/formations/compare/page";
import Etablissements from "@/pages/etablissements/page";
import EtablissementDetail from "@/pages/etablissements/detail/page";
import Bourses from "@/pages/bourses/page";
import BourseSuivi from "@/pages/bourses/suivi/page";
import Annonces from "@/pages/annonces/page";
import Emplois from "@/pages/emplois/page";
import Ministere from "@/pages/ministere/page";
import Acces from "@/pages/acces/page";
import Espace from "@/pages/espace/page";
import Etudiant from "@/pages/etudiant/page";
import Notifications from "@/pages/notifications/page";
import Faq from "@/pages/faq/page";
import Universite from "@/pages/universite/page";
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
