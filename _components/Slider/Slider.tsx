'use client';
import { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SliderItem = {
  image: string;
  title: string;
  description: string;
  primaryAction: string;
  primaryHref: string;
  secondaryAction: string;
  secondaryHref: string;
};

type SliderProps = {
  spaceBetween: number;
  slidesPerView: number;
  pageList: SliderItem[];
  variant?: 'hero' | 'gallery';
};

export default function Slider({ spaceBetween, slidesPerView, pageList, variant = 'hero' }: SliderProps) {
  const swiperInstance = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (variant === 'gallery') {
    return (
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-[10px] border border-[#e7edf1] bg-white">
          <Swiper
            className="h-[500px] max-[800px]:h-[min(78vw,390px)]"
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            onSwiper={(swiper) => (swiperInstance.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {pageList.map((slide) => (
              <SwiperSlide key={slide.image}>
                <div className="relative h-full">
                  <Image src={slide.image} alt={slide.title} fill sizes="(max-width: 1023px) 100vw, 52vw" className="object-contain p-[22px]" priority={pageList.indexOf(slide) === 0} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button type="button" className="absolute left-3 top-1/2 z-10 grid size-[42px] -translate-y-1/2 place-items-center rounded-full border border-[#e5ebef] bg-white/95 text-slate-600 shadow-sm transition hover:scale-105 hover:bg-[#12a857] hover:text-white hover:shadow-lg" aria-label="Previous product image" onClick={() => swiperInstance.current?.slidePrev()}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="absolute right-3 top-1/2 z-10 grid size-[42px] -translate-y-1/2 place-items-center rounded-full border border-[#e5ebef] bg-white/95 text-slate-600 shadow-sm transition hover:scale-105 hover:bg-[#12a857] hover:text-white hover:shadow-lg" aria-label="Next product image" onClick={() => swiperInstance.current?.slideNext()}>
            <ChevronRight size={20} />
          </button>
        </div>
      <div className="flex flex-wrap gap-2 pt-2" aria-label="Product images">
          {pageList.map((slide, index) => (
            <button type="button" key={slide.image} aria-label={`Show image ${index + 1}`} aria-current={activeIndex === index} className={`relative size-19.5 shrink-0 overflow-hidden rounded-md border bg-white transition hover:-translate-y-0.5 ${activeIndex === index ? 'border-emerald-500' : 'border-slate-200'}`} onClick={() => swiperInstance.current?.slideTo(index)}>
              <Image src={slide.image} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        className="h-[420px] w-full max-sm:h-[400px] [&_.swiper-slide]:overflow-hidden [&_.swiper-pagination-bullet]:!mx-[5px] [&_.swiper-pagination-bullet]:!h-[15px] [&_.swiper-pagination-bullet]:!w-[15px] [&_.swiper-pagination-bullet]:!rounded-full [&_.swiper-pagination-bullet]:!bg-white/60 [&_.swiper-pagination-bullet]:!opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:!w-10 [&_.swiper-pagination-bullet-active]:!rounded-full [&_.swiper-pagination-bullet-active]:!bg-white"
        loop={true}
        modules={[Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (swiperInstance.current = swiper)}
      >
        {pageList.map((slide) => (
          <SwiperSlide key={slide.image}>
            <div className="relative isolate h-full">
              <Image
                className="z-0 object-cover object-center"
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(8,203,79,.96),rgba(70,210,110,.55))]" />
              <div className="relative z-[2] ml-[clamp(32px,8vw,120px)] flex h-full w-[min(560px,calc(100%-120px))] flex-col justify-center text-white max-sm:ml-5 max-sm:w-[calc(100%-40px)]">
                <h2 className="m-0 max-w-[460px] text-[clamp(1.4rem,2.2vw,2.2rem)] leading-[1.08] font-extrabold capitalize">{slide.title}</h2>
                <p className="mt-4 text-[clamp(.9rem,1.1vw,1.12rem)] max-sm:text-base">{slide.description}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={slide.primaryHref} className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] border-2 border-white bg-white px-5 text-sm font-bold text-[#00a94f] no-underline transition duration-200 hover:scale-105 hover:bg-transparent hover:text-white max-sm:min-h-[38px] max-sm:px-[15px] max-sm:text-[13px]">
                    {slide.primaryAction}
                  </Link>
                  <Link href={slide.secondaryHref} className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] border-2 border-white px-5 text-sm font-bold text-white no-underline transition duration-200 hover:scale-105 hover:bg-white hover:text-[#00a94f] max-sm:min-h-[38px] max-sm:px-[15px] max-sm:text-[13px]">
                    {slide.secondaryAction}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        className="absolute left-5 top-1/2 z-[3] grid size-[42px] -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#00b953] transition hover:scale-110 hover:bg-white max-sm:hidden"
        aria-label="Previous slide"
        onClick={() => swiperInstance.current?.slidePrev()}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="absolute right-5 top-1/2 z-[3] grid size-[42px] -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#00b953] transition hover:scale-110 hover:bg-white max-sm:hidden"
        aria-label="Next slide"
        onClick={() => swiperInstance.current?.slideNext()}
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
};
