import Image from "next/image";
import Link from "next/link";

import { EnquiryCta } from "@/components/EnquiryCta";
import { PageHeader } from "@/components/PageHeader";
import { PendingNote } from "@/components/Pending";
import { products, type Product } from "@/content/pages";
import { showPlaceholders } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";
import styles from "./products.module.css";

export const metadata = pageMetadata(products.meta, "/products");

function ProductCard({ product }: { product: Product }) {
  return (
    <li className={`card ${styles.product}`}>
      {product.image && (
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          sizes="(min-width: 48rem) 33vw, 100vw"
          className={styles.image}
        />
      )}
      <h3>{product.name}</h3>
      <p>{product.summary}</p>
      {product.details && product.details.length > 0 && (
        <dl className={styles.details}>
          {product.details.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Link href="/contact" className={styles.enquire}>
        {products.enquiryPrompt}
        <span className="visually-hidden">: {product.name}</span>
      </Link>
    </li>
  );
}

export default function ProductsPage() {
  const hasProducts = products.items.length > 0;

  return (
    <>
      <PageHeader title={products.meta.title} intro={products.intro} />

      <section
        className="section"
        aria-labelledby={hasProducts || showPlaceholders ? "product-list-heading" : undefined}
      >
        <div className="container stack">
          {(hasProducts || showPlaceholders) && <h2 id="product-list-heading">Products</h2>}
          {hasProducts ? (
            <ul className="card-grid">
              {products.items.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </ul>
          ) : showPlaceholders ? (
            <>
              <PendingNote note={products.itemsPendingNote} />
              <ul className="card-grid" aria-label="Example layout, not real products">
                {[1, 2, 3].map((n) => (
                  <li key={n} className={`card pending ${styles.sample}`}>
                    <span className="pending__label">Layout example</span>
                    <h3>Product {n}: name to be confirmed</h3>
                    <p>Approved short description, optional image (1200×900) and verified details.</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="lead">{products.emptyFallback}</p>
          )}
        </div>
      </section>

      <EnquiryCta />
    </>
  );
}
