// Pipeline board updates without a refetch: a drag's optimistic move, its rollback and the server's confirmed copy
// all go through place(), so the three can never disagree about counts, totals or card order.

type Card = { id: string; status: { id: string }; expectedValue: number | null; createdAt: string };
export type Column<C extends Card> = { status: { id: string }; count: number; totalValue: number; items: C[] };

const money = (n: number) => Math.round(n * 100) / 100; // keeps ₹100.1 + ₹200.2 from showing as 300.30000000000004

/** Same order as GET /leads/pipeline: newest first, then by id. */
const before = (a: Card, b: Card) => a.createdAt > b.createdAt || (a.createdAt === b.createdAt && a.id < b.id);

/**
 * The board with `card` in the column of `card.status`, taken out of whichever column held it, with both columns'
 * counts and value totals adjusted. A card that isn't on the board (filtered out, or gone after a reload) is left
 * alone: the board only ever changes cards it shows.
 */
export function place<C extends Card, B extends { columns: Column<C>[] }>(board: B, card: C): B {
  const from = board.columns.find((c) => c.items.some((i) => i.id === card.id));
  if (!from) return board;
  const old = from.items.find((i) => i.id === card.id)!;
  const columns = board.columns.map((c) => {
    let { items, count, totalValue } = c;
    if (c === from) {
      items = items.filter((i) => i.id !== card.id);
      count -= 1;
      totalValue -= old.expectedValue ?? 0;
    }
    if (c.status.id === card.status.id) {
      const at = items.findIndex((i) => before(card, i));
      items = at < 0 ? [...items, card] : [...items.slice(0, at), card, ...items.slice(at)];
      count += 1;
      totalValue += card.expectedValue ?? 0;
    }
    return items === c.items ? c : { ...c, items, count, totalValue: money(totalValue) };
  });
  return { ...board, columns };
}
