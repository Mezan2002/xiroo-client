import Hero from "@/components/pages/Home/Hero";
import MarqueeBanner from "@/components/pages/Home/MarqueeBanner";
import dynamic from "next/dynamic";

// Dynamic imports for below-the-fold components
const FeaturedCategories = dynamic(
  () => import("@/components/pages/Home/FeaturedCategories"),
);
const FeaturedProduct = dynamic(
  () => import("@/components/pages/Home/FeaturedProduct"),
);
const NewArrival = dynamic(() => import("@/components/pages/Home/NewArrival"));
const StoreFeatures = dynamic(
  () => import("@/components/pages/Home/StoreFeatures"),
);
// const PromoBanner = dynamic(
//   () => import("@/components/pages/Home/PromoBanner"),
// );
// const ProductComparison = dynamic(
//   () => import("@/components/pages/Home/ProductComparison"),
// );

const Home = () => {
  return (
    <main>
      <Hero />
      <MarqueeBanner />
      <FeaturedCategories />
      <FeaturedProduct />
      <NewArrival />
      <StoreFeatures />
      {/* <PromoBanner /> */}
      {/* <ProductComparison /> */}
    </main>
  );
};

export default Home;
