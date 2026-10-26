import Image from "next/image";
import type { CSSProperties } from "react";

import { Text } from "@/components/content/Pending";
import { RebarLayer } from "@/components/graphics/RebarField";
import { ButtonLink } from "@/components/ui/Button";
import { home } from "@/content/pages/home";
import { site } from "@/content/site";
import { isApproved } from "@/content/types";
import styles from "./HomeHero.module.css";

const enter = (index: number) => ({ "--enter-index": index }) as CSSProperties;

/**
 * Entrance sequence: the visual layers settle first, the headline rises line
 * by line, then the supporting copy and actions follow. CSS only; the final
 * state is the default state, so nothing depends on JavaScript.
 */
export function HomeHero() {
  const { hero, titleLines, taglineLines } = home;

  return (
    <section className={`${styles.hero} grain`} data-tone="dark" aria-labelledby="home-title">
      <div className={styles.layers} aria-hidden="true">
        {isApproved(hero.image) ? (
          <div className={styles.layer} data-enter="settle">
            <Image src={hero.image.src} alt="" fill priority sizes="100vw" className={styles.photo} />
          </div>
        ) : (
          <>
            <div className={styles.layer} data-enter="settle">
              <div className={`${styles.depth} ${styles.far}`}>
                <RebarLayer layer="far" className={styles.svg} />
              </div>
            </div>
            <div className={styles.layer} data-enter="settle" style={enter(1)}>
              <div className={`${styles.depth} ${styles.mid}`}>
                <RebarLayer layer="mid" className={styles.svg} />
              </div>
            </div>
            <div className={styles.layer} data-enter="settle" style={enter(2)}>
              <div className={`${styles.depth} ${styles.near}`}>
                <RebarLayer layer="near" className={styles.svg} />
              </div>
            </div>
          </>
        )}
        <div className={styles.shade} />
      </div>

      {isApproved(site.assets.mark) && (
        <div className={styles.seal} aria-hidden="true" data-enter="settle" style={enter(2)}>
          <Image
            src={site.assets.mark.src}
            alt=""
            width={site.assets.mark.width}
            height={site.assets.mark.height}
            sizes="140px"
            priority
          />
        </div>
      )}

      <div className={`container ${styles.content}`}>
        <div className={styles.heading}>
          <h1 id="home-title" className={styles.title}>
            <span className={styles.line}>
              <span data-enter="line" style={enter(1)}>
                {titleLines[0]}
              </span>
            </span>{" "}
            <span className={styles.line}>
              <span data-enter="line" style={enter(2)} className={styles.outline}>
                {titleLines[1]}
              </span>
            </span>
          </h1>
          <p className={styles.tagline} data-enter="" style={enter(3)}>
            <span>{taglineLines[0]}</span>
            <span>{taglineLines[1]}</span>
          </p>
        </div>
        <div className={styles.footer}>
          <div className={styles.lead} data-enter="" style={enter(4)}>
            <Text value={hero.intro} fallback={hero.summary} className="lead" />
          </div>
          <div className={styles.actions} data-enter="" style={enter(5)}>
            <ButtonLink href={hero.primaryCta.href} size="lg" arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
