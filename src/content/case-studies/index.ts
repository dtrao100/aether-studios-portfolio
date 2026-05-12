import type { CaseStudy } from "./types";
import { complify } from "./complify";
import { servicenow } from "./servicenow";
import { safetywing } from "./safetywing";

export const CASE_STUDIES: Record<string, CaseStudy> = {
  complify,
  servicenow,
  safetywing,
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}

export type { CaseStudy };
