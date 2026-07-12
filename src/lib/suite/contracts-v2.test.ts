import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONTEXT_COPY,
  isCalendarDate,
  isIanaTimezone,
  isPlanningPeriodV2,
  isSuiteContextV2,
  isWorkspaceV2,
} from "./contracts-v2";

describe("suite contract v2", () => {
  const period = {
    id: "period-1",
    ownerUserId: "user-1",
    name: "2026/27",
    contextType: "school_year",
    startDate: "2026-09-01",
    endDate: "2027-06-30",
    timezone: "Europe/Dublin",
    position: 0,
    revision: 1,
    createdAt: "2026-07-12T12:00:00.000Z",
    updatedAt: "2026-07-12T12:00:00.000Z",
  } as const;

  it("validates calendar dates and IANA timezones", () => {
    assert.equal(isCalendarDate("2026-02-29"), false);
    assert.equal(isCalendarDate("2028-02-29"), true);
    assert.equal(isIanaTimezone("Europe/Dublin"), true);
    assert.equal(isIanaTimezone("Dublin"), false);
  });

  it("validates a planning period without changing v1", () => {
    assert.equal(isPlanningPeriodV2(period), true);
    assert.equal(isPlanningPeriodV2({ ...period, endDate: "2025-01-01" }), false);
    assert.equal(isPlanningPeriodV2({ ...period, contextType: "teacher" }), false);
  });

  it("validates a workspace with immutable suite identity", () => {
    assert.equal(
      isWorkspaceV2({
        id: "workspace-1",
        ownerUserId: "user-1",
        name: "6th Year Geography",
        planningPeriodId: "period-1",
        contextType: "class",
        primaryDate: "2027-06-11",
        primaryDateLabel: "State examinations",
        position: 1,
        revision: 1,
        createdAt: period.createdAt,
        updatedAt: period.updatedAt,
      }),
      true,
    );
  });

  it("carries planning period and workspace through v2 context", () => {
    assert.equal(
      isSuiteContextV2({
        version: 2,
        sourceProduct: "tasks",
        planningPeriodId: "period-1",
        workspaceId: "workspace-1",
        returnUrl: "https://tasks.signalstudio.ie/app",
      }),
      true,
    );
    assert.equal(
      isSuiteContextV2({ version: 2, sourceProduct: "tasks", returnUrl: "/relative" }),
      false,
    );
  });

  it("centralises context language without changing permissions", () => {
    assert.deepEqual(CONTEXT_COPY.school_year, {
      period: "School year",
      workspace: "Class",
      audience: "Class Timeline",
      workspaceContext: "class",
    });
    assert.equal(CONTEXT_COPY.wedding_season.audience, "Couple Timeline");
  });
});
