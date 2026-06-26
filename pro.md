Build a futuristic, ergonomic, and visually premium car rental website for "B CARS – Kaouthara Bour Cars".

## Brand Identity
- Company name: B CARS / Kaouthara Bour Cars
- Industry: Car rental (كراء السيارات)
- Tagline: "قيادة ممتعة... أينما كنت!" (Fun driving... wherever you are!)
- Brand values: Trust, comfort, professionalism, availability

## Color Palette (strict — match the brand)
- Primary background: #0a0a0a (near-black)
- Gold/accent: #C9A84C and #F5D078 (warm luxury gold)
- White: #FFFFFF for headings
- Secondary text: #CCCCCC
- Card backgrounds: #111111 or #1a1a1a
- Borders/glows: rgba(201, 168, 76, 0.3) gold glow effects
- Avoid blue, red, or green — gold + black only

## Typography
- Headings: Playfair Display or Cormorant Garamond (serif, luxury feel)
- Body: Inter or Poppins (clean, modern)
- Arabic text support via Google Fonts (Tajawal or Cairo for Arabic)
- Support RTL where Arabic is used

## Design Style: Futuristic + Ergonomic + Premium
- Dark luxury aesthetic similar to high-end automotive brands (think BMW, Rolls-Royce)
- Glassmorphism cards: backdrop-filter: blur(12px), semi-transparent dark glass panels with gold borders
- Subtle animated gradients or particle background on the hero (dark with gold dust)
- Smooth scroll animations (fade-up, slide-in using AOS or Framer Motion or CSS)
- Hover micro-interactions: gold glow on cards, button shimmer effects
- Custom gold scrollbar
- Fully responsive: mobile-first design

## Sections to Build

### 1. Navbar
- Logo: "B" monogram in gold + "CARS" in white, "Kaouthara Bour Cars" subtitle
- Navigation links: Home, Fleet, Services, About, Contact
- Sticky with blur backdrop on scroll
- Language toggle button: AR / FR / EN
- "Book Now" CTA button in gold

### 2. Hero Section
- Full-screen dark hero with animated background (subtle golden particles or light streaks)
- Main headline in Arabic: "كراء السيارات بكل راحة و ثقة"
- Subheadline in French/English: "Car Rental with Comfort & Trust"
- Two CTA buttons: "Réserver maintenant" (gold filled) + "Voir notre flotte" (outlined gold)
- Floating animated car image or video background option
- 3 floating stat badges: ✓ Assurance complète | 24/7 Service | Plusieurs véhicules

### 3. Features / Why Us
- 3-column card grid with glassmorphism cards
- Icons in gold
- Cards: 
  - 🛡️ تأمين شامل (Full Insurance)
  - 🕐 خدمة 24/7 (24/7 Service)
  - 🔑 عدة أنواع من السيارات (Multiple Car Types)
  - ⭐ أسعار متناسبة (Competitive Prices)
  - 🚗 سيارات جديدة (New Cars)
  - 🏆 خدمة احترافية (Professional Service)

### 4. Fleet / Cars Section
- Horizontal scrollable or grid layout of car cards
- Each car card: car image, model name, key specs (seats, fuel, transmission), price/day, "Book" button
- Cards have gold glow on hover, dark glass background
- Featured models: Dacia Sandero, Dacia Duster (from the brand images)
- Filter tabs: Economy | SUV | Premium

### 5. How It Works
- 3-step visual timeline with gold connecting line
- Steps: 1. Choose your car → 2. Confirm booking → 3. Drive & enjoy
- Futuristic step number circles in gold

### 6. Testimonials
- Auto-scrolling testimonial carousel
- Dark glass cards with gold quote marks
- Star ratings in gold

### 7. Contact / Booking Form
- Split layout: left = contact info (phone, address, WhatsApp), right = booking form
- Form fields: Name, Phone, Pickup date, Return date, Car preference
- Gold submit button with shimmer animation
- WhatsApp floating button (bottom right, gold)

### 8. Footer
- Dark footer with gold logo
- Links, social icons (Instagram, Facebook, WhatsApp)
- "© 2025 B CARS – Kaouthara Bour Cars. Tous droits réservés."

## Technical Requirements
- Framework: Next.js 14 (App Router) OR plain HTML/CSS/JS — choose what's fastest to build
- Tailwind CSS for styling
- Framer Motion for animations (or AOS.js if plain HTML)
- Google Fonts: Playfair Display + Inter + Tajawal
- All text bilingual: Arabic primary, French secondary
- SEO meta tags included
- Lighthouse score target: 90+ performance

## Micro-details that matter
- Gold shimmer animation on primary buttons (CSS keyframe sweep)
- Smooth parallax on hero section
- Section dividers as thin gold horizontal lines
- Loading screen with the B CARS logo animating in
- Custom gold-styled scrollbar (webkit)
- All transitions: ease: cubic-bezier(0.4, 0, 0.2, 1), duration 300-500ms