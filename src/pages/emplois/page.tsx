import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import useDemoSession from "@/hooks/useDemoSession";
import { offresEmploi, typesOffre } from "@/mocks/emplois";
import OffreCard from "./components/OffreCard";
import OffreDetail from "./components/OffreDetail";
import ProfilPro from "./components/ProfilPro";
export default function Emplois() {
  const { t } = useTranslation();
  const { profil } = useDemoSession();
  const [type, setType] = useState("");
  const [secteur, setSecteur] = useState("");
  const [ville, setVille] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof offresEmploi)[number] | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const secteurs = useMemo(() => Array.from(new Set(offresEmploi.map((o) => o.secteur))), []);
  const villes = useMemo(() => Array.from(new Set(offresEmploi.map((o) => o.ville))), []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offresEmploi.filter((offre) => {
      if (type && offre.type !== type) return false;
      if (secteur && offre.secteur !== secteur) return false;
      if (ville && offre.ville !== ville) return false;
      if (q && !`${offre.titre} ${offre.entreprise} ${offre.competences.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [type, secteur, ville, query]);
  const resetFiltres = () => {
    setType("");
    setSecteur("");
    setVille("");
    setQuery("");
  };
  const handleApply = (id: string) => {
    setApplied((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const nomComplet = profil ? `${profil.prenom} ${profil.nom}` : undefined;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("emplois.eyebrow")}
          title={t("emplois.title")}
          subtitle={t("emplois.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("emplois.title") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="w-full space-y-5 lg:col-span-2">
              {/* Filtres */}
              <div className="rounded-lg border border-background-200 bg-background-50 p-5">
                <div className="flex items-center gap-2">
                  <i className="ri-search-line text-base text-foreground-400"></i>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("emplois.filters.search")}
                    className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-400"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1">
                  <button
                    type="button"
                    onClick={() => setType("")}
                    className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                      type === "" ? "bg-primary-500 text-background-50" : "text-foreground-600 hover:bg-background-50"
                    }`}
                  >
                    {t("emplois.filters.all")}
                  </button>
                  {typesOffre.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                        type === item ? "bg-primary-500 text-background-50" : "text-foreground-600 hover:bg-background-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    value={secteur}
                    onChange={(e) => setSecteur(e.target.value)}
                    className="w-full cursor-pointer rounded-md border border-background-200 bg-background-50 px-3 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-300"
                  >
                    <option value="">{t("emplois.filters.secteur")} — {t("emplois.filters.all")}</option>
                    {secteurs.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full cursor-pointer rounded-md border border-background-200 bg-background-50 px-3 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-300"
                  >
                    <option value="">{t("emplois.filters.ville")} — {t("emplois.filters.all")}</option>
                    {villes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-background-200 pt-4">
                  <span className="text-xs font-medium text-foreground-600">
                    {results.length} {t("emplois.results")}
                  </span>
                  <button
                    type="button"
                    onClick={resetFiltres}
                    className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
                  >
                    <i className="ri-refresh-line text-sm"></i>
                    {t("emplois.filters.reset")}
                  </button>
                </div>
              </div>
              {/* Résultats */}
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((offre) => (
                    <OffreCard
                      key={offre.id}
                      offre={offre}
                      applied={applied.includes(offre.id)}
                      onOpen={setSelected}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                    <i className="ri-briefcase-line text-2xl text-foreground-600"></i>
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground-950">{t("emplois.empty.title")}</h3>
                  <p className="mt-2 max-w-md text-sm text-foreground-600">{t("emplois.empty.desc")}</p>
                </div>
              )}
            </div>
            <div className="w-full lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ProfilPro nomComplet={nomComplet} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <OffreDetail
        offre={selected}
        applied={selected ? applied.includes(selected.id) : false}
        onClose={() => setSelected(null)}
        onApply={handleApply}
      />
      <PortalFooter />
    </div>
  );
}
