import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmploiDuTemps from "./EmploiDuTemps";
import NotesProgression from "./NotesProgression";
import ExamensList from "./ExamensList";
import DocumentsList from "./DocumentsList";
type TabKey = "edt" | "notes" | "examens" | "documents";
const TABS: { key: TabKey; labelKey: string; icon: string }[] = [
  { key: "edt", labelKey: "etudiant.tabs.edt", icon: "ri-calendar-schedule-line" },
  { key: "notes", labelKey: "etudiant.tabs.notes", icon: "ri-bar-chart-box-line" },
  { key: "examens", labelKey: "etudiant.tabs.examens", icon: "ri-file-list-2-line" },
  { key: "documents", labelKey: "etudiant.tabs.documents", icon: "ri-folder-download-line" },
];
export default function EtudiantTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("edt");
  return (
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
            </button>
          );
        })}
      </div>
      <div key={tab} className="animate-fade-in">
        {tab === "edt" && <EmploiDuTemps />}
        {tab === "notes" && <NotesProgression />}
        {tab === "examens" && <ExamensList />}
        {tab === "documents" && <DocumentsList />}
      </div>
    </div>
  );
}
