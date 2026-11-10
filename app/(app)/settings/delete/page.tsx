import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TendCard } from "@/components/tend-card";
import { DeleteForm } from "./delete-form";

export const metadata: Metadata = { title: "Delete my account" };

/** F8: explain first, then delete straight away. */
export default function DeletePage() {
  return (
    <div className="space-y-5 pt-6 pb-6">
      <Link
        href="/settings/privacy"
        className="inline-flex min-h-11 items-center gap-2 font-medium text-muted-foreground"
      >
        <ArrowLeft className="size-5" aria-hidden="true" /> Your privacy
      </Link>
      <h1 className="text-4xl leading-tight">Deleting your account</h1>
      <p className="text-lg text-muted-foreground">
        Here&apos;s exactly what happens, so there are no surprises.
      </p>
      <TendCard tone="plan" className="flex items-start gap-4">
        <Trash2 className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>Everything of yours is removed straight away:</strong> your
          account, your About me answers, your private entries and your
          settings.
        </p>
      </TendCard>
      <TendCard tone="tender" className="flex items-start gap-4">
        <Share2 className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>Shared things stay with your partner</strong>, just like
          leaving your couple space. They won&apos;t see anything of yours that
          was private.
        </p>
      </TendCard>
      <TendCard tone="gold" className="flex items-start gap-4">
        <Download className="mt-1 size-6 shrink-0" aria-hidden="true" />
        <p>
          <strong>It can&apos;t be undone.</strong> If you&apos;d like a copy
          first,{" "}
          <Link
            href="/settings/privacy"
            className="font-medium underline underline-offset-4"
          >
            download your data
          </Link>
          .
        </p>
      </TendCard>
      <DeleteForm />
    </div>
  );
}
