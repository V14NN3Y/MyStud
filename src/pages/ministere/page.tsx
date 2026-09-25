import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import SectionHeading from "@/components/base/SectionHeading";
import {
  candidaturesEtablissements,
  effectifsDomaines,
  effectifsEtablissements,
  repartitionGenre,
  tendancesEffectifs,
  zonesMinistere,
} from "@/mocks/ministere";
import ScopeBar from "./components/ScopeBar";
import KpiGrid from "./components/KpiGrid";
import BarList from "./components/BarList";
import DonutChart from "./components/DonutChart";
import TendancesChart from "./components/TendancesChart";
import ReussitePanel from "./components/ReussitePanel";
import CandidaturesPanel from "./components/CandidaturesPanel";
import BoursesPanel from "./components/BoursesPanel";
import AlertesPanel from "./components/AlertesPanel";
import OffreCibleePanel from "./components/OffreCibleePanel";
const nf = (n: number) => n.toLocaleString("fr-FR");
const EFFECTIF_NATIONAL = effectifsEtablissements.reduce((sum, e) => sum + e.effectif, 0);
export default function Ministere() {
  const { t } = useTranslation();
  const [zone, setZone] = useState("");
  const [exportFait, setExportFait] = useState(false);
  const { etabs, candidatureRows, ratio } = useMemo(() => {
    const filtered = zone ? effectifsEtablissements.filter((e) => e.zone === zone) : effectifsEtablissements;
    const sigles = new Set(filtered.map((e) => e.sigle));
    const rows = candidaturesEtablissements.filter((c) => sigles.has(c.sigle));
    const total = filtered.reduce((sum, e) => sum + e.effectif, 0);
    return { etabs: filtered, candidatureRows: rows, ratio: total / EFFECTIF_NATIONAL };
  }, [zone]);
  const effectifTotal = etabs.reduce((sum, e) => sum + e.effectif, 0);
  const domainesFiltres = effectifsDomaines.map((d) => ({ ...d, effectif: Math.round(d.effectif * ratio) }));
  const boursesEffectif = Math.round(18650 * ratio);
  const formationsEffectif = Math.round(334 * ratio);
  const candidaturesTotal = candidatureRows.reduce((sum, c) => sum + c.candidatures, 0);
  const admissionsTotal = candidatureRows.reduce((sum, c) => sum + c.admissions, 0);
  const listeAttenteTotal = candidatureRows.reduce((sum, c) => sum + c.listeAttente, 0);
  const kpis = [
    { key: "effectifs", label: t("ministere.kpi.effectifs"), valeur: nf(effectifTotal), unite: "étudiants", icon: "ri-group-line", tendance: "+3,1 %", positif: true },
    { key: "etablissements", label: t("ministere.kpi.etablissements"), valeur: String(etabs.length), unite: "établissements", icon: "ri-building-2-line", tendance: "stable", positif: true },
    { key: "formations", label: t("ministere.kpi.formations"), valeur: nf(formationsEffectif), unite: "formations", icon: "ri-book-2-line", tendance: "+12", positif: true },
    { key: "candidatures", label: t("ministere.kpi.candidatures"), valeur: nf(candidaturesTotal), unite: "candidatures", icon: "ri-file-list-3-line", tendance: "+8,4 %", positif: true },
    { key: "admissions", label: t("ministere.kpi.admissions"), valeur: nf(admissionsTotal), unite: "admissions", icon: "ri-checkbox-circle-line", tendance: "+5,2 %", positif: true },
    { key: "listeAttente", label: t("ministere.kpi.listeAttente"), valeur: nf(listeAttenteTotal), unite: "dossiers", icon: "ri-time-line", tendance: "−1,7 %", positif: true },
    { key: "tauxReussite", label: t("ministere.kpi.tauxReussite"), valeur: "81,4", unite: "% de réussite", icon: "ri-medal-line", tendance: "+1,9 pt", positif: true },
    { key: "bourses", label: t("ministere.kpi.bourses"), valeur: nf(boursesEffectif), unite: "bourses accordées", icon: "ri-hand-coin-line", tendance: "+6,8 %", positif: true },
  ];
  const zoneSegments = zonesMinistere.map((z, index) => ({
    id: z,
    label: z,
    value: effectifsEtablissements.filter((e) => e.zone === z).reduce((sum, e) => sum + e.effectif, 0),
    color: ["var(--primary-500)", "var(--accent-500)", "var(--secondary-500)"][index],
  }));
  const genreSegments = repartitionGenre.map((g, index) => ({
    id: g.genre,
    label: g.genre,
    value: g.pourcentage,
    color: ["var(--primary-500)", "var(--accent-500)"][index],
  }));
  const handleExport = () => {
    setExportFait(true);
    window.print();
    window.setTimeout(() => setExportFait(false), 2600);
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("ministere.eyebrow")}
          title={t("ministere.title")}
          subtitle={t("ministere.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("ministere.title") }]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">
              <i className="ri-shield-check-line text-sm"></i>
              {t("ministere.anonyme")}
            </span>
            <button
              type="button"
              onClick={handleExport}
              className="no-print inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <i className="ri-printer-line text-sm"></i>
              {t("ministere.export")}
            </button>
            {exportFait && (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800 animate-fade-in">
                <i className="ri-check-line"></i>
                {t("ministere.exportFait")}
              </span>
            )}
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <ScopeBar value={zone} onChange={setZone} />
            <KpiGrid items={kpis} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading
                    eyebrow={t("ministere.scope.national")}
                    title={t("ministere.effectifs.title")}
                    subtitle={t("ministere.effectifs.desc")}
                  />
                  <div className="mt-6">
                    <BarList
                      items={[...etabs]
                        .sort((a, b) => b.effectif - a.effectif)
                        .map((e) => ({ id: e.id, label: `${e.sigle} — ${e.nom}`, sub: `${e.ville} · Zone ${e.zone}`, value: e.effectif }))}
                      total={effectifTotal}
                      accentClass="bg-primary-500"
                      delayBase
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading
                    eyebrow={t("ministere.scope.national")}
                    title={t("ministere.candidatures.title")}
                    subtitle={t("ministere.candidatures.desc")}
                  />
                  <div className="mt-6">
                    <CandidaturesPanel rows={candidatureRows} />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading title={t("ministere.zone.title")} subtitle={t("ministere.zone.desc")} />
                  <div className="mt-6">
                    <DonutChart segments={zoneSegments} centerLabel="étudiants" centerValue={effectifTotal} />
                  </div>
                </div>
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading title={t("ministere.genre.title")} subtitle={t("ministere.genre.desc")} />
                  <div className="mt-6">
                    <DonutChart
                      segments={genreSegments}
                      centerLabel="femmes"
                      centerValue={repartitionGenre[0].pourcentage}
                      centerSuffix=" %"
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
              <SectionHeading
                eyebrow={t("ministere.scope.national")}
                title={t("ministere.domaine.title")}
                subtitle={t("ministere.domaine.desc")}
              />
              <div className="mt-6">
                <BarList
                  items={[...domainesFiltres]
                    .sort((a, b) => b.effectif - a.effectif)
                    .map((d) => ({ id: d.domaine, label: d.domaine, value: d.effectif }))}
                  total={effectifTotal}
                  accentClass="bg-secondary-500"
                  delayBase
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading
                    eyebrow={t("ministere.scope.national")}
                    title={t("ministere.effectifs.title")}
                    subtitle={t("ministere.effectifs.desc")}
                  />
                  <div className="mt-6">
                    <BarList
                      items={[...etabs]
                        .sort((a, b) => b.effectif - a.effectif)
                        .map((e) => ({ id: e.id, label: `${e.sigle} — ${e.nom}`, sub: `${e.ville} · Zone ${e.zone}`, value: e.effectif }))}
                      total={effectifTotal}
                      accentClass="bg-primary-500"
                      delayBase
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading
                    eyebrow={t("ministere.scope.national")}
                    title={t("ministere.candidatures.title")}
                    subtitle={t("ministere.candidatures.desc")}
                  />
                  <div className="mt-6">
                    <CandidaturesPanel rows={candidatureRows} />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading title={t("ministere.zone.title")} subtitle={t("ministere.zone.desc")} />
                  <div className="mt-6">
                    <DonutChart segments={zoneSegments} centerLabel="étudiants" centerValue={effectifTotal} />
                  </div>
                </div>
                <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                  <SectionHeading title={t("ministere.genre.title")} subtitle={t("ministere.genre.desc")} />
                  <div className="mt-6">
                    <DonutChart
                      segments={genreSegments}
                      centerLabel="femmes"
                      centerValue={repartitionGenre[0].pourcentage}
                      centerSuffix=" %"
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
              <SectionHeading
                eyebrow={t("ministere.scope.national")}
                title={t("ministere.domaine.title")}
                subtitle={t("ministere.domaine.desc")}
              />
              <div className="mt-6">
                <BarList
                  items={[...domainesFiltres]
                    .sort((a, b) => b.effectif - a.effectif)
                    .map((d) => ({ id: d.domaine, label: d.domaine, value: d.effectif }))}
                  total={effectifTotal}
                  accentClass="bg-secondary-500"
                  delayBase
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                <SectionHeading
                  eyebrow={t("ministere.scope.national")}
                  title={t("ministere.tendances.title")}
                  subtitle={t("ministere.tendances.desc")}
                />
                <div className="mt-6">
                  <TendancesChart items={tendancesEffectifs} />
                </div>
              </div>
              <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
                <SectionHeading
                  eyebrow={t("ministere.scope.national")}
                  title={t("ministere.reussite.title")}
                  subtitle={t("ministere.reussite.desc")}
                />
                <div className="mt-6">
                  <ReussitePanel />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
              <SectionHeading
                eyebrow={t("ministere.scope.national")}
                title={t("ministere.bourses.title")}
                subtitle={t("ministere.bourses.desc")}
              />
              <div className="mt-6">
                <BoursesPanel />
              </div>
            </div>
            <OffreCibleePanel />
            <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
              <SectionHeading title={t("ministere.alertes.title")} subtitle={t("ministere.alertes.desc")} />
              <div className="mt-6">
                <AlertesPanel />
              </div>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
