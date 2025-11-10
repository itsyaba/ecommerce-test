import HeroSection from "@/components/hero";
import AboutUsSection from "@/components/about-us";
import WhyChooseUs from "@/components/why-choose-us";
import { ProductsSection } from "@/components/products-section";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <AboutUsSection />
      <WhyChooseUs />
      <ProductsSection />
    </>
  );
}
