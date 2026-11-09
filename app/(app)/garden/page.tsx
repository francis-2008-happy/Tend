import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { TendCard } from "@/components/tend-card";

export const metadata: Metadata = { title: "Garden" };

export default function GardenPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader title="Your garden" description="It only ever grows." />
      <TendCard className="space-y-4 text-center">
        <div className="flex items-end justify-center gap-2" aria-hidden="true">
          <Image src="/garden/flower.svg" alt="" width={72} height={72} />
          <Image src="/garden/tree.svg" alt="" width={120} height={120} />
          <Image
            src="/garden/butterfly.svg"
            alt=""
            width={56}
            height={56}
            className="mb-16"
          />
        </div>
        <p className="text-muted-foreground">
          Conversations grow flowers, memories grow trees, and kind words bring
          butterflies. Your garden starts once your partner joins.
        </p>
      </TendCard>
    </div>
  );
}
