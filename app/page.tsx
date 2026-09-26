
import dynamic from "next/dynamic";

import SliderHome from "@/_components/Home/SliderComp/SliderHome";
import Features from "@/_components/Home/Features/Features";
import Categories from "@/_components/Home/Categories/Categories";
import Offers from "@/_components/Home/Offers/Offers";
import Newsletter from "@/_components/Home/Newsletter/Newsletter";
import AOSInit from "@/_components/motion/AOSInit";

const Products = dynamic(() => import("@/_components/Home/Products/Products"), {
  loading: () => <ProductsSkeleton />,
});

function ProductsSkeleton() {
  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10" aria-label="Loading featured products">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-[#e8efeb]" />
        <div className="grid grid-cols-2 justify-items-center gap-3 min-[480px]:gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-[380px] w-full max-w-[275px] animate-pulse rounded-[10px] border border-[#e5e9ee] bg-[#f8faf9] sm:h-[420px] lg:h-[465px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <AOSInit />
      <div data-aos="fade-down" data-aos-duration="900">
        <SliderHome />
      </div>

        <section data-aos="fade-up" data-aos-delay="100" className="py-6 bg-[#f5f5f5]">
          <Features />
        </section>

        <section data-aos="fade-up" data-aos-delay="150" className="py-6 ">
          <Categories />
        </section>


        <section data-aos="zoom-in" data-aos-delay="150" className="py-6">
          <Offers />
        </section>

        <div data-aos="fade-up" data-aos-delay="180">
          <Products />
        </div>

        <div data-aos="zoom-in-up" data-aos-delay="180">
          <Newsletter />
        </div>

      </div>
  );
}
