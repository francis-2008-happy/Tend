import { CalendarDays, Luggage, Moon, PiggyBank } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Plan" };

export default function PlanPage() {
  return (
    <div className="space-y-4 pb-6">
      <PageHeader
        title="Plan"
        description="Plan something, put the phone down, enjoy it together."
      />
      <ComingSoon icon={CalendarDays} title="Dates">
        Ideas for every budget, from free evenings at home to something special.
      </ComingSoon>
      <ComingSoon icon={Moon} title="Overnights">
        A night away, just the two of you, a couple of times a year.
      </ComingSoon>
      <ComingSoon icon={Luggage} title="Getaways">
        Dream about a longer trip and plan it bit by bit.
      </ComingSoon>
      <ComingSoon icon={PiggyBank} title="Escape fund">
        Save towards your next getaway together, in naira.
      </ComingSoon>
    </div>
  );
}
