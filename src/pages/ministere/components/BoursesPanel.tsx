import { useTranslation } from "react-i18next";
import CountUp from "@/components/base/CountUp";
import { boursesPilotage } from "@/mocks/ministere";
export default function BoursesPanel() {
  const { t } = useTranslation();
  const totalCandidatures = boursesPilotage.reduce((sum, b) => sum + b.candidatures, 0);
  const totalAccordees = boursesPilotage.reduce((sum, b) => sum + b.accordees, 0);
  return (
    <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
      <div className="grid grid-cols-2 border-b border-background-200 bg-background-100">
        <div className="border-r border-background-200 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-foreground-500">{t("ministere.bourses.col.candidatures")}</p>
          <p className="mt-1 text-xl font-bold text-foreground-950">
            <CountUp value={totalCandidatures} />
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-foreground-500">{t("ministere.bourses.col.accordees")}</p>
          <p className="mt-1 text-xl font-bold text-primary-700">
            <CountUp value={totalAccordees} />
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.bourses.col.programme")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.bourses.col.candidatures")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.bourses.col.accordees")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.bourses.col.montant")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t("ministere.bourses.col.statut")}
              </th>
            </tr>
          </thead>
          <tbody>
            {boursesPilotage.map((bourse) => (
              <tr key={bourse.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground-900">{bourse.programme}</p>
                  <p className="text-xs text-foreground-500">{bourse.organisme}</p>
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground-800">
                  <CountUp value={bourse.candidatures} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-primary-700">
                  <CountUp value={bourse.accordees} />
                </td>
                <td className="px-4 py-3 text-right text-foreground-700">{bourse.montantEngage}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-[11px] font-semibold text-accent-900">
                    {bourse.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
