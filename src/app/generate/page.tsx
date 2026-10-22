import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getLibrary } from "@/lib/guides";
import { GenerateClient } from "./GenerateClient";


export default async function GeneratePage({ searchParams }: { searchParams: Promise<{ app?: string }> }) {
  const { app = "" } = await searchParams;
  const term = app.trim();
  // If we already have a verified guide for this app, send the developer there.
  const hit = getLibrary().find((i) => i.hasGuide && (i.name.toLowerCase() === term.toLowerCase() || i.slug === term.toLowerCase()));
  if (hit) redirect(`/guide/${hit.slug}`);
  return (
    <Suspense>
      <GenerateClient app={term} />
    </Suspense>
  );
}
