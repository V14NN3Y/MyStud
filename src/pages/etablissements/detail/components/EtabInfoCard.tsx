import { useTranslation } from "react-i18next";
import type { Etablissement } from "@/types/portal";
import StatusBadge from "@/components/base/StatusBadge";
interface EtabInfoCardProps {
  etablissement: Etablissement;
}
export default function EtabInfoCard({ etablissement }: EtabInfoCardProps) {
  const { t } = useTranslation();
  const carteSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${etablissement.nom} ${etablissement.ville}, Bénin`
  )}&output=embed`;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-background-200 bg-background-50 p-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
          <i className="ri-information-line text-base text-primary-600"></i>
          {t("etab.infos")}
        </h2>
        <dl className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-100">
              <i className="ri-global-line text-sm text-foreground-700"></i>
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-foreground-500">{t("etab.site")}</dt>
              <dd className="truncate text-sm font-medium text-foreground-950">{etablissement.site}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-100">
              <i className="ri-mail-send-line text-sm text-foreground-700"></i>
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-foreground-500">{t("etab.contact")}</dt>
              <dd className="truncate text-sm font-medium text-foreground-950">{etablissement.contact}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-100">
              <i className="ri-map-pin-2-line text-sm text-foreground-700"></i>
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-foreground-500">{t("etab.localisation")}</dt>
              <dd className="text-sm font-medium text-foreground-950">
                {etablissement.ville}, Bénin
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-100">
              <i className="ri-shield-check-line text-sm text-foreground-700"></i>
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-foreground-500">
                {t("common.recognition")}
              </dt>
              <dd className="mt-0.5">
                <StatusBadge statut={etablissement.statut} />
              </dd>
            </div>
          </div>
        </dl>
      </div>
      <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
        <div className="flex items-center justify-between gap-3 border-b border-background-200 px-5 py-3">
          <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
            <i className="ri-road-map-line text-base text-secondary-600"></i>
            {t("etab.localisation")}
          </h2>
          <span className="text-[11px] text-foreground-500">
            {t("common.updated")} {etablissement.majLe}
          </span>
        </div>
        <iframe
          title={`Carte de ${etablissement.nom}`}
          src={carteSrc}
          className="h-[240px] w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
