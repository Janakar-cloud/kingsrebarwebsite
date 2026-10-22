import { isApproved, isPending, type Approved } from "@/content/types";
import { PendingNote } from "./Pending";

type Item = { title: string; description?: string };

/** Card grid for short titled items such as values, locations or applications. */
export function ItemList({ items, headingLevel = 3 }: { items: Approved<Item[]>; headingLevel?: 3 | 4 }) {
  if (!isApproved(items)) {
    return isPending(items) ? <PendingNote note={items.pending} /> : null;
  }
  const Heading = `h${headingLevel}` as const;
  return (
    <ul className="card-grid">
      {items.map((item) => (
        <li key={item.title} className="card">
          <Heading>{item.title}</Heading>
          {item.description && <p>{item.description}</p>}
        </li>
      ))}
    </ul>
  );
}
