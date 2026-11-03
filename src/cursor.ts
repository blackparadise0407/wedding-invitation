export function initBlobCursor(): void {
  const desktop = window.matchMedia(
    "(min-width: 601px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );

  function enableCursor(): () => void {
    const cursor = document.createElement("div");
    cursor.className = "blob-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let visible = false;
    let frame = 0;
    let previousTime = 0;

    function animate(time: number): void {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const easing = 1 - Math.exp(-elapsed / 65);
      const dx = targetX - x;
      const dy = targetY - y;
      x += dx * easing;
      y += dy * easing;

      const stretch = Math.min(Math.hypot(dx, dy) / 180, 0.28);
      const angle = Math.atan2(dy, dx);
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.6})`;

      if (Math.hypot(targetX - x, targetY - y) > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
        previousTime = 0;
      }
    }

    function hide(): void {
      visible = false;
      document.documentElement.classList.remove("has-blob-cursor");
      cursor.classList.remove("is-visible", "is-pressed", "is-interactive");
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function move(event: PointerEvent): void {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        visible = true;
      }
      cursor.classList.add("is-visible");
      document.documentElement.classList.add("has-blob-cursor");
      cursor.classList.toggle(
        "is-interactive",
        event.target instanceof Element &&
          !!event.target.closest(
            "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [role='button']",
          ),
      );
      cursor.classList.toggle("is-pressed", event.buttons !== 0);
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function press(event: PointerEvent): void {
      if (event.pointerType === "mouse" && visible) {
        cursor.classList.add("is-pressed");
      } else {
        hide();
      }
    }

    function release(): void {
      cursor.classList.remove("is-pressed");
    }

    function leave(event: PointerEvent): void {
      if (event.relatedTarget === null) hide();
    }

    function visibilityChanged(): void {
      if (document.hidden) hide();
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", visibilityChanged);

    return () => {
      hide();
      cursor.remove();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }

  let cleanup: (() => void) | undefined;

  function syncCursor(): void {
    cleanup?.();
    cleanup = desktop.matches ? enableCursor() : undefined;
  }

  desktop.addEventListener("change", syncCursor);
  syncCursor();
}
