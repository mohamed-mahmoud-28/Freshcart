
import Slider from "@/_components/Slider/Slider";

export default function SliderHome() {
  return (
    <section className="m-0 w-full" aria-label="Featured products">
      <Slider
        spaceBetween={0}
        slidesPerView={1}
        pageList={[
          {
            image: "/Assets/images/grocery-banner.png",
            title: "Fresh Products Delivered to your Door",
            description: "Get 20% off your first order",
            primaryAction: "Shop Now",
            primaryHref: "/products",
            secondaryAction: "View Deals",
            secondaryHref: "/products",
          },
          {
            image: "/Assets/images/grocery-banner-2.jpeg",
            title: "Everything Fresh, Every Day",
            description: "Quality groceries picked for your table",
            primaryAction: "Explore Products",
            primaryHref: "/products",
            secondaryAction: "See Offers",
            secondaryHref: "/products",
          },
          {
            image: "/Assets/images/slider-2.jpeg",
            title: "Your Weekly Groceries, Simplified",
            description: "Save time with fast and reliable delivery",
            primaryAction: "Start Shopping",
            primaryHref: "/products",
            secondaryAction: "Learn More",
            secondaryHref: "/products",
          },
        ]}
      />
    </section>
  );
}
