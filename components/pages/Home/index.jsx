import Hero from "@/components/pages/Home/Hero";
import FeaturedCategories from "@/components/pages/Home/FeaturedCategories";
import FeaturedProduct from "@/components/pages/Home/FeaturedProduct";
import NewArrival from "@/components/pages/Home/NewArrival";
import PromoBanner from "@/components/pages/Home/PromoBanner";
import ProductComparison from "@/components/pages/Home/ProductComparison";

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <FeaturedProduct />
      <NewArrival />
      <PromoBanner />
      <ProductComparison />
    </main>
  );
};

export default Home;
