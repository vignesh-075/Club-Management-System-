"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  Trophy,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Track members, roles, and engagement with powerful analytics and insights.",
  },
  {
    icon: Calendar,
    title: "Event Scheduling",
    description:
      "Plan, organize, and manage events with automatic reminders and RSVP tracking.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into club performance, growth metrics, and member activity.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Secure access control with admin, moderator, and member permission levels.",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description:
      "Keep everyone informed with announcements and automated event updates.",
  },
  {
    icon: Clock,
    title: "Activity Tracking",
    description:
      "Monitor participation, attendance, and contribution across all activities.",
  },
];

const stats = [
  { value: "500+", label: "Active Clubs" },
  { value: "25K+", label: "Members" },
  { value: "1.2K+", label: "Events Hosted" },
  { value: "98%", label: "Satisfaction" },
];

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Student Affairs Director",
    content:
      "ClubSync transformed how we manage student organizations. The analytics alone saved us countless hours.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mitchell",
  },
  {
    name: "James Rodriguez",
    role: "Tech Club President",
    content:
      "The event management features are incredible. We went from chaos to coordinated in days.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rodriguez",
  },
  {
    name: "Emily Watson",
    role: "Club Coordinator",
    content:
      "Finally, a platform that understands what clubs actually need. The UX is phenomenal.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Watson",
  },
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">ClubSync</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="gap-1">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                Trusted by 500+ organizations worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              The Complete Platform for{" "}
              <span className="text-primary">Club Management</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Streamline your club operations with powerful member management,
              event scheduling, and real-time analytics. Built for modern
              organizations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-base px-6">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base px-6 bg-transparent"
                >
                  View Live Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Club
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to simplify club administration and
              enhance member engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-all cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Dashboard at Your Fingertips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get a complete overview of your club with our intuitive dashboard
              interface.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl">
              <div className="rounded-xl bg-background p-6">
                {/* Mock Dashboard Preview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Total Members",
                      value: "248",
                      change: "+12.5%",
                      icon: Users,
                    },
                    {
                      label: "Active Events",
                      value: "12",
                      change: "+3",
                      icon: Calendar,
                    },
                    {
                      label: "Attendance Rate",
                      value: "87%",
                      change: "+5.2%",
                      icon: BarChart3,
                    },
                    {
                      label: "Achievements",
                      value: "24",
                      change: "+4",
                      icon: Trophy,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{item.value}</span>
                        <span className="text-xs text-primary mb-1">
                          {item.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card h-48 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Member Growth Chart
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Upcoming Events Calendar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 via-transparent to-chart-2/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Club Leaders Everywhere
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what other organizations are saying about their experience
              with ClubSync.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  {`"${testimonial.content}"`}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full bg-secondary"
                  />
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your organization. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for small clubs just getting started",
                features: [
                  "Up to 50 members",
                  "5 events per month",
                  "Basic analytics",
                  "Email support",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                description: "For growing organizations with more needs",
                features: [
                  "Up to 500 members",
                  "Unlimited events",
                  "Advanced analytics",
                  "Priority support",
                  "Custom branding",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large institutions with specific requirements",
                features: [
                  "Unlimited members",
                  "Unlimited events",
                  "Full analytics suite",
                  "24/7 dedicated support",
                  "White-label solution",
                  "SSO & advanced security",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border ${
                  plan.popular
                    ? "border-primary bg-card shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-border bg-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Club?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join hundreds of organizations already using ClubSync to
                streamline their operations.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started for Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ClubSync</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 ClubSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


