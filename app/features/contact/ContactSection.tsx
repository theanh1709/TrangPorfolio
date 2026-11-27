import { useRef, useState } from "react";
import { buttonVariants } from "~/components/ui/Primitives";
import { useToast } from "~/components/ui/ToastProvider";
import { SITE_CONTENT } from "~/content/site";

const legacyCopy = (text: string): boolean => {
  const prevFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;inset-block-start:0;opacity:0";
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand("copy");
  } finally {
    field.remove();
    prevFocus?.focus({ preventScroll: true });
  }
};

type CopyContactButtonProps = {
  value: string;
  ariaLabel: string;
  intent: "dark" | "ghost";
};

const CopyContactButton = ({ value, ariaLabel, intent }: CopyContactButtonProps) => {
  const { announce } = useToast();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      ok = legacyCopy(value);
    }

    setStatus(ok ? "copied" : "failed");
    announce(ok ? `Đã sao chép ${value}` : "Không sao chép được");

    timerRef.current = setTimeout(() => {
      setStatus("idle");
    }, 1800);
  };

  return (
    <button
      type="button"
      className={`${buttonVariants({ intent })} copy-btn`}
      aria-label={ariaLabel}
      data-copied={status === "copied" ? "" : undefined}
      data-failed={status === "failed" ? "" : undefined}
      onClick={() => void handleCopy()}
    >
      {status === "copied" ? "Đã sao chép" : "Sao chép"}
    </button>
  );
};

export const ContactSection = () => {
  const sec = SITE_CONTENT.sections.contact;

  return (
    <section
      className="band band-beige"
      id="lien-he"
      aria-labelledby="heading-lien-he"
    >
      <div className="wrap">
        <div className="contact-card glass rv">
          <div>
            <h2 id="heading-lien-he">{sec.title}</h2>
            <p className="lead">{sec.lead}</p>
          </div>

          <div className="contact-ways">
            <div className="contact-way">
              <div>
                <small>Email</small>
                <b>{sec.email}</b>
              </div>
              <CopyContactButton
                value={sec.email}
                ariaLabel={`Sao chép email ${sec.email}`}
                intent="dark"
              />
            </div>

            <div className="contact-way">
              <div>
                <small>Điện thoại</small>
                <b>{sec.phoneDisplay}</b>
              </div>
              <CopyContactButton
                value={sec.phoneCopy}
                ariaLabel={`Sao chép số điện thoại ${sec.phoneDisplay}`}
                intent="ghost"
              />
            </div>

            <div className="contact-way">
              <div>
                <small>Địa điểm</small>
                <b>{sec.location}</b>
              </div>
            </div>

            <a
              className="contact-way"
              href={sec.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <small>Portfolio bài viết và thiết kế</small>
                <b>{sec.portfolioDisplay}</b>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
