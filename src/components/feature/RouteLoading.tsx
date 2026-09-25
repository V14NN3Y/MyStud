export default function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-1 items-center justify-center bg-background-50">
      <i className="ri-loader-4-line animate-spin text-3xl text-primary-500" aria-hidden="true"></i>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
