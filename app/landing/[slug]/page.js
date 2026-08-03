import axiosInstance from "@/lib/axios";
import LandingPageRenderer from "@/components/pages/LandingPageRenderer";
import { notFound } from "next/navigation";

async function getLandingPage(slug) {
  try {
    const response = await axiosInstance.get(`/landing-pages/slug/${slug}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const page = await getLandingPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.seo?.title || `${page.title} | XIROO`,
    description: page.seo?.description || "",
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || "",
      images: page.seo?.ogImage ? [page.seo.ogImage] : [],
    },
  };
}

export default async function PublicLandingPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const page = await getLandingPage(slug);

  if (!page) {
    notFound();
  }

  return <LandingPageRenderer page={page} />;
}
