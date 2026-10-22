import Image from "next/image";

import { isApproved, isPending, type Approved, type ImageAsset } from "@/content/types";
import { showPlaceholders } from "@/lib/env";
import { GeometricPattern } from "./GeometricPattern";
import styles from "./ImageSlot.module.css";

type Props = {
  image: Approved<ImageAsset>;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Shows an approved image, or a neutral geometric treatment while imagery is pending.
 * In preview builds the pending requirement is labelled on top of the pattern.
 */
export function ImageSlot({ image, sizes, priority, className }: Props) {
  const classes = [styles.slot, className].filter(Boolean).join(" ");

  if (isApproved(image)) {
    return (
      <div className={classes}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      </div>
    );
  }

  return (
    <div className={classes}>
      <GeometricPattern className={styles.image} />
      {showPlaceholders && isPending(image) && (
        <p className={`pending ${styles.note}`}>
          <span className="pending__label">Image needed</span>
          {image.pending}
        </p>
      )}
    </div>
  );
}
