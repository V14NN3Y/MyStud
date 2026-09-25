import { useTranslation } from "react-i18next";
import CountUp from "@/components/base/CountUp";
interface CandidatureRow {
  id: string;
  sigle: string;
  nom: string;
  candidatures: number;
  admissions: number;
  listeAttente: number;
  refus: number;
}
interface CandidaturesPanelProps {
  rows: CandidatureRow[];
}
export default function CandidaturesPanel({ rows }: CandidaturesPanelProps) {
  const { t } = useTranslation();
  const totaux = rows.reduce(
    (acc, row) => ({
      candidatures: acc.candidatures + row.candidatures,
      admissions: acc.admissions + row.admissions,
      listeAttente: acc.listeAttente + row.listeAttente,
      refus: acc.refus + row.refus,
    }),
    { candidatures: 0, admissions: 0, listeAttente: 0, refus: 0 }
  );
  return (
    <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 bg-background-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.etablissement")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.candidatures")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.admissions")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.listeAttente")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.refus")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.candidatures.col.taux")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const taux = row.candidatures > 0 ? ((row.admissions / row.candidatures) * 100).toFixed(1) : "0";
              return (
                <tr key={row.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-100 text-[10px] font-bold text-primary-800">
                        {row.sigle}
                      </span>
                      <span className="text-sm font-medium text-foreground-900">{row.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground-800">
                    <CountUp value={row.candidatures} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-primary-700">
                    <CountUp value={row.admissions} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-accent-800">
                    <CountUp value={row.listeAttente} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground-600">
                    <CountUp value={row.refus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-semibold text-secondary-900">
                      {taux} %
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-background-300 bg-background-100 font-semibold text-foreground-950">
              <td className="px-4 py-3 text-xs uppercase tracking-wide">{t("ministere.scope.national")}</td>
              <td className="px-4 py-3 text-right">
                <CountUp value={totaux.candidatures} />
              </td>
              <td className="px-4 py-3 text-right text-primary-700">
                <CountUp value={totaux.admissions} />
              </td>
              <td className="px-4 py-3 text-right text-accent-800">
                <CountUp value={totaux.listeAttente} />
              </td>
              <td className="px-4 py-3 text-right">
                <CountUp value={totaux.refus} />
              </td>
              <td className="px-4 py-3 text-right">
                {totaux.candidatures > 0 ? ((totaux.admissions / totaux.candidatures) * 100).toFixed(1) : "0"} %
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

