import Hero from "@/components/pages/Home/Hero";
import MarqueeBanner from "@/components/pages/Home/MarqueeBanner";
import FadeIn from "@/components/ui/FadeIn";
import dynamic from "next/dynamic";

// Dynamic imports for below-the-fold components
const FeaturedCategories = dynamic(
  () => import("@/components/pages/Home/FeaturedCategories"),
);
const FeaturedProduct = dynamic(
  () => import("@/components/pages/Home/FeaturedProduct"),
);
const NewArrival = dynamic(() => import("@/components/pages/Home/NewArrival"));
const BestSelling = dynamic(() => import("@/components/pages/Home/BestSelling"));
const BundlesCollection = dynamic(() => import("@/components/pages/Home/BundlesCollection"));
const BundleCTA = dynamic(() => import("@/components/pages/Home/BundleCTA"));
const StoreFeatures = dynamic(
  () => import("@/components/pages/Home/StoreFeatures"),
);
const OurStory = dynamic(
  () => import("@/components/pages/Home/OurStory"),
);
const Testimonials = dynamic(
  () => import("@/components/pages/Home/Testimonials"),
);
const SocialFeed = dynamic(
  () => import("@/components/pages/Home/sections/SocialFeed"),
);
const QuickLinks = dynamic(
  () => import("@/components/pages/Home/QuickLinks"),
);

const Home = () => {
  return (
    <main>
      <Hero />
      <MarqueeBanner />
      <FadeIn>
        <FeaturedCategories />
      </FadeIn>
      <FadeIn>
        <FeaturedProduct />
      </FadeIn>
      <FadeIn>
        <NewArrival />
      </FadeIn>
      <FadeIn>
        <BestSelling />
      </FadeIn>
      <FadeIn>
        <BundlesCollection />
      </FadeIn>
      <BundleCTA />
      <FadeIn>
        <OurStory />
      </FadeIn>
      <FadeIn>
        <StoreFeatures />
      </FadeIn>
      <FadeIn>
        <Testimonials />
      </FadeIn>
      <FadeIn>
        <SocialFeed />
      </FadeIn>
      <FadeIn>
        <QuickLinks />
      </FadeIn>
    </main>
  );
};

export default Home;
