"use client"

import BestWorkersSection from "@/components/home/BestWorkersSection"
import HeroSlider from "@/components/home/HeroSlider"
import { useAuth } from "@/contexts/AuthContext"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaQuestionCircle,
  FaShieldAlt,
  FaStar,
  FaTasks,
  FaUsers,
} from "react-icons/fa"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Counter component for animated numbers
function Counter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted =
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.floor(latest).toLocaleString()
        ref.current.textContent = `${formatted}${suffix}`
      }
    })
  }, [springValue, suffix, decimals])

  return <div ref={ref} className="inline-block" />
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Show loading skeleton while auth is loading or page is loading
  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar Skeleton */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            <div className="flex gap-4 justify-center mt-8">
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-6 space-y-4"
              >
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  const features = [
    {
      icon: FaTasks,
      title: "Easy Task Management",
      desc: "Create and manage micro-tasks effortlessly",
    },
    {
      icon: FaDollarSign,
      title: "Earn Money",
      desc: "Complete tasks and earn coins convertible to cash",
    },
    {
      icon: FaUsers,
      title: "Global Community",
      desc: "Connect with workers and buyers worldwide",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      desc: "Safe and encrypted payment processing",
    },
    {
      icon: FaClock,
      title: "Quick Turnaround",
      desc: "Get your tasks completed within hours",
    },
    {
      icon: FaCheckCircle,
      title: "Quality Assured",
      desc: "Review and approve work before payment",
    },
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      desc: "Create your account as a Worker or Buyer in seconds",
      color: "from-blue-500 to-blue-600",
    },
    {
      step: "2",
      title: "Browse/Create",
      desc: "Workers browse tasks, Buyers create and post them",
      color: "from-purple-500 to-purple-600",
    },
    {
      step: "3",
      title: "Complete/Review",
      desc: "Submit work and get approved by buyers",
      color: "from-amber-500 to-amber-600",
    },
    {
      step: "4",
      title: "Earn/Pay",
      desc: "Receive coins or pay for completed work",
      color: "from-green-500 to-green-600",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Worker",
      rating: 5,
      text: "I've earned over $500 in my first month! The platform is super easy to use.",
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      rating: 5,
      text: "TaskEarn helped me get data entry work done quickly and affordably. Highly recommend!",
    },
    {
      name: "Emma Davis",
      role: "Student Worker",
      rating: 5,
      text: "Perfect for making extra income between classes. Love the flexibility!",
    },
  ]

  const faqs = [
    {
      q: "How do I get started?",
      a: "Simply register as a Worker or Buyer, complete your profile, and start browsing or posting tasks!",
    },
    {
      q: "How do payments work?",
      a: "We use a coin-based system. Buyers purchase coins, workers earn them, and can withdraw to real money.",
    },
    {
      q: "Is there a minimum withdrawal?",
      a: "Yes, workers can request withdrawal once they have accumulated sufficient coins in their account.",
    },
    {
      q: "What types of tasks are allowed?",
      a: "Data entry, surveys, content writing, image tagging, and other micro-tasks that can be completed online.",
    },
  ]

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      title: "Global Community",
      desc: "Connect with talent worldwide",
    },
    {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      title: "Flexible Work",
      desc: "Work on your schedule",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      title: "Track Progress",
      desc: "Monitor all your tasks",
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      title: "Quality Work",
      desc: "Review before approval",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
      title: "Earn Money",
      desc: "Get paid for your work",
    },
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      title: "Grow Together",
      desc: "Build your network",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Best Workers Section */}
      <BestWorkersSection />

      {/* Platform Showcase Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              See TaskEarn in Action
            </h2>
            <p className="text-xl text-gray-600">
              Discover how our platform connects workers and buyers worldwide
            </p>
          </div>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="max-w-7xl mx-auto pb-12"
          >
            {galleryImages.map((image, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-80 rounded-xl overflow-hidden shadow-xl group">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                      <p className="text-gray-200">{image.desc}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                <Counter value={10000} suffix="+" />
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                <Counter value={50000} suffix="+" />
              </div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                $<Counter value={100} suffix="K+" />
              </div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                <Counter value={4.9} decimals={1} suffix="/5" />
              </div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose TaskEarn?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to earn or hire in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-primary text-white w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative h-full">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center h-full flex flex-col">
                  <div
                    className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">{item.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Workers */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Workers
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  "Browse thousands of available tasks",
                  "Work on your own schedule",
                  "Get paid quickly and securely",
                  "No experience required to start",
                  "Withdraw earnings anytime",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-300 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start as Worker
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl font-bold mb-2">Get 10 Coins Free!</div>
              <div className="text-xl">Just for signing up as a worker</div>
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl font-bold mb-2">Get 50 Coins Free!</div>
              <div className="text-xl">Start posting tasks immediately</div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                For Buyers
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  "Post unlimited micro-tasks",
                  "Access skilled workers globally",
                  "Pay only for approved work",
                  "Track task progress in real-time",
                  "Scale your workforce instantly",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-300 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start as Buyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <FaQuestionCircle className="text-primary-600 text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join TaskEarn today and start earning or hiring in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
