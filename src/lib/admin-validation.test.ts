import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { complaintUpdateSchema } from "./admin-validation";

describe("complaint updates match database fields", () => {
  const id = "20f83706-7320-43f2-9524-157bbdb14fbf";
  test("preserves administrator notes and priority", () => {
    assert.deepEqual(complaintUpdateSchema.parse({ id, admin_notes: "Follow up", priority: "high" }),
      { id, admin_notes: "Follow up", priority: "high" });
  });
  test("rejects a status absent from the database enum", () => {
    assert.equal(complaintUpdateSchema.safeParse({ id, status: "invalid" }).success, false);
  });
});