"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";

const dishes = [
  {
    name: "Chicken Souvlaki",
    image: "/assets/showcased-dishes/chicken-souvlaki.png",
    description: "char-grilled chicken skewers, garlic marinade, lemon, oregano, house tzatziki",
    price: "$26",
  },
  {
    name: "Grilled Salmon",
    image: "/assets/showcased-dishes/grilled-salmon.png",
    description: "pan-seared fillet, wilted wild greens, capers, wild herb olive oil infusion",
    price: "$32",
  },
  {
    name: "Lamb Chops",
    image: "/assets/showcased-dishes/lamb-chops.png",
    description: "wood-fired rib chops, charred rosemary, sea salt, roasted garlic purée",
    price: "$38",
  },
  {
    name: "Grilled Octopus",
    image: "/assets/showcased-dishes/grilled-octopus.png",
    description: "tender grilled tentacle, pickled red onion, capers, lemon-herb oil, parsley",
    price: "$28",
  },
  {
    name: "Greek Salad",
    image: "/assets/showcased-dishes/greek-salad.png",
    description: "vine-ripened tomatoes, crisp cucumbers, barrel-aged feta, kalamata olives, wild oregano",
    price: "$18",
  },
  {
    name: "Galaktoboureko",
    image: "/assets/showcased-dishes/galaktoboureko.png",
    description: "crisp semolina custard pie, golden phyllo layers, orange blossom warm honey syrup",
    price: "$14",
  },
];

type MenuDish = {
  name: string;
  description: string;
  price: string;
  details: string[];
  image?: string;
};

type MenuSection = {
  title: string;
  description: string;
  items: MenuDish[];
};

type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  notes: string;
};

const menuSections: MenuSection[] = [
  {
    title: "Small Plates",
    description: "Bites to start the evening with a coastal Mediterranean rhythm.",
    items: [
      {
        name: "Whipped Feta & Honey",
        description: "olive oil, lemon zest, cracked pepper, grilled sourdough",
        price: "$14",
        details: ["Vegetarian", "Serves 2"],
      },
      {
        name: "Grilled Octopus",
        description: "charred lemon, pickled onion, capers, oregano oil",
        price: "$28",
        details: ["House favorite", "Gluten-free"],
        image: "/assets/showcased-dishes/grilled-octopus.png",
      },
    ],
  },
  {
    title: "From the Hearth",
    description: "Wood-fired mains with bright herbs and deep coastal flavor.",
    items: [
      {
        name: "Chicken Souvlaki",
        description: "garlic marinade, lemon, oregano, tzatziki, warm pita",
        price: "$26",
        details: ["Chef favorite", "Contains dairy"],
        image: "/assets/showcased-dishes/chicken-souvlaki.png",
      },
      {
        name: "Grilled Salmon",
        description: "wild greens, capers, herb oil, charred citrus",
        price: "$32",
        details: ["Market fish", "Gluten-free"],
        image: "/assets/showcased-dishes/grilled-salmon.png",
      },
      {
        name: "Lamb Chops",
        description: "rosemary, roasted garlic purée, sea salt, olive oil jus",
        price: "$38",
        details: ["Signature cut", "Rich and savory"],
        image: "/assets/showcased-dishes/lamb-chops.png",
      },
    ],
  },
  {
    title: "Sweet Finish",
    description: "Desserts and lighter finishes to close the meal gracefully.",
    items: [
      {
        name: "Greek Salad",
        description: "tomatoes, cucumbers, barrel-aged feta, olives, oregano",
        price: "$18",
        details: ["Vegetarian", "Fresh and bright"],
        image: "/assets/showcased-dishes/greek-salad.png",
      },
      {
        name: "Galaktoboureko",
        description: "custard pie, phyllo layers, orange blossom honey syrup",
        price: "$14",
        details: ["House dessert", "Contains dairy"],
        image: "/assets/showcased-dishes/galaktoboureko.png",
      },
    ],
  },
];

