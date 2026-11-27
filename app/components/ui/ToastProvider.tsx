import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastContextValue = {
  announce: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
  announce: () => undefined,
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMessageRef = useRef("");

  const announce = useCallback((nextMsg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let output = nextMsg;
    // Append NBSP when identical so VoiceOver announces repeated copies
    if (output === lastMessageRef.current) {
      output = `${nextMsg}\u00A0`;
    }
    lastMessageRef.current = output;
    setMessage(output);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setMessage(""), 320);
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ announce }}>
      {children}
      <div
        id="pf-toast"
        role="status"
        aria-live="polite"
        className={`glass${visible ? " is-on" : ""}`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
};
