import FeaturedCategories from "@/components/pages/Home/FeaturedCategories";
import FeaturedProduct from "@/components/pages/Home/FeaturedProduct";
import Hero from "@/components/pages/Home/Hero";
import MarqueeBanner from "@/components/pages/Home/MarqueeBanner";
import NewArrival from "@/components/pages/Home/NewArrival";
import ProductComparison from "@/components/pages/Home/ProductComparison";
import PromoBanner from "@/components/pages/Home/PromoBanner";

const Home = () => {
  return (
    <main>
      <Hero />
      <MarqueeBanner />
      <FeaturedCategories />
      <FeaturedProduct />
      <NewArrival />
      <PromoBanner />
      <ProductComparison />
    </main>
  );
};

export default Home;
