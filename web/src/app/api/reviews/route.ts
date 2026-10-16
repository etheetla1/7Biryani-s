import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { biryanis } from "@/content/biryanis";

const Fields = z.object({
  firstName: z.string().min(1).max(40),
  lastName: z.string().max(40).optional(),
  email: z.string().email(),
  biryaniId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(8).max(2000),
  consent: z.literal("on").or(z.literal("true")),
});

export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = Fields.safeParse({
    firstName: form.get("firstName"),
    lastName: form.get("lastName") || undefined,
    email: form.get("email"),
    biryaniId: form.get("biryaniId"),
    rating: form.get("rating"),
    body: form.get("body"),
    consent: form.get("consent") ? "on" : undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Check the form and try again." }, { status: 400 });
  if (!biryanis.some((b) => b.id === parsed.data.biryaniId)) {
    return NextResponse.json({ error: "Unknown biryani" }, { status: 400 });
  }
  let photoUrl: string | null = null;
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const buf = Buffer.from(await photo.arrayBuffer());
    if (buf.length > 4_000_000) return NextResponse.json({ error: "Photo too large" }, { status: 400 });
    const dir = path.join(process.cwd(), "public", "reviews");
    await mkdir(dir, { recursive: true });
    const name = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, "")}`.slice(0, 80);
    await writeFile(path.join(dir, name), buf);
    photoUrl = `/reviews/${name}`;
  }
  await prisma.review.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName || null,
      email: parsed.data.email,
      biryaniId: parsed.data.biryaniId,
      rating: parsed.data.rating,
      body: parsed.data.body,
      photoUrl,
      consentToPublish: true,
      status: "pending",
    },
  });
  return NextResponse.json({ ok: true });
}
