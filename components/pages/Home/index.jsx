import Hero from "@/components/pages/Home/Hero";
import MarqueeBanner from "@/components/pages/Home/MarqueeBanner";
import FeaturedCategories from "@/components/pages/Home/FeaturedCategories";
import FeaturedProduct from "@/components/pages/Home/FeaturedProduct";
import NewArrival from "@/components/pages/Home/NewArrival";
import PromoBanner from "@/components/pages/Home/PromoBanner";
import ProductComparison from "@/components/pages/Home/ProductComparison";

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
