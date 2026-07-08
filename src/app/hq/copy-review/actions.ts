"use server";

import { revalidatePath } from "next/cache";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  reviewCopyItem,
  toggleCopyHallOfFame,
} from "@/lib/hq/copy-review";
import type { CopyReviewStatus } from "@/lib/hq/copy-review-types";

type ReviewInput = {
  itemId: string;
  hash: string;
  status: Exclude<CopyReviewStatus, "needs_review">;
  comment?: string;
  saveAsGuidance?: boolean;
};

type HallInput = {
  itemId: string;
  hash: string;
  hallOfFame: boolean;
  hallCategory?: string;
};

export async function reviewCopyItemAction(input: ReviewInput) {
  await requireHqAccess();
  await reviewCopyItem(input);
  revalidatePath("/hq/copy-review");
  return { ok: true };
}

export async function toggleCopyHallAction(input: HallInput) {
  await requireHqAccess();
  await toggleCopyHallOfFame(input);
  revalidatePath("/hq/copy-review");
  return { ok: true };
}
