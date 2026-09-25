import { useTranslation } from "react-i18next";
import { canauxNotification } from "@/mocks/notifications";
export default function CanauxGrid() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {canauxNotification.map((canal) => (
        <div
          key={canal.id}
          className={`flex flex-col rounded-lg border p-5 ${
            canal.obligatoire
              ? "border-primary-200 bg-primary-50"
              : "border-background-200 bg-background-50"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-md ${
                canal.obligatoire ? "bg-primary-100" : "bg-secondary-100"
              }`}
            >
              <i
                className={`${canal.icon} text-xl ${
                  canal.obligatoire ? "text-primary-700" : "text-secondary-700"
                }`}
              ></i>
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                canal.obligatoire
                  ? "bg-primary-100 text-primary-800"
                  : "bg-background-200 text-foreground-700"
              }`}
            >
              {canal.obligatoire ? t("notif.canaux.obligatoire") : t("notif.canaux.optionnel")}
            </span>
          </div>
          <h3 className="mt-4 font-heading text-base font-bold text-foreground-950">{canal.nom}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-600">{canal.description}</p>
        </div>
      ))}
    </div>
  );
}
