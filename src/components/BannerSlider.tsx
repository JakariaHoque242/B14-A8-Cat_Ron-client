"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, Compass } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export const BannerSlider: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: "Discover Forgotten Classics & Modern Masterpieces",
      highlight: "Read Without Limits",
      text: "Step into BookNook’s curated library. Borrow bestsellers, timeless philosophy, and cutting-edge science with a single click.",
      image: "https://images.unsplash.com/photo-1507842229451-7f01be777a26?auto=format&fit=crop&q=80&w=1600",
      tag: "Featured Collection",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Ignite Your Curiosity with Deep Thinking",
      highlight: "Curated Knowledge",
      text: "From cosmic astrophysics to ancient human origins, delve into books that expand horizons and transform your perspective.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1600",
      tag: "Science & History",
      icon: Compass,
    },
    {
      id: 3,
      title: "Share Your Books & Grow Our Community",
      highlight: "Add, Borrow, Return",
      text: "Pass on books that shaped your life. Contribute new titles, track available copies, and connect with fellow passionate readers.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600",
      tag: "Community Library",
      icon: Sparkles,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden rounded-3xl shadow-xl my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-amber-500 !w-8 !rounded-full",
        }}
        navigation={true}
        loop={true}
        className="w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-3xl"
      >
        {slides.map((slide) => {
          const SlideIcon = slide.icon;
          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className="object-cover object-center"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 sm:px-12 lg:px-16">
                <div className="max-w-2xl space-y-6 text-white">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
                    <SlideIcon className="w-4 h-4 text-amber-400" />
                    <span>{slide.tag}</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
                    {slide.text}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/books"
                      className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base shadow-lg hover:shadow-amber-600/30 hover:scale-105 transition-all duration-200"
                    >
                      <span>Browse Books</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
