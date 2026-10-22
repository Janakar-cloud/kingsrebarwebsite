import Link from "next/link";

import type { Approved } from "@/content/types";
import { Text } from "./Pending";
import styles from "./PageHeader.module.css";

type Props = {
  title: string;
  intro?: Approved<string>;
};

export function PageHeader({ title, intro }: Props) {
  return (
    <div className={styles.header}>
      <div className="container">
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">{title}</span>
            </li>
          </ol>
        </nav>
        <h1 className={styles.title}>{title}</h1>
        {intro !== undefined && <Text value={intro} className="lead" />}
      </div>
    </div>
  );
}
