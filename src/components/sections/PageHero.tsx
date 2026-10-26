import Image from "next/image";
import type { CSSProperties } from "react";

import { Text } from "@/components/content/Pending";
import { Motif, type MotifVariant } from "@/components/graphics/Motif";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { navigation, type Route } from "@/content/routes";
import { isApproved, type Approved, type ImageAsset } from "@/content/types";
import styles from "./PageHero.module.css";

type Props = {
  route: Route;
  title: string;
  /** Approved introduction; while pending, `summary` is shown in production. */
  intro?: Approved<string>;
  summary: string;
  motif: MotifVariant;
  /** Photograph or texture filling the visual panel. Motif is used while this is pending. */
  image?: Approved<ImageAsset>;
  /** Visual first, then title, then lead. Used on the About opening. */
  storytelling?: boolean;
};

const enter = (index: number) => ({ "--enter-index": index }) as CSSProperties;

/** Title band for inner pages: breadcrumb, page index, heading, lead and a visual panel. */
export function PageHero({ route, title, intro, summary, motif, image, storytelling = false }: Props) {
  const position = navigation.findIndex((item) => item.href === route) + 1;

  return (
    <section className={`${styles.hero} grain`} data-tone="dark" aria-labelledby="page-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <Breadcrumbs current={route} />
          <p className="eyebrow" data-enter={storytelling ? "fade" : ""} style={enter(storytelling ? 1 : 0)}>
            {String(position).padStart(2, "0")} / {String(navigation.length).padStart(2, "0")}
          </p>
          <h1 id="page-title" className={styles.title} data-enter="" style={enter(storytelling ? 2 : 1)}>
            {title}
          </h1>
          <div data-enter="" style={enter(storytelling ? 3 : 2)}>
            {intro ? (
              <Text value={intro} fallback={summary} className="lead" />
            ) : (
              <p className="lead">{summary}</p>
            )}
          </div>
        </div>
        <div className={styles.visual} data-enter={storytelling ? "unmask" : "settle"} style={storytelling ? enter(0) : undefined}>
          <div className={styles.parallax}>
            {isApproved(image) ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 60rem) 42vw, 92vw"
                priority
                className={styles.photo}
                style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
              />
            ) : (
              <Motif variant={motif} className={styles.motif} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
