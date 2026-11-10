import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * "Download my data" (F8). The database builds the file as the signed-in
 * person, so it can only ever contain their own data.
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/login", request.url));

  const { data, error } = await supabase.rpc("export_my_data");
  if (error || !data)
    return new NextResponse("Something went wrong. Please try again.", {
      status: 500,
    });

  const day = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="tend-my-data-${day}.json"`,
      "Cache-Control": "no-store, private",
    },
  });
}
