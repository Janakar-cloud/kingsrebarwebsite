import Image from "next/image";

import { Motif, type MotifVariant } from "@/components/graphics/Motif";
import { showPlaceholders } from "@/config/env";
import { isApproved, isPending, type Approved, type ImageAsset } from "@/content/types";
import { cn } from "@/lib/cn";
import styles from "./ImageSlot.module.css";

type Props = {
  image?: Approved<ImageAsset>;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  /** Abstract treatment shown while no approved image exists. */
  fallback: MotifVariant;
  priority?: boolean;
  className?: string;
};

/**
 * Shows an approved image, or a neutral abstract motif while imagery is pending.
 * In preview builds the pending requirement is labelled on top of the motif.
 */
export function ImageSlot({ image, sizes, fallback, priority, className }: Props) {
  return (
    <div className={cn(styles.slot, className)} data-tone="dark">
      {isApproved(image) ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className={styles.media}
        />
      ) : (
        <Motif variant={fallback} className={styles.media} />
      )}
      {showPlaceholders && isPending(image) && (
        <p className={cn("pending", styles.note)}>
          <span className="pending__label">Image needed</span>
          {image.pending}
        </p>
      )}
    </div>
  );
}
