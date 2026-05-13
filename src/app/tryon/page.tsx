import { SectionHeading } from "@/components/site/section-heading";
import { TryOnStudio } from "@/components/site/tryon-studio";

export default function TryOnPage() {
  return (
    <div className="flex flex-col gap-12">
      <SectionHeading
        eyebrow="AI Try-On Studio"
        title="Your private fitting atelier, powered by AI"
        description="Upload your image, select an outfit, and generate a botanical try-on in seconds."
      />
      <TryOnStudio />
    </div>
  );
}
