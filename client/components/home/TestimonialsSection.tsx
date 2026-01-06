"use client"

import { FaStar } from "react-icons/fa"
import "swiper/css"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Worker",
    photo: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "I've earned over $500 in my first month! The platform is super easy to use and the tasks are varied and interesting.",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    photo: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "TaskEarn helped me get data entry work done quickly and affordably. The quality of work is excellent!",
  },
  {
    name: "Emma Davis",
    role: "College Student",
    photo: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "Perfect for earning extra income between classes. I can work at my own pace and choose tasks I enjoy.",
  },
  {
    name: "David Rodriguez",
    role: "Marketing Manager",
    photo: "https://i.pravatar.cc/150?img=7",
    rating: 5,
    text: "We used TaskEarn for market research surveys. Got 1000+ responses in just 2 days. Incredible!",
  },
  {
    name: "Lisa Anderson",
    role: "Stay-at-Home Mom",
    photo: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    text: "I can work while my kids nap. The flexibility is amazing and I'm earning real money from home!",
  },
  {
    name: "James Wilson",
    role: "Software Developer",
    photo: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "Great platform for outsourcing repetitive tasks. Saves me hours of work every week!",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            💬 What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied workers and buyers
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-primary-500"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-lg" />
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
