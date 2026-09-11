"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { contact, contactSection as c } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/fx/magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * No backend yet: the form composes an email with everything filled in and
 * hands it to the visitor's mail app. WhatsApp sits beside it for the people
 * who would rather just message.
 */
export function Contact() {
  const reduce = useReducedMotion();
  const [need, setNeed] = useState<string | null>(null);
  const [timing, setTiming] = useState<string>(c.timing[0]);
  const [name, setName] = useState("");
  const [reach, setReach] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!need) return setError(c.errors.need);
    if (!name.trim() || !reach.trim()) return setError(c.errors.reach);
    setError(null);
    const chosen = c.needs.find((n) => n.id === need)!;
    const body = [
      `Name: ${name.trim()}`,
      `Reach me at: ${reach.trim()}`,
      `Need: ${chosen.label}`,
      `When: ${timing}`,
      message.trim() ? `\n${message.trim()}` : "",
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(chosen.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="relative bg-ink px-pad py-24 md:py-36">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div
          className="lg:col-span-5"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <h2 className="font-display t-h2 max-w-[12ch] text-balance text-bone">{c.heading}</h2>
          <p className="t-lead mt-6 max-w-[34ch] text-bone-2">{c.lead}</p>

          <div className="mt-10">
            <p className="t-mono mb-3 text-bone-3">{c.whatsapp}</p>
            <div className="flex flex-wrap gap-3">
              {contact.phones.map((p) => (
                <a
                  key={p.wa}
                  href={`https://wa.me/${p.wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <span>{p.name.split(" ")[0]}</span>
                  <span className="btn-ico">
                    <WhatsappLogo size={16} weight="bold" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="mt-10 inline-block font-display text-[clamp(1.1rem,1.8vw,1.6rem)] text-bone underline decoration-accent decoration-1 underline-offset-8 transition-colors hover:text-accent"
          >
            {contact.email}
          </a>
        </motion.div>

        <motion.form
          onSubmit={submit}
          noValidate
          className="bezel lg:col-span-7"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          <div className="core flex flex-col gap-8 p-6 md:p-9">
            <fieldset>
              <legend className="t-mono mb-3 text-bone-3">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {c.needs.map((n) => (
                  <Pill key={n.id} name="need" value={n.id} checked={need === n.id} onChange={() => setNeed(n.id)}>
                    {n.label}
                  </Pill>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="t-mono mb-3 text-bone-3">When?</legend>
              <div className="flex flex-wrap gap-2">
                {c.timing.map((t) => (
                  <Pill key={t} name="timing" value={t} checked={timing === t} onChange={() => setTiming(t)}>
                    {t}
                  </Pill>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label={c.fields.name} value={name} onChange={setName} autoComplete="name" />
              <Field id="reach" label={c.fields.reach} value={reach} onChange={setReach} autoComplete="email" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="t-small text-bone-2">
                {c.fields.message}{" "}
                <span className="text-bone-3">({c.fields.optional})</span>
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-2xl bg-bone/5 px-4 py-3 text-bone shadow-[inset_0_0_0_1px_rgb(243_239_231/0.1)] transition-shadow focus:shadow-[inset_0_0_0_1px_var(--accent)] focus:outline-none"
              />
            </div>

            {error ? (
              <p role="alert" className="t-small -mt-3 text-accent">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <Button type="submit" variant="primary">
                  {c.send}
                </Button>
              </Magnetic>
              <p className="t-small text-bone-3">{c.sendNote}</p>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Pill({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "cursor-pointer rounded-full px-4 py-2 text-[0.9rem] font-medium transition-[background-color,color,box-shadow] duration-300",
        checked
          ? "bg-accent text-ink"
          : "bg-bone/5 text-bone-2 shadow-[inset_0_0_0_1px_rgb(243_239_231/0.1)] hover:text-bone",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-small text-bone-2">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full bg-bone/5 px-4 py-3 text-bone shadow-[inset_0_0_0_1px_rgb(243_239_231/0.1)] transition-shadow focus:shadow-[inset_0_0_0_1px_var(--accent)] focus:outline-none"
      />
    </div>
  );
}
