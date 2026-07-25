export function Flag({ code, className = "" }: { code: string | undefined; className?: string }) {
  if (!code) return null;
  return (
    <img
      src={`/flags/${code}.svg`}
      alt=""
      className={`inline-block h-3 w-4 shrink-0 rounded-[1px] object-cover ${className}`}
    />
  );
}
