import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { CaseStudyShell } from "@/components/CaseStudyShell";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const caseStudies = CATEGORIES.find((c) => c.id === "case-studies");
  // Skip disabled items — they're shown locked in the XMB and have no page.
  return (caseStudies?.items ?? [])
    .filter((i) => i.status !== "disabled" && i.href)
    .map((i) => ({ slug: i.id }));
}

export default async function CaseStudyPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const category = CATEGORIES.find((c) => c.id === "case-studies");
  const item = category?.items.find((i) => i.id === slug);
  if (!item) notFound();

  return <CaseStudyShell slug={slug} />;
}
