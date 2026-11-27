import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TooltipState = {
  title: string;
  body: string;
  x: number;
  y: number;
  visible: boolean;
};

type TooltipContextValue = {
  bindTooltip: (title: string, body: string) => {
    tabIndex: number;
    "data-tip-title": string;
    "data-tip-body": string;
  };
  hideTooltip: () => void;
};

const TooltipContext = createContext<TooltipContextValue>({
  bindTooltip: (title, body) => ({
    tabIndex: 0,
    "data-tip-title": title,
    "data-tip-body": body,
  }),
  hideTooltip: () => undefined,
});

export const useTooltip = () => useContext(TooltipContext);

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const tipRef = useRef<HTMLDivElement | null>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<TooltipState>({
    title: "",
    body: "",
    x: 12,
    y: 12,
    visible: false,
  });

  const hideTooltip = useCallback(() => {
    if (activeElRef.current) {
      activeElRef.current.removeAttribute("aria-describedby");
      activeElRef.current = null;
    }
    setState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, []);

  const positionTooltip = useCallback((el: HTMLElement) => {
    const title = el.getAttribute("data-tip-title") ?? "";
    const body = el.getAttribute("data-tip-body") ?? "";
    if (!title && !body) return;

    if (activeElRef.current && activeElRef.current !== el) {
      activeElRef.current.removeAttribute("aria-describedby");
    }
    activeElRef.current = el;
    el.setAttribute("aria-describedby", "pf-tip");

    setState((prev) => ({
      ...prev,
      title,
      body,
      visible: true,
    }));

    requestAnimationFrame(() => {
      const tipNode = tipRef.current;
      if (!tipNode || !activeElRef.current) return;
      const rect = activeElRef.current.getBoundingClientRect();
      const tw = tipNode.offsetWidth || 260;
      const th = tipNode.offsetHeight || 72;
      let x = rect.left + rect.width / 2 - tw / 2;
      x = Math.max(12, Math.min(x, window.innerWidth - tw - 12));
      let y = rect.top - th - 12;
      if (y < 12) {
        y = rect.bottom + 12;
      }
      setState((prev) => ({ ...prev, x, y }));
    });
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-tip-title]");
      if (el && el !== activeElRef.current) {
        positionTooltip(el);
      } else if (!el && activeElRef.current) {
        hideTooltip();
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-tip-title]");
      if (el) positionTooltip(el);
    };

    const onFocusOut = () => {
      hideTooltip();
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-tip-title]");
      if (!el) {
        hideTooltip();
        return;
      }
      if (!fine) {
        if (el === activeElRef.current) hideTooltip();
        else positionTooltip(el);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeElRef.current) {
        hideTooltip();
      }
    };

    const onScroll = () => {
      if (activeElRef.current) {
        hideTooltip();
      }
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hideTooltip, positionTooltip]);

  const bindTooltip = useCallback((title: string, body: string) => {
    return {
      tabIndex: 0,
      "data-tip-title": title,
      "data-tip-body": body,
    };
  }, []);

  return (
    <TooltipContext.Provider value={{ bindTooltip, hideTooltip }}>
      {children}
      <div
        ref={tipRef}
        id="pf-tip"
        role={state.visible ? "tooltip" : undefined}
        aria-hidden={!state.visible}
        className={`glass${state.visible ? " is-on" : ""}`}
        style={{ left: `${state.x}px`, top: `${state.y}px` }}
      >
        {state.title ? <b>{state.title}</b> : null}
        <span>{state.body}</span>
      </div>
    </TooltipContext.Provider>
  );
};
