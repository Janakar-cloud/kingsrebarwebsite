import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

type StyleProps = {
  variant?: Variant;
  size?: "md" | "lg";
  /** Trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({ variant = "primary", size = "md", className }: Omit<StyleProps, "children">) {
  return cn(styles.button, styles[variant], size === "lg" && styles.lg, className);
}

function Content({ children, arrow }: Pick<StyleProps, "children" | "arrow">) {
  return (
    <>
      <span>{children}</span>
      {arrow && <Icon name="arrow" className={styles.arrow} />}
    </>
  );
}

export function ButtonLink({
  variant,
  size,
  arrow,
  className,
  children,
  href,
  ...linkProps
}: StyleProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const classNameResolved = classes({ variant, size, className });
  const content = <Content arrow={arrow}>{children}</Content>;
  const absolute = typeof href === "string" && /^(mailto:|tel:|https?:)/i.test(href);

  if (absolute) {
    const external = typeof href === "string" && /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classNameResolved}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classNameResolved} {...linkProps}>
      {content}
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  className,
  children,
  type = "button",
  ...buttonProps
}: StyleProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type={type} className={classes({ variant, size, className })} {...buttonProps}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
