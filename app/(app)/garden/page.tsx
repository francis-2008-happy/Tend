import { Sprout } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { GardenStrip } from "@/components/garden-strip";
import { PageHeader } from "@/components/page-header";
import { type CardTone, TendCard } from "@/components/tend-card";

export const metadata: Metadata = { title: "Garden" };

const GROWS: { art: string; title: string; text: string; tone: CardTone }[] = [
  {
    art: "/garden/flower.svg",
    title: "Flowers",
    text: "from your conversations",
    tone: "tender",
  },
  {
    art: "/garden/tree.svg",
    title: "Trees",
    text: "from memories you keep",
    tone: "sage",
  },
  {
    art: "/garden/butterfly.svg",
    title: "Butterflies",
    text: "from kind words",
    tone: "gold",
  },
];

export default function GardenPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader
        title="Your garden"
        description="It only ever grows."
        icon={Sprout}
        accent="sage"
      />
      <TendCard tone="sage" className="animate-bloom p-0">
        <GardenStrip className="h-44" priority />
      </TendCard>
      <ul className="grid grid-cols-3 gap-3">
        {GROWS.map(({ art, title, text, tone }, i) => (
          <li key={title}>
            <TendCard
              tone={tone}
              className="animate-bloom flex h-full flex-col items-center gap-2 p-3 text-center"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <Image src={art} alt="" width={48} height={48} />
              <h2 className="text-base">{title}</h2>
              <p className="text-sm leading-snug text-muted-foreground">
                {text}
              </p>
            </TendCard>
          </li>
        ))}
      </ul>
      <p className="px-1 text-center text-muted-foreground">
        Your garden starts growing once your partner joins.
      </p>
    </div>
  );
}
