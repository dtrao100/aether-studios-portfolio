import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { CaseStudyShell } from "@/components/CaseStudyShell";
import { WaveBackground } from "@/components/WaveBackground";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const caseStudies = CATEGORIES.find((c) => c.id === "case-studies");
  return (caseStudies?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function CaseStudyPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const category = CATEGORIES.find((c) => c.id === "case-studies");
  const item = category?.items.find((i) => i.id === slug);
  if (!item) notFound();

  return (
    <>
      <WaveBackground />
      <CaseStudyShell slug={slug} />
    </>
  );
}
