import { BookOpen, Compass, Images, Leaf } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Us" };

export default function UsPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader
        title="Us"
        description="Your journey together."
        icon={BookOpen}
        accent="gold"
      />
      <ComingSoon icon={Compass} accent="gold" title="Discover">
        Keep learning about each other, at your own pace.
      </ComingSoon>
      <ComingSoon icon={Leaf} accent="sage" title="Grow">
        Seasons of life, gentle check-ins, and ways to repair after a hard day.
      </ComingSoon>
      <ComingSoon icon={Images} accent="rose" title="Remember">
        Your story so far: memories, milestones and little time capsules.
      </ComingSoon>
    </div>
  );
}
