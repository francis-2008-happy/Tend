"use client";

import { ArrowLeft, Check, Plus, Share, SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ACCENTS } from "@/components/accents";
import { LivePhoto } from "@/components/live-photo";
import { Button } from "@/components/ui/button";
import type { AboutMe } from "@/lib/about-me";
import {
  type Field,
  QUESTIONS,
  type Question,
  labelsFor,
} from "@/lib/about-me/options";
import { isInstalled, isIos } from "@/lib/device";
import { cn } from "@/lib/utils";
import {
  aboutMeLater,
  saveAnswer,
  saveSharing,
} from "@/app/(app)/about-me/actions";

type Answers = AboutMe["answers"];
type Step = "intro" | Field | "iphone" | "finish";

const EMPTY: Answers = {
  love_languages: [],
  budget_band: null,
  free_time: [],
  kids: null,
  interests: [],
  surprise_style: null,
};

const asList = (v: string[] | string | null) =>
  v == null ? [] : Array.isArray(v) ? v : [v];

export function AboutMeFlow({
  initial,
  partnerName,
  start = "intro",
}: {
  initial: AboutMe | null;
  partnerName: string | null;
  start?: "intro" | "finish";
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initial?.answers ?? EMPTY);
  const [shared, setShared] = useState<Field[]>(initial?.shared ?? []);
  const [step, setStep] = useState<Step>(start);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [showIphone, setShowIphone] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    // Device facts are only known in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowIphone(
      isIos(nav.userAgent, nav.maxTouchPoints) &&
        !isInstalled(
          window.matchMedia("(display-mode: standalone)").matches,
          nav.standalone,
        ),
    );
  }, []);

  const order: Step[] = [
    "intro",
    ...QUESTIONS.map((q) => q.field),
    ...(showIphone ? (["iphone"] as const) : []),
    "finish",
  ];
  const go = (dir: 1 | -1) => {
    setError(undefined);
    const next = order[order.indexOf(step) + dir];
    if (next) setStep(next);
    window.scrollTo({ top: 0 });
  };

  const question = QUESTIONS.find((q) => q.field === step);

  if (step === "intro") {
    return (
      <Screen
        photo="/photos/cooking.webp"
        clip="/clips/cooking.mp4"
        alt="A couple cooking jollof rice together and laughing"
      >
        <p className="font-semibold tracking-wide text-terracotta-deep uppercase">
          About me
        </p>
        <h1 className="text-4xl leading-tight">Let&apos;s get to know you</h1>
        <p className="text-lg text-muted-foreground">
          A few easy questions about you, just for you. They help Tend suggest
          dates that fit your life. Your partner sees nothing unless you choose
          to share it.
        </p>
        <div className="grid gap-3 pt-2">
          <Button size="lg" onClick={() => go(1)}>
            Let&apos;s begin
          </Button>
          <form action={aboutMeLater} className="grid">
            <Button type="submit" size="lg" variant="outline">
              I&apos;ll do this later
            </Button>
          </form>
        </div>
      </Screen>
    );
  }

  if (question) {
    const chosen = asList(answers[question.field]);
    const toggle = (value: string) => {
      setError(undefined);
      const next =
        question.kind === "one"
          ? chosen[0] === value
            ? []
            : [value]
          : chosen.includes(value)
            ? chosen.filter((v) => v !== value)
            : [...chosen, value].slice(-(question.max ?? 99));
      setAnswers({
        ...answers,
        [question.field]: question.kind === "one" ? (next[0] ?? null) : next,
      });
    };
    const next = () =>
      startTransition(async () => {
        const result = await saveAnswer(question.field, chosen);
        if (result.ok) go(1);
        else setError(result.error);
      });
    return (
      <Screen photo={question.photo} alt={question.photoAlt}>
        <Dots order={order} step={step} onBack={() => go(-1)} />
        <h1 className="text-3xl leading-tight">{question.title}</h1>
        <p className="text-lg text-muted-foreground">{question.hint}</p>
        <Choices question={question} chosen={chosen} onToggle={toggle} />
        {error ? (
          <p role="alert" className="rounded-xl bg-terracotta-soft px-4 py-3">
            {error}
          </p>
        ) : null}
        <div className="grid gap-3 pt-2">
          <Button size="lg" onClick={next} disabled={pending}>
            {pending ? "Saving…" : "Next"}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => go(1)}
            disabled={pending}
          >
            Skip this one
          </Button>
        </div>
      </Screen>
    );
  }

  if (step === "iphone") {
    return (
      <Screen photo="/photos/balcony.webp" alt="A couple laughing on a balcony">
        <Dots order={order} step={step} onBack={() => go(-1)} />
        <h1 className="text-3xl leading-tight">Add Tend to your Home Screen</h1>
        <p className="text-lg text-muted-foreground">
          On iPhone, Tend works best from your Home Screen. It opens like an
          app, and it&apos;s how gentle reminders will reach you later.
        </p>
        <ol className="space-y-3">
          <HowTo n={1} icon={Share}>
            Tap the <strong>Share</strong> button in Safari
          </HowTo>
          <HowTo n={2} icon={SquarePlus}>
            Choose <strong>Add to Home Screen</strong>
          </HowTo>
          <HowTo n={3} icon={Plus}>
            Tap <strong>Add</strong>, then open Tend from your Home Screen
          </HowTo>
        </ol>
        <div className="grid gap-3 pt-2">
          <Button size="lg" onClick={() => go(1)}>
            Done
          </Button>
          <Button size="lg" variant="ghost" onClick={() => go(1)}>
            Maybe later
          </Button>
        </div>
      </Screen>
    );
  }

  // Finish: what you told us, and what (if anything) to show your partner.
  const answered = QUESTIONS.filter((q) => asList(answers[q.field]).length > 0);
  const who = partnerName ?? "my partner";
  const finish = () =>
    startTransition(async () => {
      const result = await saveSharing(
        shared.filter((f) => answered.some((q) => q.field === f)),
      );
      if (result.ok) router.push("/home");
      else setError(result.error);
    });

  return (
    <Screen
      photo="/photos/walk.webp"
      clip="/clips/walk.mp4"
      alt="A couple walking hand in hand along a garden path"
    >
      <p className="font-semibold tracking-wide text-terracotta-deep uppercase">
        About me
      </p>
      <h1 className="text-4xl leading-tight">What you told us about you</h1>
      {answered.length === 0 ? (
        <p className="text-lg text-muted-foreground">
          You skipped them all, and that&apos;s fine. You can answer any time in
          Settings.
        </p>
      ) : (
        <>
          <p className="text-lg text-muted-foreground">
            This is just for you. Switch on anything you&apos;d like {who} to
            see too.
          </p>
          <ul className="space-y-3">
            {answered.map((q) => {
              const on = shared.includes(q.field);
              return (
                <li
                  key={q.field}
                  className={cn(
                    "rounded-2xl p-4 shadow-soft",
                    q.accent === "rose" && "bg-tender-soft",
                    q.accent === "terracotta" && "bg-terracotta-soft",
                    q.accent === "gold" && "bg-milestone-soft",
                    q.accent === "sage" && "bg-sage-soft",
                  )}
                >
                  <p className="text-sm font-semibold text-muted-foreground">
                    {q.summary}
                  </p>
                  <p className="font-heading text-xl">
                    {labelsFor(q.field, answers[q.field]).join(", ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(q.field)}
                      className="min-h-11 font-medium text-primary underline underline-offset-4"
                    >
                      Change
                    </button>
                    <ShareSwitch
                      label={`Show ${who}`}
                      on={on}
                      onChange={() =>
                        setShared(
                          on
                            ? shared.filter((f) => f !== q.field)
                            : [...shared, q.field],
                        )
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-sm text-muted-foreground">
            {partnerName
              ? `${partnerName} only sees what you switch on.`
              : "Once your partner joins, they only see what you switch on."}{" "}
            You can change this any time in Settings.
          </p>
        </>
      )}
      {error ? (
        <p role="alert" className="rounded-xl bg-terracotta-soft px-4 py-3">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3 pt-2">
        <Button size="lg" onClick={finish} disabled={pending}>
          {pending ? "Saving…" : "Save and finish"}
        </Button>
      </div>
    </Screen>
  );
}

function Screen({
  photo,
  clip,
  alt,
  children,
}: {
  photo: string;
  clip?: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-5 pb-6">
      <div className="relative">
        <LivePhoto
          src={photo}
          clip={clip}
          alt={alt}
          priority
          className="h-[42vh] min-h-64 w-full"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="relative -mt-10 space-y-4 px-5">{children}</div>
    </div>
  );
}

function Dots({
  order,
  step,
  onBack,
}: {
  order: Step[];
  step: Step;
  onBack: () => void;
}) {
  const steps = order.filter((s) => s !== "intro" && s !== "finish");
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex size-11 items-center justify-center rounded-full bg-card shadow-soft"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </button>
      <div className="flex gap-1.5" aria-hidden="true">
        {steps.map((s) => (
          <span
            key={s}
            className={cn(
              "h-2 rounded-full transition-all",
              s === step ? "w-6 bg-primary" : "w-2 bg-primary/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Choices({
  question,
  chosen,
  onToggle,
}: {
  question: Question;
  chosen: string[];
  onToggle: (value: string) => void;
}) {
  const colours = ACCENTS[question.accent];
  return (
    <div
      role="group"
      aria-label={question.title}
      className="flex flex-wrap gap-2.5"
    >
      {question.options.map((o) => {
        const on = chosen.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.value)}
            className={cn(
              "inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 text-base font-medium transition",
              on
                ? cn("border-transparent shadow-soft", colours.chip)
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            {on ? <Check className="size-4" aria-hidden="true" /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function HowTo({
  n,
  icon: Icon,
  children,
}: {
  n: number;
  icon: typeof Share;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="sr-only">Step {n}: </span>
        {children}
      </span>
    </li>
  );
}

export function ShareSwitch({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="inline-flex min-h-11 items-center gap-3 text-sm font-medium"
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "relative h-7 w-12 rounded-full transition",
          on ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-white shadow transition-all",
            on ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
