import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import { preferencesNotifications } from "@/mocks/notifications";
import useNotifications from "@/hooks/useNotifications";
import CanauxGrid from "./components/CanauxGrid";
import NotificationItem from "./components/NotificationItem";
import PreferencesMatrix, { type PreferenceRow } from "./components/PreferencesMatrix";
import EvenementsPrioritaires from "./components/EvenementsPrioritaires";
import NotificationDetail from "./components/NotificationDetail";
type TabKey = "historique" | "preferences" | "evenements";
const TABS: { key: TabKey; labelKey: string; icon: string }[] = [
  { key: "historique", labelKey: "notif.tabs.historique", icon: "ri-history-line" },
  { key: "preferences", labelKey: "notif.tabs.preferences", icon: "ri-equalizer-line" },
  { key: "evenements", labelKey: "notif.tabs.evenements", icon: "ri-alarm-warning-line" },
];
export default function Notifications() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("historique");
  const { list, nonLues, markRead, toutLire, ouvrir, notificationOuverte } = useNotifications();
  const [prefs, setPrefs] = useState<PreferenceRow[]>(preferencesNotifications as PreferenceRow[]);
  const [saved, setSaved] = useState(false);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const cible = searchParams.get("n");
    if (cible) ouvrir(cible);
  }, [searchParams, ouvrir]);
  const urgent = useMemo(
    () => list.find((n) => n.priorite === "haute" && !n.lu),
    [list]
  );
  const togglePref = (categorie: string, canal: "portail" | "sms" | "email") => {
    setPrefs((prev) =>
      prev.map((row) => {
        if (row.categorie !== categorie || row.verrouille) return row;
        return { ...row, [canal]: !row[canal] };
      })
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("notif.eyebrow")}
          title={t("notif.title")}
          subtitle={t("notif.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("notif.title") }]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-900">
              <i className="ri-information-line text-sm"></i>
              {t("notif.notice")}
            </span>
            <Link
              to="/faq"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <i className="ri-question-line text-sm"></i>
              {t("notif.faqLink")}
            </Link>
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950">
                {t("notif.canaux.title")}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground-600">
                {t("notif.canaux.desc")}
              </p>
              <div className="mt-5">
                <CanauxGrid />
              </div>
            </div>
            {urgent && (
              <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-accent-300 bg-accent-50 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-100 animate-pulse-ring">
                    <i className="ri-alarm-warning-line text-xl text-accent-900"></i>
                  </span>
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-accent-900">
                      <i className="ri-notification-badge-line text-[12px]"></i>
                      {t("notif.urgent.title")}
                    </span>
                    <h3 className="mt-1 font-heading text-base font-bold text-foreground-950">
                      {urgent.titre}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-700">{urgent.message}</p>
                    <p className="mt-1.5 text-[11px] text-foreground-500">
                      {urgent.canal} · {urgent.date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => ouvrir(urgent.id)}
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-accent-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-accent-900 transition-colors hover:bg-accent-100"
                  >
                    <i className="ri-eye-line text-sm"></i>
                    {t("notif.open")}
                  </button>
                  <button
                    type="button"
                    onClick={() => markRead(urgent.id)}
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-4 py-2.5 text-xs font-semibold text-background-50 transition-colors hover:opacity-90"
                  >
                    <i className="ri-check-double-line text-sm"></i>
                    {t("notif.urgent.markRead")}
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1">
                {TABS.map((item) => {
                  const actif = tab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTab(item.key)}
                      aria-pressed={actif}
                      className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                        actif
                          ? "bg-primary-500 text-background-50"
                          : "text-foreground-600 hover:bg-background-50 hover:text-foreground-950"
                      }`}
                    >
                      <i className={`${item.icon} text-base`}></i>
                      {t(item.labelKey)}
                      {item.key === "historique" && nonLues > 0 && (
                        <span
                          className={`ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                            actif ? "bg-background-50 text-primary-700" : "bg-primary-500 text-background-50"
                          }`}
                        >
                          {nonLues}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div key={tab} className="animate-fade-in">
                {tab === "historique" && (
                  <div className="rounded-lg border border-background-200 bg-background-100/60 p-5 md:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground-950">
                          {t("notif.historique.title")}
                        </h2>
                        <p className="mt-1.5 max-w-2xl text-sm text-foreground-600">
                          {t("notif.historique.desc")}
                        </p>
                      </div>
                      {nonLues > 0 && (
                        <button
                          type="button"
                          onClick={toutLire}
                          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                        >
                          <i className="ri-check-double-line text-sm"></i>
                          {t("notif.historique.toutLire")}
                        </button>
                      )}
                    </div>
                    {list.length === 0 ? (
                      <p className="mt-6 rounded-md border border-dashed border-background-300 bg-background-50 p-6 text-center text-sm text-foreground-600">
                        {t("notif.historique.empty")}
                      </p>
                    ) : (
                      <ul className="mt-5 flex flex-col gap-3">
                        {list.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={markRead}
                            onOpen={ouvrir}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {tab === "preferences" && (
                  <div className="rounded-lg border border-background-200 bg-background-100/60 p-5 md:p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">
                      {t("notif.preferences.title")}
                    </h2>
                    <p className="mt-1.5 max-w-3xl text-sm text-foreground-600">
                      {t("notif.preferences.desc")}
                    </p>
                    {saved && (
                      <span className="animate-fade-in mt-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800">
                        <i className="ri-check-line"></i>
                        {t("notif.preferences.saved")}
                      </span>
                    )}
                    <div className="mt-5">
                      <PreferencesMatrix rows={prefs} onToggle={togglePref} />
                    </div>
                  </div>
                )}
                {tab === "evenements" && (
                  <div className="rounded-lg border border-background-200 bg-background-100/60 p-5 md:p-6">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">
                      {t("notif.evenements.title")}
                    </h2>
                    <p className="mt-1.5 max-w-3xl text-sm text-foreground-600">
                      {t("notif.evenements.desc")}
                    </p>
                    <div className="mt-5">
                      <EvenementsPrioritaires />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
      <NotificationDetail notification={notificationOuverte} onClose={() => ouvrir(null)} />
    </div>
  );
}
