import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <Badge variant="outline" className="mb-4">
        {eyebrow}
      </Badge>
      <h2 className="text-4xl font-semibold md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-lg text-ink/70">{description}</p>
      ) : null}
    </div>
  );
}
