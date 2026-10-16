import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminEmail } from "@/lib/auth";

export async function POST(req: Request) {
  const actor = await getAdminEmail();
  if (!actor) return NextResponse.json({ error: "auth" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const imageId = String(form.get("imageId") || "");
  if (!(file instanceof File) || !imageId) return NextResponse.json({ error: "file" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const dest = path.join(process.cwd(), "public", "images", `${imageId}-biryani.jpg`);
  await writeFile(dest, buf);
  return NextResponse.json({ ok: true });
}
