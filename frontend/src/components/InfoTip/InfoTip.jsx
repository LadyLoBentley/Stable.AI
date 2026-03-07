import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./InfoTip.module.css";

function InfoTip({ label, title, body }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const anchorRef = useRef(null);
  const tipRef = useRef(null);
  const closeTimer = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  const computePosition = () => {
    const anchor = anchorRef.current;
    const tip = tipRef.current;

    if (!anchor || !tip) return;

    const a = anchor.getBoundingClientRect();
    const t = tip.getBoundingClientRect();

    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - a.bottom;
    const spaceAbove = a.top;
    const placeBottom =
      spaceBelow >= t.height + margin || spaceBelow >= spaceAbove;

    let top = placeBottom ? a.bottom + margin : a.top - t.height - margin;
    let left = a.right - t.width;

    left = Math.max(margin, Math.min(left, vw - t.width - margin));
    top = Math.max(margin, Math.min(top, vh - t.height - margin));

    setPos({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
  }, [open, title, body]);

  useEffect(() => {
    if (!open) return;

    const onScroll = () => computePosition();
    const onResize = () => computePosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (e) => {
      const anchor = anchorRef.current;
      const tip = tipRef.current;

      if (!anchor || !tip) return;
      if (anchor.contains(e.target) || tip.contains(e.target)) return;

      setOpen(false);
    };

    document.addEventListener("click", onDocClick);

    return () => {
      document.removeEventListener("click", onDocClick);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <span
      ref={anchorRef}
      className={styles.anchor}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-label={label}
        className={styles.trigger}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        i
      </button>

      {open &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            className={styles.tooltip}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
            }}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            onMouseDownCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {title && <div className={styles.title}>{title}</div>}
            {body && <div className={styles.body}>{body}</div>}
          </div>,
          document.body
        )}
    </span>
  );
}

export default InfoTip;