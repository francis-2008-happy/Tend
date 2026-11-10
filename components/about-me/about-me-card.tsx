import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyAboutMe } from "@/lib/about-me";

/**
 * Home: the first visit opens "About me" once. After that, a gentle card
 * offers it until it's finished. No counts, no reminders.
 */
export async function AboutMeCard() {
  const about = await getMyAboutMe();
  if (!about) redirect("/about-me");
  if (about.completed) return null;

  return (
    <Link
      href="/about-me"
      className="animate-bloom block overflow-hidden rounded-2xl bg-card shadow-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative h-36">
        <Image
          src="/photos/cooking.webp"
          alt=""
          fill
          sizes="(min-width: 640px) 28rem, 100vw"
          className="object-cover object-[50%_30%]"
        />
      </div>
      <div className="flex items-center gap-4 p-5">
        <div className="flex-1">
          <h2 className="text-lg">Get to know yourself</h2>
          <p className="text-muted-foreground">
            A few easy questions, just for you, whenever you like.
          </p>
        </div>
        <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
      </div>
    </Link>
  );
}
