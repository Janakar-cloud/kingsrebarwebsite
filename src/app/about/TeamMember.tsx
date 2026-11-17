import Image from "next/image";
import type { CSSProperties } from "react";

import { about } from "@/content/pages/about";
import styles from "./about.module.css";

type Member = (typeof about.people.members)[number];

export function TeamMember({
  member,
  index,
  decorative = false,
}: {
  member: Member;
  index: number;
  decorative?: boolean;
}) {
  const department = "group" in member && member.group ? member.group : member.role;

  return (
    <li
      className={styles.person}
      style={{ "--person-delay": `${index * 0.35}s` } as CSSProperties}
      aria-hidden={decorative || undefined}
    >
      <figure className={styles.personCard}>
        <Image
          src={member.image.src}
          alt={decorative ? "" : member.image.alt}
          width={member.image.width}
          height={member.image.height}
          sizes="16rem"
          className={styles.personPhoto}
        />
        <figcaption className={styles.personCaption}>
          <span className={styles.personMeta}>
            <span className={styles.personName}>{member.name}</span>
            <span className={styles.personDept}>{department}</span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}
