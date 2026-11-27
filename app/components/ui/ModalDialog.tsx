import { useCallback, useEffect, useRef, type ReactNode } from "react";

let supportsDisplayTransitionCache: boolean | undefined;

const canTransitionDisplay = (): boolean => {
  if (supportsDisplayTransitionCache !== undefined) return supportsDisplayTransitionCache;
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  void getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransitionCache = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransitionCache;
};

const supportsTopLayerExit = (): boolean => {
  return Boolean(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
};

type ModalDialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  ariaLabel?: string;
  variant?: "sheet" | "lightbox";
  children: ReactNode;
};

export const ModalDialog = ({
  open,
  onClose,
  labelledBy,
  ariaLabel,
  variant = "sheet",
  children,
}: ModalDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closingRef = useRef(false);

  const performClose = useCallback(async () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || closingRef.current) {
      onClose();
      return;
    }

    closingRef.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced && !supportsTopLayerExit()) {
      dialog.setAttribute("data-closing", "");
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 350)),
        ]);
      }
      dialog.removeAttribute("data-closing");
    }

    if (dialog.open) {
      dialog.close();
    }
    dialog.returnValue = "";
    closingRef.current = false;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      closingRef.current = false;
      dialog.removeAttribute("data-closing");
      dialog.showModal();
    } else if (!open && dialog.open && !closingRef.current) {
      void performClose();
    }
  }, [open, performClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      void performClose();
    };

    const onNativeClose = () => {
      dialog.returnValue = "";
      closingRef.current = false;
      onClose();
    };

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onNativeClose);

    // Fallback for browsers without <dialog closedby="any"> support (e.g. Safari)
    let cleanupBackdropClick: (() => void) | undefined;
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const onClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInside) {
          void performClose();
        }
      };
      dialog.addEventListener("click", onClick);
      cleanupBackdropClick = () => dialog.removeEventListener("click", onClick);
    }

    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onNativeClose);
      cleanupBackdropClick?.();
    };
  }, [onClose, performClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className={`pf-dialog ${
        variant === "lightbox" ? "pf-lightbox pf-lightbox-box" : "pf-modal-box"
      }`}
    >
      {children}
    </dialog>
  );
};
