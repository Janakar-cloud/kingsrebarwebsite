import { ViewTransition, type ReactNode } from "react";

/**
 * Templates remount on every navigation, so the page content gets a fresh
 * enter/exit pair while the header and footer in the layout stay still.
 * Browsers without the View Transitions API simply swap pages instantly.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
