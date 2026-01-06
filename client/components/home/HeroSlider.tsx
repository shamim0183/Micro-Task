"use client"

import Link from "next/link"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const slides = [
  {
    title: "Earn Money by Completing Simple Tasks",
    subtitle:
      "Join thousands of workers completing micro-tasks and earning real money",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    cta: "Start Working",
    link: "/register",
  },
  {
    title: "Get Your Tasks Done Quickly",
    subtitle:
      "Connect with skilled workers to complete your projects efficiently",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    cta: "Post a Task",
    link: "/register",
  },
  {
    title: "Secure & Transparent Platform",
    subtitle: "Safe payments, quality reviews, and instant withdrawals",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200",
    cta: "Learn More",
    link: "#features",
  },
]

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="h-[500px] md:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.link}
                      className="inline-block px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
