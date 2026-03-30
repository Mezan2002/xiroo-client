import CategoryView from "@/components/pages/Category/CategoryView";

export default async function DynamicCategoryPage({ params }) {
  // Await the params Promise required in Next.js 15+ App Router
  const resolvedParams = await params;
  const category = resolvedParams?.category || "all";
  
  return <CategoryView category={category} />;
}
