import Link from "next/link";
import { Home, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import Slider, { type SliderItem } from "@/_components/Slider/Slider";
import ProductPurchase from "@/_components/Products/ProductPurchase";
import ProductTabs from "@/_components/Products/ProductTabs";
import { getProduct } from "@/API/ProductsAPI/GetAllProducts";
import { getProductReviews } from '@/API/Shop/shopApi'

type ProductPageProps = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([getProduct(id), getProductReviews(id).catch(() => [])])
  product.reviews = reviews
  const galleryItems: SliderItem[] = [product.imageCover, ...product.images]
    .filter((image, index, images) => images.indexOf(image) === index)
    .map((image) => ({
      image,
      title: product.title,
      description: "",
      primaryAction: "",
      primaryHref: "#",
      secondaryAction: "",
      secondaryHref: "#",
    }));
  const rating = Math.max(0, Math.min(5, product.ratingsAverage || 0));

  return (
    <main className="min-h-screen bg-[#fbfcfd] px-3 pt-6 pb-16 sm:px-4">
      <div className="mx-auto w-full max-w-[1280px]">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-400 [&_a:hover]:text-[#0ca653] [&_strong]:font-semibold [&_strong]:text-[#1f3047]">
          <Link href="/" className="inline-flex items-center gap-1.5">
            <Home size={15} /> Home
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`}>
            {product.category.name}
          </Link>
          <span>/</span>
          <strong>{product.title}</strong>
        </nav>
        <div className="grid items-start gap-4 min-[801px]:grid-cols-[0.62fr_1.38fr] min-[801px]:gap-9">
          <div className="min-w-0 min-[801px]:sticky min-[801px]:top-[92px]">
            <Slider
              variant="gallery"
              spaceBetween={0}
              slidesPerView={1}
              pageList={galleryItems}
            />
          </div>
          <section
            className="p-[18px] sm:p-7 lg:p-[42px]"
            aria-labelledby="product-title"
          >
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-[#eafbf2] px-3 py-1.5 text-[#0b9f5a]">{product.category.name}</span>
              {product.brand.name && <span className="rounded-full bg-[#f1f3f5] px-3 py-1.5 text-slate-500">{product.brand.name}</span>}
            </div>
            <h1 className="mt-[18px] mb-2.5 text-[clamp(1.8rem,2.8vw,2.55rem)] leading-[1.15] font-bold text-[#15243a]" id="product-title">{product.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-0.5 tracking-wide text-[#ffc107]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={17}
                    fill={index < Math.round(rating) ? "currentColor" : "none"}
                  />
                ))}
              </span>
              <strong>{rating.toFixed(1)}</strong>
              <span>({product.ratingsQuantity} reviews)</span>
            </div>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong className="text-[clamp(1.65rem,5vw,2.125rem)] font-extrabold text-[#15243a]">
                {(product.priceAfterDiscount ?? product.price).toLocaleString(
                  "en-EG",
                )}{" "}
                EGP
              </strong>
              {product.priceAfterDiscount && (
                <del className="text-base text-slate-400">{product.price.toLocaleString("en-EG")} EGP</del>
              )}
            </div>
            <p className="my-5 whitespace-pre-line border-t border-[#edf1f3] pt-5 text-[15px] leading-[1.9] text-slate-500">{product.description}</p>
            <ProductPurchase
              productId={product._id}
              price={product.price}
              priceAfterDiscount={product.priceAfterDiscount}
              quantityAvailable={product.quantity}
              title={product.title}
            />
            <div className="mt-7 flex flex-wrap justify-between gap-4 border-t border-[#edf1f3] pt-6 max-[480px]:items-start max-[480px]:gap-2">
              {[
                { Icon: Truck, title: "Free Delivery", detail: "On orders over 500 EGP" },
                { Icon: RotateCcw, title: "30 Days Return", detail: "Easy return policy" },
                { Icon: ShieldCheck, title: "Secure Payment", detail: "100% secure checkout" },
              ].map(({ Icon, title, detail }) => (
                <div className="grid grid-cols-[42px_1fr] items-center gap-x-2 text-[11px] text-[#0ca653] min-[481px]:grid-cols-[52px_1fr] min-[481px]:gap-x-2" key={title}>
                  <Icon className="row-span-2 size-[38px] rounded-full bg-[#dcfce9] p-2.5 min-[481px]:size-[50px] min-[481px]:p-[13px]" />
                  <b className="text-[11px] font-semibold text-[#172b40] min-[481px]:text-[15px]">{title}</b>
                  <small className="col-start-2 text-[9px] text-slate-500 min-[481px]:text-xs">{detail}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
        <ProductTabs key={product._id} product={product} />
      </div>
    </main>
  );
}
