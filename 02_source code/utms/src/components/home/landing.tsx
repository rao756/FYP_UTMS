'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { Bus, Clock, LogOut, User, Shield, MapPin, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

const Landing = () => {
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const router = useRouter();

  return (
    <>
      <main
        style={{
          backgroundImage: "url('hero.png')",
        }}
        className="bg-cover bg-center bg-no-repeat"
      >
        <section className="min-h-screen bg-black/40">
          {/* header */}
          <nav className="sticky top-0 z-50 px-1 py-2 md:py-4 backdrop-blur-sm">
            <div className="mx-auto h-20 max-w-7xl rounded-3xl bg-white/80 px-4 sm:px-6 md:rounded-full lg:px-8 shadow-lg">
              <div className="flex h-full items-center justify-between">
                <div className="flex-shrink-0 flex items-center">
                  <Image
                    src="/uon.png"
                    alt="University logo"
                    width={40}
                    height={40}
                    className="mr-2"
                  />
                  <Link href="/" className="text-2xl font-bold text-primary">
                    UTMS
                  </Link>
                </div>

                <div className="hidden space-x-2 sm:space-x-4 md:flex">
                  <Link
                    href="/"
                    className={`rounded-md py-2 text-xs font-medium text-gray-700 hover:text-primary sm:px-3 sm:text-sm ${pathname === '/' ? 'text-primary' : ''}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="#features"
                    className={`rounded-md py-2 text-xs font-medium text-gray-700 hover:text-primary sm:px-3 sm:text-sm ${pathname === '/features' ? 'text-primary' : ''}`}
                  >
                    Features
                  </Link>
                  <Link
                    href="#about"
                    className={`rounded-md py-2 text-xs font-medium text-gray-700 hover:text-primary sm:px-3 sm:text-sm ${pathname === '/about' ? 'text-primary' : ''}`}
                  >
                    About
                  </Link>
                  <Link
                    href="#privacy"
                    className={`rounded-md py-2 text-xs font-medium text-gray-700 hover:text-primary sm:px-3 sm:text-sm ${pathname === '/privacy' ? 'text-primary' : ''}`}
                  >
                    Privacy
                  </Link>
                </div>

                {session?.user ? (
                  <Button
                    variant={'outline'}
                    className="gap-2"
                    onClick={async () => {
                      await signOut({ redirect: false });
                      router.push('/login');
                    }}
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Link href={'/register'}>
                      <Button variant="outline" className="border-primary text-primary hover:text-primary">
                        Register
                      </Button>
                    </Link>
                    <Link href={'/login'}>
                      <Button variant={'default'} className="bg-primary hover:bg-primary/90">
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex h-[calc(100vh_-_96px)] w-full items-center">
            <div className="mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/90 p-2 md:h-32 md:w-32">
                <Image
                  src="/uon.png"
                  alt="University logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                University Transportation <br /> Management System
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
                Optimizing campus mobility with real-time tracking, efficient scheduling, 
                and seamless communication for students and administrators.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={session?.user ? '/dashboard' : '/register'}
                  className="inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition duration-300 hover:bg-blue-700"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="inline-block rounded-lg border-2 border-white bg-transparent px-8 py-3 font-medium text-white transition duration-300 hover:bg-white/20"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive Campus Mobility Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Designed to meet the unique transportation needs of modern universities
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bus size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fleet Management</h3>
              <p className="text-gray-600">
                Real-time tracking of university buses with maintenance scheduling and driver management.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Dynamic Scheduling</h3>
              <p className="text-gray-600">
                Adaptive timetables that adjust to academic calendars and special events.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Student Portal</h3>
              <p className="text-gray-600">
                Personalized dashboards with route planning, alerts, and digital transport cards.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Route Optimization</h3>
              <p className="text-gray-600">
                Route planning to minimize wait times and maximize efficiency.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Safety Features</h3>
              <p className="text-gray-600">
                Emergency alerts, passenger manifests, and compliance tracking.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive reporting tools for administrators to optimize resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="lg:w-1/2">
              <Image
                src="/about.png"
                alt="University campus transportation"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Transforming Campus Transportation
              </h2>
              <p className="mb-4 text-lg text-gray-600">
                The University Transportation Management System (UTMS) was developed in collaboration 
                with leading educational institutions to address the complex mobility challenges of 
                modern campuses.
              </p>
              <p className="mb-6 text-lg text-gray-600">
                Our platform integrates cutting-edge technology with user-centered design to create 
                a seamless experience for students, faculty, and transportation staff.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary">15+</h3>
                  <p className="text-gray-600">University Partners</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary">98%</h3>
                  <p className="text-gray-600">On-Time Performance</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary">24/7</h3>
                  <p className="text-gray-600">System Availability</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary">10k+</h3>
                  <p className="text-gray-600">Daily Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
  Trusted by University Communities
</h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 font-medium tracking-wide leading-relaxed text-center">
  Hear what our partners say about UTMS
</p>

          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                
                <div>
                  <h3 className="font-semibold">Shahid Rafeeq</h3>
                  <p className="text-sm text-gray-500">Transport Director, UON</p>
                </div>
              </div>
              <p className="text-gray-600">
                "UTMS has revolutionized how we manage our campus transportation. The real-time tracking 
                and automated scheduling have reduced our operational costs by 30%."
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                
                <div>
                  <h3 className="font-semibold">Syed Babar Zaidi</h3>
                  <p className="text-sm text-gray-500">Student Council President</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The student portal makes it so easy to plan my commute. I get notifications if there are 
                delays, and the route optimization saves me at least 20 minutes daily."
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                
                <div>
                  <h3 className="font-semibold">Ateeq</h3>
                  <p className="text-sm text-gray-500">Transport Coordinator</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The administrative dashboard gives us incredible visibility into our fleet operations. 
                We've improved maintenance scheduling and reduced breakdowns significantly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
<section id="privacy" className="py-16 bg-gray-50">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Our <span className="text-blue-600">Privacy Commitment</span>
      </h1>
      <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        We protect your data with enterprise-grade security measures and transparent policies.
      </p>
    </div>

    {/* Policy Content */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Section 1 */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-start mb-6">
          <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 mr-4">
            1
          </div>
          <h2 className="text-xl font-bold text-gray-800 pt-1">Information We Collect</h2>
        </div>
        <p className="text-gray-600 mb-4 pl-16">
          We collect information to provide better services to our users. This includes:
        </p>
        <ul className="space-y-3 pl-16">
          {[
            "Account Information: When you register, we collect your name, email, university ID, and contact details.",
            "Usage Data: We collect information about how you interact with our services.",
            "Location Data: With your permission, we collect location data for real-time tracking.",
            "Device Information: We collect device-specific information for security purposes."
          ].map((item, index) => (
            <li key={index} className="flex">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">•</span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2 */}
      <div className="p-8 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start mb-6">
          <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 mr-4">
            2
          </div>
          <h2 className="text-xl font-bold text-gray-800 pt-1">How We Use Information</h2>
        </div>
        <p className="text-gray-600 mb-4 pl-16">
          We use the information we collect to:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-16">
          {[
            "Provide, maintain, and improve our services",
            "Develop new features and functionality",
            "Personalize our experience",
            "Monitor and analyze service usage",
            "Ensure system security and prevent fraud",
            "Communicate about service updates"
          ].map((item, index) => (
            <li key={index} className="flex items-start bg-white p-3 rounded border border-gray-200">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 3 */}
      <div className="p-8">
        <div className="flex items-start mb-6">
          <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 mr-4">
            3
          </div>
          <h2 className="text-xl font-bold text-gray-800 pt-1">Information Sharing</h2>
        </div>
        <p className="text-gray-600 mb-4 pl-16">
          We do not sell your personal information. We may share information with:
        </p>
        <div className="space-y-4 pl-16">
          <div className="border-l-4 border-blue-300 pl-4 py-1">
            <h3 className="font-semibold text-gray-800">University Administrators</h3>
            <p className="text-gray-600">For transportation planning and management</p>
          </div>
          <div className="border-l-4 border-blue-300 pl-4 py-1">
            <h3 className="font-semibold text-gray-800">Service Providers</h3>
            <p className="text-gray-600">Under strict confidentiality agreements</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Transform Your Campus Transportation?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Join the universities already benefiting from our comprehensive transportation solution.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={session?.user ? '/dashboard' : '/register'}
              className="rounded-lg bg-white px-8 py-3 font-medium text-primary transition duration-300 hover:bg-gray-100"
            >
              Get Started Now
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-white bg-transparent px-8 py-3 font-medium text-white transition duration-300 hover:bg-white/20"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Image
                  src="/uon.png"
                  alt="University logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <h3 className="text-xl font-bold">UTMS</h3>
              </div>
              <p className="mt-4 text-gray-400">
                The leading transportation management solution for universities worldwide.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Solutions</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">For Universities</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Students</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Administrators</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Transport Staff</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">News</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} University Transportation Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landing;