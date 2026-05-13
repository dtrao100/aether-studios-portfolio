import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { CaseStudyShell } from "@/components/CaseStudyShell";

type Params = { slug: string };

// Hard-lock to the static set so disabled items (SafetyWing) 404 on the
// live host instead of being rendered on-demand by the router.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const caseStudies = CATEGORIES.find((c) => c.id === "case-studies");
  return (caseStudies?.items ?? [])
    .filter((i) => i.status !== "disabled" && i.href)
    .map((i) => ({ slug: i.id }));
}

export default async function CaseStudyPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const category = CATEGORIES.find((c) => c.id === "case-studies");
  const item = category?.items.find((i) => i.id === slug);
  if (!item || item.status === "disabled") notFound();

  return <CaseStudyShell slug={slug} />;
}
