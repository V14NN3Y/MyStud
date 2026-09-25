import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/formations?q=${encodeURIComponent(trimmed)}` : "/formations");
  };
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden h-[600px] md:h-[720px]">
      <img
        src="https://readdy.ai/api/search-image?query=stylized abstract illustration of west african university campus with modern buildings, students silhouettes and palm trees, warm green gold and terracotta gradient tones, painterly editorial art with soft light&width=1920&height=1080&seq=mystud-hero-main-01&orientation=landscape&nocache=false"
        alt="Campus universitaire stylisé du Bénin avec les couleurs du drapeau"
        title="MyStud Bénin portail de l'enseignement supérieur"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60"></div>
      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-2 text-xs font-medium text-background-100 backdrop-blur">
            <i className="ri-flag-2-line text-accent-300"></i>
            {t("home.hero.eyebrow")}
          </span>
          <h1 className="animate-fade-up delay-1 mt-6 font-heading text-3xl font-extrabold leading-tight tracking-tight text-background-50 md:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-background-100 md:text-base">
            {t("home.hero.subtitle")}
          </p>
          <form
            onSubmit={onSubmit}
            className="animate-fade-up delay-3 mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 rounded-md bg-background-50 px-4 py-3">
              <i className="ri-search-line text-lg text-foreground-500"></i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("home.hero.searchPlaceholder")}
                className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-compass-3-line text-base"></i>
              {t("home.hero.searchButton")}
            </button>
          </form>
          <div className="animate-fade-up delay-4 mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/acces"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-50/30 bg-background-50/10 px-5 py-2.5 text-sm font-semibold text-background-50 backdrop-blur transition-colors hover:bg-background-50/20"
            >
              <i className="ri-shield-check-line text-base"></i>
              {t("home.hero.secondary")}
            </Link>
            <span className="inline-flex items-center gap-2 text-xs text-background-200">
              <i className="ri-information-line"></i>
              {t("home.hero.notice")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
