import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import { faqCategories } from "@/mocks/faq";
export default function Faq() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqCategories[0]?.questions[0]?.id ?? null);
  const q = query.trim().toLowerCase();
  const categories = useMemo(() => {
    if (!q) return faqCategories;
    return faqCategories
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (item) => item.q.toLowerCase().includes(q) || item.r.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [q]);
  const total = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          subtitle={t("faq.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("faq.title") }]}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <i className="ri-search-line pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-foreground-500"></i>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("faq.search")}
                className="w-full rounded-md border border-background-300 bg-background-50 py-2.5 pl-10 pr-4 text-sm text-foreground-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-900">
              <i className="ri-information-line text-sm"></i>
              {t("faq.notice")}
            </span>
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-max lg:sticky lg:top-24">
              <div className="rounded-lg border border-background-200 bg-background-100 p-4">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                  {t("faq.eyebrow")}
                </p>
                <nav className="flex flex-col gap-1">
                  {faqCategories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-foreground-700 transition-colors hover:bg-background-50 hover:text-primary-700"
                    >
                      <i className={`${cat.icon} text-base text-secondary-600`}></i>
                      {cat.titre}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
            <div className="space-y-8">
              {total === 0 ? (
                <div className="rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-14 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                    <i className="ri-question-mark text-2xl text-foreground-600"></i>
                  </span>
                  <h2 className="mt-4 font-heading text-lg font-bold text-foreground-950">
                    {t("faq.empty.title")}
                  </h2>
                  <p className="mt-2 text-sm text-foreground-600">{t("faq.empty.desc")}</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} id={cat.id} className="scroll-mt-28">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-100">
                        <i className={`${cat.icon} text-lg text-primary-700`}></i>
                      </span>
                      <h2 className="font-heading text-lg font-bold text-foreground-950">{cat.titre}</h2>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {cat.questions.map((item) => {
                        const open = openId === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`overflow-hidden rounded-lg border transition-colors ${
                              open ? "border-primary-200 bg-background-50" : "border-background-200 bg-background-50"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenId(open ? null : item.id)}
                              aria-expanded={open}
                              className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left md:p-5"
                            >
                              <span className="text-sm font-semibold text-foreground-950">{item.q}</span>
                              <i
                                className={`${open ? "ri-subtract-line" : "ri-add-line"} shrink-0 text-lg text-primary-600`}
                              ></i>
                            </button>
                            {open && (
                              <p className="animate-fade-in border-t border-background-200 px-4 py-4 text-sm leading-relaxed text-foreground-700 md:px-5">
                                {item.r}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-secondary-200 bg-secondary-50 p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary-100">
                    <i className="ri-customer-service-2-line text-xl text-secondary-700"></i>
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground-950">
                      {t("faq.contact.title")}
                    </h3>
                    <p className="mt-1 text-sm text-foreground-700">{t("faq.contact.desc")}</p>
                  </div>
                </div>
                <Link
                  to="/notifications"
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
                >
                  <i className="ri-customer-service-2-line text-base"></i>
                  {t("faq.contact.cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
