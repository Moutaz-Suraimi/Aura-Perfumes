import { Link } from "@tanstack/react-router";

export function SectionTitle({
  title,
  accent,
  href = "/products",
}: {
  title: string;
  accent?: string;
  href?: string;
}) {
  const parts = accent ? title.split(accent) : [title];
  return (
    <div className="flex items-center justify-between my-8 px-4 md:px-12">
      <div className="flex items-center gap-3">
        <span className="w-2 h-8 bg-brand rounded-full hidden md:block"></span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {accent ? (
            <>
              {parts[0]}
              <span className="text-brand">{accent}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </div>
      <Link
        to={href}
        className="text-brand font-bold text-sm md:text-base hover:underline flex items-center gap-1 bg-brand/10 px-4 py-2 rounded-full transition-colors hover:bg-brand/20"
      >
        Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„
      </Link>
    </div>
  );
}
