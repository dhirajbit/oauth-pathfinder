import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, loadGuides } from "@/lib/guides";
import { GuideView } from "@/components/GuideView";

export function generateStaticParams() {
  return Array.from(loadGuides().keys()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  return g ? { title: `${g.name} OAuth setup — OAuth Pathfinder`, description: g.summary } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return <GuideView guide={guide} shareHref={`/guide/${slug}`} />;
}
