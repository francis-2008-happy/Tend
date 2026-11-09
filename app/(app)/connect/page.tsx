import {
  HandHelping,
  MessagesSquare,
  Mail,
  MessageCircle,
  Sun,
} from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Connect" };

export default function ConnectPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader
        title="Connect"
        icon={MessagesSquare}
        accent="rose"
        description="Small moments, whenever you feel like it."
      />
      <ComingSoon icon={MessageCircle} accent="rose" title="A question a day">
        You both answer privately, then see each other&apos;s answers together.
      </ComingSoon>
      <ComingSoon icon={Sun} accent="gold" title="Emotional weather">
        A quiet way to share how you&apos;re feeling, only if you want to.
      </ComingSoon>
      <ComingSoon icon={HandHelping} accent="sage" title="Thank you for…">
        Notice the little things, including the invisible ones.
      </ComingSoon>
      <ComingSoon icon={Mail} accent="terracotta" title="Love notes">
        Write one now, or schedule it for later.
      </ComingSoon>
    </div>
  );
}