const reservationWebhookUrl = "https://hook.eu1.make.com/mrmeas8t96exfrhw5c7gpvusl3d3fq1f";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!menuModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuModalOpen]);

  const openMenuModal = () => {
    setMobileMenuOpen(false);
    setMenuModalOpen(true);
  };

  const handleReservationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reservation = Object.fromEntries(formData.entries()) as unknown as ReservationFormData;

    setReservationStatus("sending");

    try {
      const response = await fetch(reservationWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reservation,
          source: "little-coast-site",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with ${response.status}`);
      }

      setReservationStatus("success");
      event.currentTarget.reset();
    } catch {
      setReservationStatus("error");
    }
  };

  return (
    <div className="bg-brand-navy text-brand-ivory min-h-screen">
      {/* 1. HERO SECTION (Fills viewport, dark aesthetic) */}
      <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
        {/* Full-bleed background image with soft dark, warm-tinted overlay */}
        <div className="absolute inset-0 -z-10 select-none">
          <Image
            src="/assets/hero.png"
            alt="Little Coast Mediterranean Kitchen rustic dining atmosphere"
            fill
            priority
            quality={75}
            className="object-cover object-center opacity-40 motion-safe:animate-slow-zoom"
          />
          {/* Soft dark overlay with a hint of warm coastal navy to maintain text readability */}
          <div className="absolute inset-0 bg-[#05111D]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05111D]/30 via-transparent to-[#05111D]/80" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-sand/10 to-transparent motion-safe:animate-drift" />
        </div>

        {/* Top Header / Navigation */}
        <header className="w-full relative z-30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
            {/* Logo on the left */}
            <a href="#" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-brand-navy rounded-3xl">
              <div className="rounded-3xl border border-white/8 bg-brand-navy/30 backdrop-blur-md px-3 py-2 shadow-lg shadow-black/10">
                <Image
                  src="/assets/logos/logo-dark.png"
                  alt="Little Coast Logo"
                  width={220}
                  height={124}
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain"
                  priority
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-sans tracking-widest uppercase font-medium">
              <a href="#home" className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </a>
              <a href="#featured-dishes" className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group">
                Featured Dishes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </a>
              <button
                type="button"
                onClick={openMenuModal}
                className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group"
              >
                Menu
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </button>
              <a href="#story" className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group">
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </a>
              <a href="#visit" className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group">
                Visit
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </a>
              <a href="#reservations" className="text-brand-ivory/80 hover:text-brand-cream transition-colors relative py-1 group">
                Reservations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-sand transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>

            {/* Desktop Call to Action */}
            <div className="hidden md:block">
              <a
                href="#reservations"
                className="inline-block bg-brand-terracotta text-brand-navy font-sans text-xs tracking-widest uppercase font-semibold px-6 py-3 rounded-full hover:bg-[#b06135] active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                Book a table
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-brand-ivory hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy rounded-full transition-colors z-40"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <div
            id="mobile-navigation"
            className={`fixed inset-0 bg-brand-navy/98 z-30 flex flex-col justify-between px-8 py-24 transition-all duration-500 md:hidden ${mobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"}`}
          >
            <div className="flex flex-col gap-8 text-center mt-8">
              <a
                href="#featured-dishes"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Featured Dishes
              </a>
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Home
              </a>
              <button
                type="button"
                onClick={openMenuModal}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Menu
              </button>
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Our Story
              </a>
              <a
                href="#visit"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Visit
              </a>
              <a
                href="#reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif tracking-wide hover:text-brand-sand transition-colors"
              >
                Reservations
              </a>
            </div>

            <div className="flex flex-col gap-6 items-center">
              <a
                href="#reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-brand-terracotta text-brand-navy font-sans text-sm tracking-widest uppercase font-semibold py-4 rounded-full hover:bg-[#b06135] transition-all"
              >
                Book a table
              </a>
              <div className="text-center text-xs text-brand-seamist/80 mt-4 leading-relaxed font-sans">
                <p>104 Coastal Highway, Portsmouth, NH</p>
                <p className="mt-1">Tue — Sun: 5:00 PM — 10:00 PM</p>
              </div>
            </div>
          </div>
        </header>

        {/* Centered Content */}
        <main className="flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-8 lg:px-12 py-12 sm:py-16 relative z-10 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <span className="text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.28em] uppercase text-brand-sand mb-4 sm:mb-6 motion-safe:animate-fade-up" style={{ animationDelay: "80ms" }}>
            Mediterranean Kitchen
          </span>

          {/* Serif Headline - Poetic & Specific */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-brand-cream max-w-4xl leading-[1.08] sm:leading-[1.12] md:leading-[1.1] motion-safe:animate-fade-up" style={{ animationDelay: "180ms" }}>
            Where the <span className="italic font-normal text-brand-sand">Mediterranean wind</span> meets the warmth of our <span className="italic font-normal text-brand-terracotta">wood-fired hearth</span>.
          </h1>

          {/* Subhead - Grounded & Informative */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-brand-ivory/85 max-w-xl lg:max-w-2xl mt-6 sm:mt-8 tracking-wide leading-relaxed motion-safe:animate-fade-up" style={{ animationDelay: "280ms" }}>
            A rustic seaside kitchen serving coastal dishes on the historic shores of Portsmouth, New Hampshire.
          </p>

          {/* Centered CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 sm:mt-12 w-full sm:w-auto motion-safe:animate-fade-up" style={{ animationDelay: "380ms" }}>
            <a
              href="#reservations"
              className="w-full sm:w-auto text-center bg-brand-terracotta text-brand-navy font-sans text-sm tracking-widest uppercase font-bold px-8 py-4 rounded-full hover:bg-[#b06135] active:scale-98 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy shadow-lg shadow-black/20"
            >
              Reserve a table
            </a>
            <button
              type="button"
              onClick={openMenuModal}
              className="w-full sm:w-auto text-center border-2 border-brand-ivory/80 text-brand-ivory font-sans text-sm tracking-widest uppercase font-bold px-8 py-[14px] rounded-full hover:border-brand-cream hover:bg-brand-cream hover:text-brand-navy active:scale-98 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              View menu
            </button>
          </div>
        </main>

        {/* Bottom Fold Info */}
        <div className="w-full relative z-10 py-8 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end">
            {/* Bottom-left: address and opening hours */}
            <div className="text-left font-sans text-xs sm:text-sm text-brand-seamist max-w-md leading-relaxed motion-safe:animate-fade-up" style={{ animationDelay: "480ms" }}>
              <p className="font-semibold text-brand-sand uppercase tracking-wider mb-1">Visit Us</p>
              <p>104 Coastal Highway, Portsmouth, NH</p>
              <p className="text-brand-seamist/80 mt-0.5">
                Tue — Sun: 5:00 PM — 10:00 PM <span className="mx-2 text-brand-sand/45">|</span> Closed Mondays
              </p>
            </div>
            
            {/* Subtle logo mark on the right (hidden on mobile) */}
            <div className="hidden sm:block opacity-35 hover:opacity-60 transition-opacity motion-safe:animate-fade-up" style={{ animationDelay: "560ms" }}>
              <span className="font-serif italic text-xs tracking-widest text-brand-sand">Little Coast © 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DISHES SECTION (Warm light aesthetic) */}
      <section id="featured-dishes" className="scroll-mt-24 bg-brand-cream text-brand-navy py-20 sm:py-24 px-6 sm:px-8 lg:px-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16 motion-safe:animate-fade-up">
            <span className="text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.22em] uppercase text-brand-olive block mb-3">
              From the kitchen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-brand-navy mb-4 leading-[1.08]">
              Featured Dishes
            </h2>
            <p className="font-sans text-sm sm:text-base text-brand-coastal/80 max-w-lg sm:max-w-xl mx-auto leading-relaxed">
              A seasonal selection of wood-fired specialties and coastal classics.
            </p>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish, index) => (
              <div key={dish.name} className="group cursor-pointer flex flex-col motion-safe:animate-fade-up" style={{ animationDelay: `${120 + index * 70}ms` }}>
                {/* Card Image */}
                <div className="aspect-square w-full relative overflow-hidden rounded-2xl mb-4 bg-brand-navy/5 motion-safe:animate-fade-scale">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Title and Price */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-brand-navy group-hover:text-brand-coastal transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <span className="font-sans font-semibold text-brand-terracotta text-sm sm:text-base whitespace-nowrap">
                    {dish.price}
                  </span>
                </div>
                
                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-brand-coastal/75 mt-2 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>
            ))}
          </div>

          {/* Centered Ghost Button */}
          <div className="flex justify-center mt-14 sm:mt-16 motion-safe:animate-fade-up" style={{ animationDelay: "520ms" }}>
            <button
              type="button"
              onClick={openMenuModal}
              className="inline-block border-2 border-brand-coastal/85 text-brand-coastal font-sans text-xs sm:text-sm tracking-widest uppercase font-bold px-8 py-4 rounded-full hover:bg-brand-coastal hover:text-brand-cream hover:border-brand-coastal active:scale-98 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coastal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
            >
              See full menu
            </button>
          </div>

        </div>
      </section>

      {/* 3. OUR STORY & VISIT SECTION (Warm Ivory background with ambient glows, asymmetrical grid layout) */}
      <section id="story" className="scroll-mt-24 bg-brand-ivory text-brand-navy py-20 sm:py-24 pb-36 sm:pb-44 px-6 sm:px-8 lg:px-12 relative z-20 overflow-hidden">
        {/* Soft corner glows for warm candlelit ambient effect */}
        <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 -translate-x-1/3 -translate-y-1/3 bg-brand-terracotta/5 blur-[120px] rounded-full pointer-events-none motion-safe:animate-drift" />
        <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 translate-x-1/3 translate-y-1/3 bg-brand-sand/15 blur-[120px] rounded-full pointer-events-none motion-safe:animate-drift" style={{ animationDelay: "2s" }} />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column - Story Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-8 motion-safe:animate-fade-up">
              {/* Eyebrow */}
              <span className="text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.22em] uppercase text-brand-olive mb-3 block">
                Our Story
              </span>
              
              {/* Heading H2 with last words highlighted in italic Terracotta Sunset */}
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-brand-navy leading-[1.1] sm:leading-[1.12]">
                Greek Mediterranean dining, <span className="italic font-normal text-brand-terracotta">shaped by the coast.</span>
              </h2>
              
              {/* Decorative divider */}
              <div className="flex items-center gap-3 my-6 w-full max-w-xs">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-terracotta/55 to-brand-sand/20" />
                <span className="h-2 w-2 rounded-full bg-brand-terracotta shadow-[0_0_0_4px_rgba(201,119,69,0.08)]" />
                <span className="h-px flex-1 bg-gradient-to-r from-brand-sand/20 via-brand-sand/55 to-transparent" />
              </div>

              {/* Paragraphs and blockquote */}
              <div className="font-sans text-sm sm:text-base text-brand-coastal/90 space-y-5 sm:space-y-6 leading-relaxed max-w-prose">
                <p>
                  Our journey begins along the rocky cliffs of the Aegean, where the rhythm of the tides dictates the flow of our kitchen. Here at Little Coast, we honor those traditions with wood-fired patience. Each morning, dayboats bring the freshest catch directly to our kitchen, while wild hills herbs are gathered to season the hearth.
                </p>

                {/* Elegant Terracotta-Bordered Blockquote */}
                <blockquote className="border-l-4 border-brand-terracotta pl-4 my-6">
                  <p className="font-serif italic text-lg sm:text-xl text-brand-navy leading-relaxed font-medium">
                    &ldquo;Every plate tells of salt, wind, and embers.&rdquo;
                  </p>
                </blockquote>

                <p>
                  We source our seafood from local dayboats, combining fresh daily catches with wild hill herbs, sun-cured Kalamata olive groves, and cold-pressed oil. In keeping with rustic seaside traditions, our food is shaped by simplicity, fire, and the warmth of Mediterranean hospitality.
                </p>
              </div>
            </div>

            {/* Right Column - Visuals & Floating Overlapping Card */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 pb-0 lg:pb-16 motion-safe:animate-fade-up" style={{ animationDelay: "160ms" }}>
              
              {/* Large vertical image container */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden group shadow-lg shadow-brand-navy/5 motion-safe:animate-fade-scale">
                <Image
                  src="/assets/exterior.png"
                  alt="Little Coast Mediterranean Kitchen exterior seaside dining space"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  className="object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                />
              </div>

              {/* Floating overlap contact details card */}
              <div
                id="visit"
                className="scroll-mt-32 relative mt-6 lg:mt-0 lg:absolute lg:-bottom-20 left-0 right-0 lg:-left-12 lg:right-8 bg-brand-cream/92 backdrop-blur-md border border-brand-sand/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-navy/10 transform transition-transform duration-300 hover:-translate-y-2 group/card"
              >
                <h3 className="font-serif text-lg sm:text-xl font-medium text-brand-navy mb-4">Location & Hours</h3>
                
                <ul className="space-y-4 text-xs sm:text-sm text-brand-coastal font-sans">
                  
                  {/* Location Address */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <svg className="w-5 h-5 stroke-brand-terracotta stroke-[1.5] fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">Address</p>
                      <p className="text-brand-coastal/90">104 Coastal Highway</p>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <svg className="w-5 h-5 stroke-brand-terracotta stroke-[1.5] fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.115-3.847-6.672-6.672l1.293-.97c.362-.272.528-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">Phone</p>
                      <a href="tel:6035550198" className="text-brand-coastal/90 hover:text-brand-terracotta transition-colors">(603) 555-0198</a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <svg className="w-5 h-5 stroke-brand-terracotta stroke-[1.5] fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">Email</p>
                      <a href="mailto:hello@littlecoastkitchen.com" className="text-brand-coastal/90 hover:text-brand-terracotta transition-colors">hello@littlecoastkitchen.com</a>
                    </div>
                  </li>

                  {/* Opening Hours */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <svg className="w-5 h-5 stroke-brand-terracotta stroke-[1.5] fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">Hours</p>
                      <div className="text-brand-coastal/90 space-y-1 mt-1">
                        <p><span className="font-medium text-brand-navy">Dinner:</span> Tue — Sun: 5:00 PM — 10:00 PM</p>
                        <p><span className="font-medium text-brand-navy">Lunch:</span> Fri — Sun: 11:30 AM — 2:30 PM</p>
                        <p className="text-brand-terracotta font-medium tracking-wide uppercase text-[10px] mt-1">Closed Mondays</p>
                      </div>
                    </div>
                  </li>

                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. RESERVATIONS */}
      <section id="reservations" className="scroll-mt-24 bg-brand-navy text-brand-cream py-20 sm:py-24 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,119,69,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(216,196,160,0.14),_transparent_35%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
            <div className="motion-safe:animate-fade-up">
              <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] uppercase text-brand-sand block mb-3">
                Reservations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.06] max-w-2xl">
                Reserve a table for the evening, and let us shape the rest around your arrival.
              </h2>
              <p className="font-sans text-sm sm:text-base text-brand-ivory/82 mt-4 max-w-2xl leading-relaxed">
                Share the basics now so we can route the request into a webhook later without changing the form structure.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 text-sm font-sans text-brand-ivory/82 max-w-2xl">
                <div className="rounded-2xl border border-brand-sand/15 bg-brand-cream/6 px-5 py-4">
                  <p className="font-semibold text-brand-sand uppercase tracking-[0.18em] text-[11px] mb-1">Hours</p>
                  <p>Tue — Sun: 5:00 PM — 10:00 PM</p>
                  <p>Fri — Sun: 11:30 AM — 2:30 PM</p>
                </div>
                <div className="rounded-2xl border border-brand-sand/15 bg-brand-cream/6 px-5 py-4">
                  <p className="font-semibold text-brand-sand uppercase tracking-[0.18em] text-[11px] mb-1">Notes</p>
                  <p>Include dietary restrictions, celebrations, or seating requests.</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleReservationSubmit}
              className="rounded-[2rem] border border-brand-sand/15 bg-brand-cream/8 backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/20 motion-safe:animate-fade-up"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2 block">
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream placeholder:text-brand-seamist/70 outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                    placeholder="Your full name"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream placeholder:text-brand-seamist/70 outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                    placeholder="name@example.com"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Phone</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream placeholder:text-brand-seamist/70 outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                    placeholder="(603) 555-0198"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Date</span>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Time</span>
                  <input
                    name="time"
                    type="time"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Party Size</span>
                  <select
                    name="partySize"
                    required
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select size
                    </option>
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2 block">
                  <span className="mb-2 block text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-brand-sand">Notes</span>
                  <textarea
                    name="notes"
                    rows={5}
                    className="w-full rounded-2xl border border-brand-sand/15 bg-brand-navy/35 px-4 py-3 text-brand-cream placeholder:text-brand-seamist/70 outline-none transition focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/30"
                    placeholder="Dietary restrictions, allergies, celebrations, accessibility needs, or special seating requests"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 leading-relaxed max-w-md">
                  This form posts directly to our reservation webhook and is ready for Make processing.
                </p>
                <div className="flex flex-col items-stretch gap-3 sm:items-end">
                  <button
                    type="submit"
                    disabled={reservationStatus === "sending"}
                    className="inline-flex justify-center text-center bg-brand-terracotta text-brand-navy font-sans text-xs sm:text-sm tracking-widest uppercase font-bold px-6 py-4 rounded-full hover:bg-[#b06135] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                  >
                    {reservationStatus === "sending" ? "Sending..." : "Request reservation"}
                  </button>
                  {reservationStatus === "success" ? (
                    <p className="text-xs sm:text-sm text-brand-sand text-right">Reservation request sent.</p>
                  ) : null}
                  {reservationStatus === "error" ? (
                    <p className="text-xs sm:text-sm text-[#F4B8A4] text-right">We couldn’t send that just now. Please try again.</p>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 5. GLOBAL FOOTER (Simple, elegant dark background) */}
      <footer className="bg-brand-navy border-t border-brand-sand/15 py-10 sm:py-12 px-6 sm:px-8 lg:px-12 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <a href="#" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta rounded-3xl">
            <div className="rounded-3xl border border-white/8 bg-brand-navy/40 backdrop-blur-md px-3 py-2 shadow-lg shadow-black/10">
              <Image
                src="/assets/logos/logo-dark.png"
                alt="Little Coast Logo"
                width={190}
                height={107}
                className="h-10 sm:h-12 w-auto object-contain opacity-95"
              />
            </div>
          </a>
          <div className="text-center sm:text-right font-sans text-xs text-brand-seamist/85 leading-relaxed">
            <p>Little Coast — Mediterranean Kitchen. All rights reserved.</p>
            <p className="mt-1">Crafted with care in Portsmouth, NH © 2026</p>
          </div>
        </div>
      </footer>

      {menuModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/96 backdrop-blur-2xl"
          onClick={() => setMenuModalOpen(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,119,69,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(216,196,160,0.12),_transparent_30%)] pointer-events-none" />
          <div className="relative h-full overflow-y-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-8" onClick={(event) => event.stopPropagation()} role="presentation">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
                <div>
                  <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.28em] uppercase text-brand-sand block mb-3">
                    Full Menu
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-brand-cream leading-[1.05]">
                    Mediterranean dishes, grouped by the rhythm of the meal.
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-brand-ivory/78 mt-4 max-w-2xl leading-relaxed">
                    This menu surface is ready for a database-backed data source. Images stay square, and non-square uploads crop automatically to fit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="shrink-0 rounded-full border border-brand-sand/20 bg-brand-cream/8 px-4 py-3 text-brand-cream transition-colors hover:bg-brand-cream/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                  aria-label="Close menu"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {menuSections.map((section) => (
                  <section key={section.title} className="rounded-[2rem] border border-brand-sand/15 bg-brand-cream/6 p-5 sm:p-6 shadow-2xl shadow-black/15">
                    <div className="border-b border-brand-sand/15 pb-4 mb-5">
                      <h3 className="font-serif text-2xl font-medium text-brand-cream">{section.title}</h3>
                      <p className="font-sans text-sm text-brand-ivory/78 mt-2 leading-relaxed">{section.description}</p>
                    </div>

                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <article key={item.name} className="rounded-[1.5rem] border border-brand-sand/15 bg-brand-navy/35 p-4 sm:p-5">
                          <div className="grid gap-4 sm:grid-cols-[104px_1fr]">
                            <div className="aspect-square overflow-hidden rounded-2xl bg-brand-cream/8">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={240}
                                  height={240}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-terracotta/18 via-brand-sand/10 to-transparent">
                                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-sand/90">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="font-serif text-xl font-medium text-brand-cream leading-tight">{item.name}</h4>
                                <span className="font-sans text-sm font-semibold text-brand-sand whitespace-nowrap">{item.price}</span>
                              </div>

                              <p className="font-sans text-sm text-brand-ivory/78 mt-2 leading-relaxed">{item.description}</p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {item.details.map((detail) => (
                                  <span key={detail} className="rounded-full border border-brand-sand/15 bg-brand-cream/8 px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-brand-ivory/82">
                                    {detail}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
