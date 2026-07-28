import type { MotionValue } from "motion";
import type { ProductId } from "@/lib/product-urls";

export type HandoffOption = "a" | "b" | "c";
export type HandoffProduct = ProductId;
export type HandoffProductSelection = HandoffProduct | "walk";
export type HandoffViewport = "auto" | "mobile" | "tablet" | "desktop";

export type ArtifactFact = {
  label: string;
  value: string;
};

export type ArtifactState = {
  kind: HandoffProduct;
  productLabel: string;
  text: string;
  facts: ArtifactFact[];
};

export type HandoffDefinition = {
  product: HandoffProduct;
  caption: string;
  lead: string;
  body: string;
  source: ArtifactState;
  destination: ArtifactState;
  payloadText: string;
  nextHref: string | null;
  nextLabel: string | null;
  lineageLabel: string;
};

export type HandoffSceneProps = {
  definition: HandoffDefinition;
  progress: MotionValue<number>;
  reduced: boolean;
  replayKey: number;
  compact: boolean;
};
