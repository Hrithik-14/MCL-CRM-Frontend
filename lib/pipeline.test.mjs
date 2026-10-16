// Run: npm test. place() backs the pipeline's optimistic move, its rollback and the server-confirmed update.
import assert from "node:assert/strict";
import { test } from "node:test";
import { place } from "./pipeline.ts";

const card = (id, status, createdAt, expectedValue = null) => ({ id, status: { id: status }, createdAt, expectedValue });
const board = () => ({
  columns: [
    { status: { id: "new" }, count: 3, totalValue: 300.3, items: [card("a", "new", "2026-10-03", 100.1), card("b", "new", "2026-10-02", 200.2), card("c", "new", "2026-10-01")] },
    { status: { id: "won" }, count: 2, totalValue: 50, items: [card("d", "won", "2026-10-04", 50), card("e", "won", "2026-09-30")] },
    { status: { id: "lost" }, count: 0, totalValue: 0, items: [] },
  ],
});
const ids = (b) => b.columns.map((c) => c.items.map((i) => i.id).join(""));

test("moves a card between columns, keeping newest-first order, counts and value totals", () => {
  const b = place(board(), card("b", "won", "2026-10-02", 200.2));
  assert.deepEqual(ids(b), ["ac", "dbe", ""]);
  assert.deepEqual(b.columns.map((c) => [c.count, c.totalValue]), [[2, 100.1], [3, 250.2], [0, 0]]);
});

test("into an empty column, and rolling back restores the board exactly", () => {
  const start = board();
  const moved = place(start, card("a", "lost", "2026-10-03", 100.1));
  assert.deepEqual(ids(moved), ["bc", "de", "a"]);
  assert.deepEqual(moved.columns[0].totalValue, 200.2); // no 200.20000000000002
  const back = place(moved, start.columns[0].items[0]);
  assert.deepEqual(back, start);
});

test("the server's copy replaces the optimistic one in place (same column: counts unchanged)", () => {
  const saved = { ...card("d", "won", "2026-10-04", 75), version: 2 };
  const b = place(board(), saved);
  assert.deepEqual(ids(b), ["abc", "de", ""]);
  assert.equal(b.columns[1].items[0], saved);
  assert.deepEqual([b.columns[1].count, b.columns[1].totalValue], [2, 75]);
});

test("cards not on the board are ignored; untouched columns keep their identity", () => {
  const start = board();
  assert.equal(place(start, card("zz", "won", "2026-10-05")), start);
  const b = place(start, card("e", "lost", "2026-09-30"));
  assert.equal(b.columns[0], start.columns[0]);
});

test("equal timestamps fall back to the id, like the API's order", () => {
  const tie = place({ columns: [{ status: { id: "x" }, count: 0, totalValue: 0, items: [] }, ...board().columns] }, card("b", "x", "2026-10-02"));
  const t2 = place(tie, card("a", "x", "2026-10-02"));
  assert.deepEqual(t2.columns[0].items.map((i) => i.id), ["a", "b"]);
});
