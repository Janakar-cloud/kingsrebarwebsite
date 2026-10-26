import Image from "next/image";
import Link from "next/link";

import { Motif, routeMotifs } from "@/components/graphics/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { pageHeroImages } from "@/content/hero-images";
import { navigation, type NavItem } from "@/content/routes";
import { isApproved } from "@/content/types";
import styles from "./LinkIndex.module.css";

/** Large editorial index of site pages, with a preview of each page's hero visual. */
export function LinkIndex({ items, labelledBy }: { items: readonly NavItem[]; labelledBy?: string }) {
  return (
    <ul className={styles.list} aria-labelledby={labelledBy}>
      {items.map((item, index) => {
        const position = navigation.findIndex((nav) => nav.href === item.href) + 1;
        const image = pageHeroImages[item.href];
        return (
          <Reveal as="li" key={item.href} index={index} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              <span className={styles.index} aria-hidden="true">
                {String(position).padStart(2, "0")}
              </span>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.description}>{item.description}</span>
              <span className={styles.preview} aria-hidden="true" data-tone="dark">
                {isApproved(image) ? (
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="9rem"
                    className={styles.photo}
                    style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
                  />
                ) : (
                  <Motif variant={routeMotifs[item.href]} className={styles.motif} />
                )}
              </span>
              <Icon name="arrow" className={styles.arrow} />
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
