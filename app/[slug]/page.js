"use client";

import CollectionMenuPage from "@/components/shared/CollectionMenuPage";
import { useParams } from "next/navigation";

export default function DynamicMenuPage() {
  const params = useParams();
  const slug = params.slug;

  return <CollectionMenuPage slug={slug} title={slug?.replace(/-/g, ' ').toUpperCase()} />;
}
