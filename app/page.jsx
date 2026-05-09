'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ════════════════════════════════════════
   PRODUCT ILLUSTRATIONS (SVG strings)
════════════════════════════════════════ */
const ILLOS = {
  masala_aludom: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="65" cy="100" rx="48" ry="16" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/>
    <path d="M20 90 Q18 68 22 52 Q28 32 65 30 Q102 32 108 52 Q112 68 110 90Z" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/>
    <ellipse cx="65" cy="90" rx="45" ry="14" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/>
    <ellipse cx="65" cy="82" rx="30" ry="8" fill="#C8784A" opacity="0.3"/>
    <path d="M88 28 L105 16" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="92" cy="35" rx="12" ry="8" transform="rotate(-30 92 35)" fill="#D4B483" stroke="#A8885A" stroke-width="2"/>
    <text x="65" y="70" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Alur Dom</text>
  </svg>`,
  masala_achar: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="35" width="70" height="85" rx="10" fill="#F5EFE6" stroke="#C8B898" stroke-width="2"/>
    <path d="M30 60 L100 60" stroke="#C8B898" stroke-width="1"/>
    <rect x="42" y="20" width="46" height="20" rx="5" fill="#DDD0BC" stroke="#C8B898" stroke-width="1.5"/>
    <rect x="38" y="12" width="54" height="12" rx="5" fill="#2B4A1D"/>
    <rect x="50" y="48" width="30" height="30" rx="4" fill="white" opacity="0.6"/>
    <path d="M65 56 C60 56 55 60 55 65 C55 72 65 78 65 78 C65 78 75 72 75 65 C75 60 70 56 65 56Z" fill="#9B4F1A" opacity="0.7"/>
    <text x="65" y="100" font-family="serif" font-size="8" fill="#7C6A54" text-anchor="middle" font-style="italic">Achar</text>
  </svg>`,
  masala_chicken: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 110 C40 100 20 78 20 55 C20 35 40 20 65 20 C90 20 110 35 110 55 C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" stroke-width="2"/>
    <path d="M65 95 C48 88 35 74 35 58 C35 44 48 33 65 33 C82 33 95 44 95 58 C95 74 82 88 65 95Z" fill="#D4A882" stroke="#B8844A" stroke-width="1.5"/>
    <circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" stroke-width="2"/>
    <circle cx="65" cy="60" r="7" fill="#8B3A14" opacity="0.6"/>
    <text x="65" y="120" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Murgir Mangshor</text>
  </svg>`,
  masala_mutton: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 108 C40 98 18 76 18 53 C18 33 38 18 65 18 C92 18 112 33 112 53 C112 76 90 98 65 108Z" fill="#D4A882" stroke="#A87848" stroke-width="2"/>
    <path d="M65 92 C47 85 33 71 33 56 C33 43 47 32 65 32 C83 32 97 43 97 56 C97 71 83 85 65 92Z" fill="#C89464" stroke="#A87848" stroke-width="1.5"/>
    <circle cx="65" cy="58" r="16" fill="#9B5A2A" stroke="#7A3D18" stroke-width="2"/>
    <circle cx="65" cy="58" r="7" fill="#5C2810" opacity="0.7"/>
    <text x="65" y="118" font-family="serif" font-size="7" fill="#7C6A54" text-anchor="middle" font-style="italic">Khashir Mangshor</text>
  </svg>`,
  masala_beef: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 108 C38 96 16 73 16 50 C16 30 36 16 65 16 C94 16 114 30 114 50 C114 73 92 96 65 108Z" fill="#C89464" stroke="#9B6A38" stroke-width="2"/>
    <path d="M65 90 C46 82 32 68 32 53 C32 41 46 30 65 30 C84 30 98 41 98 53 C98 68 84 82 65 90Z" fill="#B48050" stroke="#9B6A38" stroke-width="1.5"/>
    <circle cx="65" cy="55" r="18" fill="#7A3418" stroke="#5C2410" stroke-width="2"/>
    <circle cx="65" cy="55" r="8" fill="#3A1408" opacity="0.7"/>
    <text x="65" y="119" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Gorur Mangshor</text>
  </svg>`,
  spice_amchoor: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 18 C65 18 25 30 18 60 C12 85 30 108 65 112 C100 108 118 85 112 60 C105 30 65 18 65 18Z" fill="#E8D4A0" stroke="#C8A848" stroke-width="2"/>
    <path d="M65 32 C65 32 38 42 34 62 C30 80 42 98 65 100 C88 98 100 80 96 62 C92 42 65 32 65 32Z" fill="#D4BC80" stroke="#B89840" stroke-width="1.5"/>
    <path d="M65 18 C62 8 68 4 70 10" stroke="#2B4A1D" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M45 68 C50 72 60 74 65 72 C70 74 80 72 85 68" stroke="#B89840" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <text x="65" y="90" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Amchoor</text>
  </svg>`,
  spice_ginger: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 75 C18 62 22 44 35 35 C48 26 58 36 68 33 C78 30 90 18 102 25 C116 33 118 53 110 65 C98 80 78 75 62 72 C46 69 35 90 25 75Z" fill="#D4B483" stroke="#A8885A" stroke-width="2"/>
    <path d="M52 34 C50 22 58 14 64 20" stroke="#A8885A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M78 32 C80 20 90 16 92 24" stroke="#A8885A" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M35 55 C48 52 62 54 74 50" stroke="rgba(100,70,30,0.25)" stroke-width="1.5" fill="none"/>
    <path d="M40 64 C53 61 67 63 80 59" stroke="rgba(100,70,30,0.2)" stroke-width="1.2" fill="none"/>
    <text x="65" y="110" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Ada Powder</text>
  </svg>`,
  dry_banana: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 95 C20 80 20 55 30 40 C40 25 58 20 72 28 C86 36 95 55 88 72 C82 88 65 98 48 97 C40 97 35 100 30 95Z" fill="#E8D878" stroke="#C8B440" stroke-width="2"/>
    <path d="M70 28 C74 18 82 14 86 20" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M38 80 C48 76 58 78 68 74" stroke="#B8A430" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="95" cy="88" rx="18" ry="12" transform="rotate(-20 95 88)" fill="#D4B483" stroke="#A8885A" stroke-width="1.5"/>
    <path d="M82 82 C88 84 100 84 106 80" stroke="#8B6A3A" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    <text x="65" y="118" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Kola o Badam Bite</text>
  </svg>`,
  dry_pineapple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 100 C45 96 28 78 28 58 C28 38 44 22 65 22 C86 22 102 38 102 58 C102 78 85 96 65 100Z" fill="#E8C84A" stroke="#C8A830" stroke-width="2"/>
    <path d="M45 58 L65 38 L85 58 L65 78 Z" fill="none" stroke="#B89820" stroke-width="1" opacity="0.5"/>
    <path d="M45 58 L65 78 M85 58 L65 38" stroke="#B89820" stroke-width="0.8" opacity="0.3"/>
    <path d="M55 22 C52 10 56 4 60 8 C58 0 64 -2 65 4 C66 -2 72 0 70 8 C74 4 78 10 75 22" fill="none" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round"/>
    <text x="65" y="115" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Anarosh</text>
  </svg>`,
  dry_apple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="68" r="45" fill="#F5D8C0" stroke="#E8A87A" stroke-width="2"/>
    <circle cx="65" cy="68" r="32" fill="#F0CAAA" stroke="#E8A87A" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.6"/>
    <circle cx="65" cy="68" r="12" fill="#D48A5A" stroke="#B8643A" stroke-width="2"/>
    <line x1="65" y1="23" x2="65" y2="113" stroke="#D4884A" stroke-width="0.8" opacity="0.4"/>
    <line x1="20" y1="68" x2="110" y2="68" stroke="#D4884A" stroke-width="0.8" opacity="0.4"/>
    <line x1="33" y1="36" x2="97" y2="100" stroke="#D4884A" stroke-width="0.8" opacity="0.3"/>
    <line x1="97" y1="36" x2="33" y2="100" stroke="#D4884A" stroke-width="0.8" opacity="0.3"/>
    <path d="M65 23 C62 12 68 8 70 14" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <text x="65" y="125" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Apple</text>
  </svg>`,
}

/* ════════════════════════════════════════
   PRODUCT DATA
════════════════════════════════════════ */
const ALL_PRODS = [
  { id: 1,  name: 'Alur Dom Masala',         bn: 'আলুর দম মশলা',          cat: 'masala', desc: 'Aromatic potato curry blend with whole spices — the secret behind a perfect Alur Dom.',      price: '৳145', illo: 'masala_aludom',  badge: 'bestseller' },
  { id: 2,  name: 'Achar Masala',            bn: 'আচার মশলা',             cat: 'masala', desc: 'Tangy, zesty pickle spice mix for the most flavorful homemade achars and chutneys.',        price: '৳130', illo: 'masala_achar',   badge: 'new' },
  { id: 3,  name: 'Murgir Mangshor Masala',  bn: 'মুরগির মাংসের মশলা',    cat: 'masala', desc: 'Rich, fragrant chicken curry masala with 18 premium spices — bold & deeply authentic.',    price: '৳160', illo: 'masala_chicken', badge: 'hot' },
  { id: 4,  name: 'Khashir Mangshor Masala', bn: 'খাশির মাংসের মশলা',     cat: 'masala', desc: 'Deep, warming mutton curry blend crafted for special occasions and festive cooking.',       price: '৳175', illo: 'masala_mutton',  badge: '' },
  { id: 5,  name: 'Gorur Mangshor Masala',   bn: 'গরুর মাংসের মশলা',      cat: 'masala', desc: 'Bold beef curry masala — a Bengali kitchen staple for hearty, slow-cooked curries.',       price: '৳175', illo: 'masala_beef',    badge: '' },
  { id: 6,  name: 'Amchoor Powder',          bn: 'আমচুর পাউডার',          cat: 'spice',  desc: 'Sun-dried green mango powder adding natural tang and bright depth to every dish.',          price: '৳120', illo: 'spice_amchoor',  badge: 'new' },
  { id: 7,  name: 'Ada Powder',              bn: 'আদা পাউডার',            cat: 'spice',  desc: 'Pure stone-ground ginger powder — warming, digestive, and intensely fragrant.',             price: '৳110', illo: 'spice_ginger',   badge: '' },
  { id: 8,  name: 'Dry Kola o Badam Bite',   bn: 'শুকনো কলা ও বাদাম বাইট', cat: 'dry',  desc: 'Crispy dried banana and almond bites — a nutritious, energy-packed premium snack.',       price: '৳190', illo: 'dry_banana',     badge: 'hot' },
  { id: 9,  name: 'Dry Anarosh',             bn: 'শুকনো আনারস',           cat: 'dry',    desc: 'Sweet and chewy sun-dried pineapple — tropical goodness with zero preservatives.',          price: '৳165', illo: 'dry_pineapple',  badge: 'fresh' },
  { id: 10, name: 'Dry Apple',               bn: 'শুকনো আপেল',            cat: 'dry',    desc: 'Crispy dehydrated apple slices — perfect for snacking, baking, or gifting.',               price: '৳180', illo: 'dry_apple',      badge: 'fresh' },
]

const TICKER_ITEMS = [
  'Free Shipping Over ৳500',
  '100% Natural — No Preservatives',
  'Stone-Ground Masalas',
  'Authentic Bengali Recipes',
  'Sun-Dried Fruits & Snacks',
  'Premium Airtight Packaging',
  'Same-Day Dispatch',
]

function badgeMark(b) {
  const map = {
    bestseller: ['badge-new', 'Best Seller'],
    new: ['badge-new', 'New'],
    hot: ['badge-hot', 'Popular'],
    fresh: ['badge-fr', 'Fresh'],
  }
  if (!b || !map[b]) return null
  return <span className={`prod-badge ${map[b][0]}`}>{map[b][1]}</span>
}

function StarIcon() {
  return (
    <svg className="star" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function Page() {
  const [cartCount, setCartCount]           = useState(0)
  const [wished, setWished]                 = useState(new Set())
  const [activeFilter, setActiveFilter]     = useState('all')
  const [filteredProds, setFilteredProds]   = useState(ALL_PRODS)
  const [toast, setToast]                   = useState({ msg: '', show: false })
  const toastTimer                          = useRef(null)
  const nlEmailRef                          = useRef(null)

  /* ── Toast helper ── */
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2600
    )
  }, [])

  /* ── Cart ── */
  const addToCart = (name) => {
    setCartCount((c) => c + 1)
    showToast(`${name} added to cart`)
  }

  /* ── Wishlist ── */
  const toggleWish = (id) => {
    setWished((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        showToast('Removed from wishlist')
      } else {
        next.add(id)
        showToast('Saved to wishlist ♥')
      }
      return next
    })
  }

  /* ── Filter ── */
  const filterProds = (cat) => {
    setActiveFilter(cat)
    setFilteredProds(cat === 'all' ? ALL_PRODS : ALL_PRODS.filter((p) => p.cat === cat))
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  /* ── Newsletter ── */
  const handleNl = () => {
    const val = nlEmailRef.current?.value || ''
    if (!val || !val.includes('@')) {
      showToast('Please enter a valid email')
      return
    }
    showToast('Subscribed! Welcome to the family.')
    if (nlEmailRef.current) nlEmailRef.current.value = ''
  }

  /* ── Scroll Reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal:not(.on)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filteredProds])

  return (
    <>
      <Navbar cartCount={cartCount} onShowToast={showToast} />

      {/* ═══ BOTANICAL BACKGROUND ═══ */}
      <div className="botanical-bg">
        <div
          className="leaf leaf-1"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 250 C100 250 10 180 5 100 C0 20 80 0 100 10 C120 0 200 20 195 100 C190 180 100 250 100 250Z" fill="#2B4A1D"/>
              <path d="M100 250 L100 10" stroke="#1D3314" stroke-width="2" fill="none"/>
              <path d="M100 200 C70 160 30 140 10 80" stroke="#1D3314" stroke-width="1.2" fill="none"/>
              <path d="M100 200 C130 160 170 140 190 80" stroke="#1D3314" stroke-width="1.2" fill="none"/>
              <path d="M100 160 C75 130 40 120 20 70" stroke="#1D3314" stroke-width="0.8" fill="none"/>
              <path d="M100 160 C125 130 160 120 180 70" stroke="#1D3314" stroke-width="0.8" fill="none"/>
              <path d="M100 120 C80 95 55 88 38 55" stroke="#1D3314" stroke-width="0.6" fill="none"/>
              <path d="M100 120 C120 95 145 88 162 55" stroke="#1D3314" stroke-width="0.6" fill="none"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-2"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 170 C70 170 5 120 3 70 C1 20 55 5 70 12 C85 5 139 20 137 70 C135 120 70 170 70 170Z" fill="#4C7A32"/>
              <path d="M70 170 L70 12" stroke="#2B4A1D" stroke-width="1.5" fill="none"/>
              <path d="M70 140 C50 110 20 95 5 55" stroke="#2B4A1D" stroke-width="0.8" fill="none"/>
              <path d="M70 140 C90 110 120 95 135 55" stroke="#2B4A1D" stroke-width="0.8" fill="none"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-3"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 270 C30 220 -10 140 10 70 C30 0 110 -10 140 20 C170 -10 220 20 200 80 C180 160 150 240 110 270Z" fill="#2B4A1D"/>
              <path d="M110 270 C110 270 80 180 90 80 C100 20 140 10 140 10" stroke="#1D3314" stroke-width="2" fill="none"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-4"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 250 C100 250 10 180 5 100 C0 20 80 0 100 10 C120 0 200 20 195 100 C190 180 100 250 100 250Z" fill="#2B4A1D"/>
              <path d="M100 250 L100 10" stroke="#1D3314" stroke-width="2" fill="none"/>
              <path d="M100 200 C70 160 30 140 10 80" stroke="#1D3314" stroke-width="1.2" fill="none"/>
              <path d="M100 200 C130 160 170 140 190 80" stroke="#1D3314" stroke-width="1.2" fill="none"/>
              <path d="M100 130 C80 100 50 90 30 55" stroke="#1D3314" stroke-width="0.7" fill="none"/>
              <path d="M100 130 C120 100 150 90 170 55" stroke="#1D3314" stroke-width="0.7" fill="none"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-5"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 170 C70 170 5 120 3 70 C1 20 55 5 70 12 C85 5 139 20 137 70 C135 120 70 170 70 170Z" fill="#4C7A32"/>
              <path d="M70 170 L70 12" stroke="#2B4A1D" stroke-width="1.5" fill="none"/>
              <path d="M70 130 C50 100 22 85 8 48" stroke="#2B4A1D" stroke-width="0.8" fill="none"/>
              <path d="M70 130 C90 100 118 85 132 48" stroke="#2B4A1D" stroke-width="0.8" fill="none"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-6"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 270 C30 220 -10 140 10 70 C30 0 110 -10 140 20 C170 -10 220 20 200 80 C180 160 150 240 110 270Z" fill="#2B4A1D"/>
            </svg>`,
          }}
        />
        <div
          className="leaf leaf-7"
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 125 C50 125 5 90 3 50 C1 10 35 2 50 8 C65 2 99 10 97 50 C95 90 50 125 50 125Z" fill="#4C7A32"/>
              <path d="M50 125 L50 8" stroke="#2B4A1D" stroke-width="1" fill="none"/>
            </svg>`,
          }}
        />

        {/* Floating spice particles */}
        <div
          className="float-item"
          style={{ left: '15%', bottom: 0, animationDuration: '18s', animationDelay: '0s' }}
          dangerouslySetInnerHTML={{
            __html: `<svg width="28" height="28" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 55 C10 45 5 30 8 15 C11 5 20 2 20 2 C20 2 29 5 32 15 C35 30 30 45 20 55Z" fill="#9B4F1A" stroke="#7A3D14" stroke-width="1.5"/>
              <path d="M20 2 C18 -4 22 -6 25 -2" stroke="#2B4A1D" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>`,
          }}
        />
        <div
          className="float-item"
          style={{ left: '55%', bottom: 0, animationDuration: '22s', animationDelay: '-6s' }}
          dangerouslySetInnerHTML={{
            __html: `<svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="12" fill="#C8784A" stroke="#9B4F1A" stroke-width="1.5"/>
              <circle cx="25" cy="25" r="5" fill="#7A3D14" opacity="0.6"/>
            </svg>`,
          }}
        />
        <div
          className="float-item"
          style={{ left: '78%', bottom: 0, animationDuration: '14s', animationDelay: '-3s' }}
          dangerouslySetInnerHTML={{
            __html: `<svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 5 L30 18 L44 18 L33 27 L37 40 L25 32 L13 40 L17 27 L6 18 L20 18 Z" fill="none" stroke="#4C7A32" stroke-width="1.5"/>
              <circle cx="25" cy="25" r="4" fill="#4C7A32" opacity="0.5"/>
            </svg>`,
          }}
        />
        <div
          className="float-item"
          style={{ left: '32%', bottom: 0, animationDuration: '19s', animationDelay: '-9s' }}
          dangerouslySetInnerHTML={{
            __html: `<svg width="26" height="36" viewBox="0 0 30 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="15" cy="30" rx="10" ry="18" fill="#8AB56A" stroke="#4C7A32" stroke-width="1.2" opacity="0.8"/>
              <path d="M15 12 C12 5 18 2 20 6" stroke="#2B4A1D" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>`,
          }}
        />
      </div>

      <div className="wrapper">

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="hero" id="home">
          <div className="hero-blob"></div>
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-pill">Est. 2020</span>
              <span className="eyebrow-dash"></span>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Pure &amp; Natural
              </span>
            </div>
            <h1 className="hero-title">
              <em>Authentic</em> Flavours
              <span className="line2">From the Spice Garden</span>
            </h1>

            {/* Tablet-only showcase */}
            <div className="hero-showcase-sm">
              <div className="sm-item">
                <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M65 110 C40 100 20 78 20 55 C20 35 40 20 65 20 C90 20 110 35 110 55 C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" strokeWidth="2"/>
                  <circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" strokeWidth="2"/>
                  <circle cx="65" cy="60" r="7" fill="#8B3A14" opacity="0.6"/>
                </svg>
              </div>
              <div className="sm-item">
                <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 75 C18 62 22 44 35 35 C48 26 58 36 68 33 C78 30 90 18 102 25 C116 33 118 53 110 65 C98 80 78 75 62 72 C46 69 35 90 25 75Z" fill="#D4B483" stroke="#A8885A" strokeWidth="2"/>
                  <path d="M52 34 C50 22 58 14 64 20" stroke="#A8885A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <div className="sm-item">
                <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M65 100 C45 96 28 78 28 58 C28 38 44 22 65 22 C86 22 102 38 102 58 C102 78 85 96 65 100Z" fill="#E8C84A" stroke="#C8A830" strokeWidth="2"/>
                  <path d="M55 22 C52 10 56 4 60 8 C58 0 64 -2 65 4 C66 -2 72 0 70 8 C74 4 78 10 75 22" fill="none" stroke="#2B4A1D" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <p className="hero-desc">
              Handpicked masalas, stone-ground spice powders, and sun-dried fruits — crafted
              with generations of Bengali culinary wisdom and delivered to your doorstep.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn-primary">
                Explore Products
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#story" className="btn-outline">Our Story</a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <div className="trust-num">11+</div>
                <div className="trust-label">Products</div>
              </div>
              <div className="trust-item">
                <div className="trust-num">100%</div>
                <div className="trust-label">Natural</div>
              </div>
              <div className="trust-item">
                <div className="trust-num">2K+</div>
                <div className="trust-label">Customers</div>
              </div>
            </div>
          </div>

          {/* Hero Right — Desktop Showcase */}
          <div className="hero-right">
            <div className="hero-showcase">
              <div className="deco-ring"></div>
              <div className="deco-ring deco-ring-2"></div>

              {/* Center product jar */}
              <div
                className="showcase-center"
                dangerouslySetInnerHTML={{
                  __html: `<svg viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="70" width="100" height="130" rx="12" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/>
                    <path d="M40 90 C40 70 55 65 90 65 C125 65 140 70 140 90" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/>
                    <rect x="62" y="42" width="56" height="26" rx="6" fill="#E5DDD0" stroke="#B5A48C" stroke-width="1.5"/>
                    <rect x="55" y="30" width="70" height="16" rx="6" fill="#2B4A1D"/>
                    <rect x="60" y="35" width="60" height="6" rx="3" fill="#4C7A32" opacity="0.5"/>
                    <rect x="54" y="95" width="72" height="85" rx="6" fill="white" opacity="0.7"/>
                    <path d="M90 140 C90 140 72 130 70 118 C68 106 78 102 82 104 C78 96 88 92 90 96 C92 92 102 96 98 104 C102 102 112 106 110 118 C108 130 90 140 90 140Z" fill="#4C7A32" opacity="0.6"/>
                    <path d="M90 140 L90 96" stroke="#2B4A1D" stroke-width="0.8" opacity="0.5"/>
                    <text x="90" y="158" font-family="serif" font-size="8" fill="#2B4A1D" text-anchor="middle" opacity="0.7" font-style="italic">Zestopia</text>
                    <text x="90" y="170" font-family="sans-serif" font-size="5.5" fill="#7C6A54" text-anchor="middle" letter-spacing="2" opacity="0.6">MASALA</text>
                    <rect x="40" y="150" width="100" height="50" rx="0 0 12 12" fill="#C8784A" opacity="0.12"/>
                  </svg>`,
                }}
              />

              {/* Orbit items */}
              <div className="orbit-item orbit-1" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 120 C28 100 18 70 22 42 C26 18 42 10 50 12 C58 10 74 18 78 42 C82 70 72 100 50 120Z" fill="#C84B2A" stroke="#9B3420" stroke-width="2"/>
                <path d="M50 12 C47 0 55 -4 58 2" stroke="#2B4A1D" stroke-width="3" stroke-linecap="round" fill="none"/>
                <path d="M42 40 C44 55 52 70 50 90" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              </svg>` }} />

              <div className="orbit-item orbit-2" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 50 Q50 72 85 50" fill="#C8784A" stroke="#9B4F1A" stroke-width="1.5"/>
                <ellipse cx="50" cy="50" rx="35" ry="10" fill="#E8A070" stroke="#C8784A" stroke-width="1.5"/>
                <path d="M25 50 Q50 25 75 50" fill="#D98B58" stroke="none"/>
                <ellipse cx="50" cy="50" rx="25" ry="7" fill="#E8A070" opacity="0.5"/>
              </svg>` }} />

              <div className="orbit-item orbit-3" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 60 C15 50 18 35 30 28 C42 21 48 30 55 28 C62 26 70 15 80 20 C92 26 95 42 88 52 C78 65 62 60 50 58 C38 56 28 72 20 60Z" fill="#D4B483" stroke="#A8885A" stroke-width="1.8"/>
                <path d="M40 28 C38 18 45 12 50 16" stroke="#A8885A" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M60 27 C62 18 70 14 72 20" stroke="#A8885A" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              </svg>` }} />

              <div className="orbit-item orbit-4" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="45" cy="45" r="30" fill="none" stroke="#C8924A" stroke-width="1.5" stroke-dasharray="5 4"/>
                <circle cx="45" cy="45" r="20" fill="#E8C84A" stroke="#C8A830" stroke-width="1.5"/>
                <circle cx="45" cy="45" r="10" fill="#D4A820" stroke="#B89020" stroke-width="1"/>
                <line x1="45" y1="15" x2="45" y2="75" stroke="#C8924A" stroke-width="0.8" opacity="0.4"/>
                <line x1="15" y1="45" x2="75" y2="45" stroke="#C8924A" stroke-width="0.8" opacity="0.4"/>
              </svg>` }} />

              <div className="orbit-item orbit-5" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(40,40)">
                  <g><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(45)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(90)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(135)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(180)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(225)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(270)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <g transform="rotate(315)"><path d="M0 -28 C3 -18 3 -8 0 0 C-3 -8 -3 -18 0 -28Z" fill="#8B5A2B"/></g>
                  <circle r="7" fill="#6B3D18" stroke="#4A2810" stroke-width="1"/>
                </g>
              </svg>` }} />
            </div>
          </div>
        </section>

        {/* ═══════════════ TICKER ═══════════════ */}
        <div className="ticker">
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span className="ticker-item" key={i}>
                <span className="ticker-sep"></span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════ CATEGORIES ═══════════════ */}
        <section className="categories" id="categories">
          <div className="sec-row reveal">
            <div>
              <div className="sec-label"><span>Browse</span></div>
              <h2 className="sec-heading">
                Shop by <em>Category</em>
              </h2>
            </div>
            <a href="#products" className="link-arrow">
              All Products{' '}
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="cat-grid">
            <div className="cat-card reveal" onClick={() => filterProds('masala')}>
              <svg className="cat-illo" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="62" rx="28" ry="10" fill="#EDE6DA" stroke="#B5A48C" strokeWidth="1.5"/>
                <path d="M14 55 Q12 40 16 30 Q20 20 40 20 Q60 20 64 30 Q68 40 66 55Z" fill="#F0EAE0" stroke="#B5A48C" strokeWidth="1.8"/>
                <ellipse cx="40" cy="55" rx="26" ry="8" fill="#EDE6DA" stroke="#B5A48C" strokeWidth="1.5"/>
                <ellipse cx="40" cy="50" rx="18" ry="5" fill="#C8784A" opacity="0.35"/>
                <path d="M58 18 L70 10" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="60" cy="22" rx="7" ry="5" transform="rotate(-30 60 22)" fill="#B5A48C" stroke="#8B785A" strokeWidth="1.5"/>
              </svg>
              <div className="cat-name">Curry Masalas</div>
              <div className="cat-sub">Rich blended spice mixes</div>
              <div className="cat-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                5 Products
              </div>
            </div>

            <div className="cat-card reveal d1" onClick={() => filterProds('spice')}>
              <svg className="cat-illo" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 70 C40 70 12 55 10 35 C8 15 25 8 32 12 C28 6 36 2 40 6 C44 2 52 6 48 12 C55 8 72 15 70 35 C68 55 40 70 40 70Z" fill="#8AB56A" stroke="#4C7A32" strokeWidth="1.8"/>
                <path d="M40 70 L40 6" stroke="#2B4A1D" strokeWidth="1.5" fill="none"/>
                <path d="M40 55 C28 44 16 38 11 25" stroke="#2B4A1D" strokeWidth="0.8" fill="none"/>
                <path d="M40 55 C52 44 64 38 69 25" stroke="#2B4A1D" strokeWidth="0.8" fill="none"/>
                <circle cx="20" cy="68" r="4" fill="#D4B483" opacity="0.6"/>
                <circle cx="32" cy="73" r="3" fill="#C8784A" opacity="0.5"/>
                <circle cx="48" cy="73" r="3.5" fill="#D4B483" opacity="0.6"/>
                <circle cx="60" cy="68" r="4" fill="#C8784A" opacity="0.5"/>
              </svg>
              <div className="cat-name">Single Spices</div>
              <div className="cat-sub">Pure powders & whole spices</div>
              <div className="cat-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                2 Products
              </div>
            </div>

            <div className="cat-card reveal d2" onClick={() => filterProds('dry')}>
              <svg className="cat-illo" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="65" rx="30" ry="10" fill="#EDE6DA" stroke="#B5A48C" strokeWidth="1.5"/>
                <path d="M22 55 C22 45 28 36 38 35 C30 32 26 26 32 22 C38 18 46 22 46 28 C52 26 58 30 58 38 C58 48 52 56 40 58 C30 60 22 65 22 55Z" fill="#E8C4A0" stroke="#C8924A" strokeWidth="1.5"/>
                <circle cx="40" cy="40" r="5" fill="#D4884A" stroke="#A86030" strokeWidth="1"/>
                <ellipse cx="27" cy="62" rx="5" ry="3" transform="rotate(-20 27 62)" fill="#8B5A2B" opacity="0.7"/>
                <ellipse cx="52" cy="64" rx="4" ry="2.5" transform="rotate(15 52 64)" fill="#8B5A2B" opacity="0.6"/>
              </svg>
              <div className="cat-name">Dried Fruits & Snacks</div>
              <div className="cat-sub">Sun-dried natural snacks</div>
              <div className="cat-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                3 Products
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PRODUCTS ═══════════════ */}
        <section className="products" id="products">
          <div className="sec-row reveal">
            <div>
              <div className="sec-label"><span>Our Range</span></div>
              <h2 className="sec-heading">
                Featured <em>Products</em>
              </h2>
            </div>
            <a href="#" className="link-arrow">
              View All{' '}
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>

          {/* Filter buttons */}
          <div className="filter-row">
            {[
              { key: 'all',    label: 'All' },
              { key: 'masala', label: 'Curry Masalas' },
              { key: 'spice',  label: 'Single Spices' },
              { key: 'dry',    label: 'Dried Fruits' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filt${activeFilter === key ? ' on' : ''}`}
                onClick={() => filterProds(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="prod-grid">
            {filteredProds.map((p, i) => {
              const delay = ['', 'd1', 'd2'][i % 3]
              const catLabel =
                p.cat === 'masala'
                  ? 'Curry Masala'
                  : p.cat === 'spice'
                  ? 'Single Spice'
                  : 'Dried Fruit & Snack'
              return (
                <div key={p.id} className={`prod-card reveal ${delay}`}>
                  <div className="prod-img">
                    {badgeMark(p.badge)}
                    <div
                      className={`wish${wished.has(p.id) ? ' on' : ''}`}
                      onClick={() => toggleWish(p.id)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </div>
                    <div
                      className="prod-img-inner"
                      dangerouslySetInnerHTML={{ __html: ILLOS[p.illo] || '' }}
                    />
                  </div>
                  <div className="prod-body">
                    <div className="prod-cat">{catLabel}</div>
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-bn">{p.bn}</div>
                    <div className="prod-desc">{p.desc}</div>
                    <div className="prod-foot">
                      <div>
                        <div className="prod-price">
                          {p.price}
                          <span className="prod-unit"> / pack</span>
                        </div>
                      </div>
                      <button className="btn-cart" onClick={() => addToCart(p.name)}>
                        <svg viewBox="0 0 24 24">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════ STORY / PROMISE ═══════════════ */}
        <div className="story" id="story">
          <div className="story-left">
            <div className="sec-label reveal"><span>Our Heritage</span></div>
            <h2 className="story-title reveal">
              Where <em>Tradition</em>
              <br />Meets Purity
            </h2>
            <p className="story-text reveal">
              Every product at Zestopia is a labour of love — sourced from trusted farmers,
              ground in small batches, and packed with care to preserve freshness. Our recipes
              are rooted in generations of authentic Bengali cooking.
            </p>
            <div className="reveal">
              <a href="#" className="btn-primary">
                Discover Our Story
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="story-right">
            <div className="sec-label"><span>Our Promise</span></div>
            <h3 className="story-right-title">
              The <em>Zestopia</em> Guarantee
            </h3>
            <ul className="promise-list">
              {[
                {
                  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
                  title: 'Farm-Direct Sourcing',
                  desc: 'We partner directly with local farmers — shorter supply chain, fresher product.',
                },
                {
                  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
                  title: 'Purity Guaranteed',
                  desc: 'No artificial colors, no fillers. Every batch is quality-checked before packaging.',
                },
                {
                  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
                  title: 'Eco-Conscious Packaging',
                  desc: 'Sustainable, resealable packs that keep your spices fresh and reduce waste.',
                },
                {
                  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
                  title: 'Nationwide Delivery',
                  desc: 'Airtight, safe packaging shipped to every corner of Bangladesh.',
                },
              ].map((item, i) => (
                <li key={i}>
                  <div className="p-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  <div className="p-text">
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══════════════ WHY ═══════════════ */}
        <section className="why">
          <div className="sec-row reveal">
            <div>
              <div className="sec-label"><span>Our Advantage</span></div>
              <h2 className="sec-heading">
                Why Choose <em>Zestopia</em>
              </h2>
            </div>
          </div>
          <div className="why-grid">
            {[
              {
                n: '01',
                icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44 C24 44 6 34 5 20 C4 6 16 2 20 5 C16 0 24 -2 24 4 C24 -2 32 0 28 5 C32 2 44 6 43 20 C42 34 24 44 24 44Z" fill="#8AB56A" stroke="#4C7A32" stroke-width="1.5"/><path d="M24 44 L24 4" stroke="#2B4A1D" stroke-width="1.2" fill="none"/></svg>`,
                title: '100% Organic',
                desc: 'All our spices and dried fruits are organically grown — free from pesticides and artificial additives.',
                delay: '',
              },
              {
                n: '02',
                icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4 L28 16 L41 16 L31 24 L35 36 L24 28 L13 36 L17 24 L7 16 L20 16 Z" fill="none" stroke="#C8784A" stroke-width="2" stroke-linejoin="round"/><path d="M24 4 L28 16 L41 16 L31 24 L35 36 L24 28 L13 36 L17 24 L7 16 L20 16 Z" fill="#C8784A" opacity="0.15"/></svg>`,
                title: 'Premium Quality',
                desc: 'Rigorous quality checks at every step ensure only the finest products reach your kitchen, batch after batch.',
                delay: 'd1',
              },
              {
                n: '03',
                icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="16" width="36" height="26" rx="4" fill="none" stroke="#2B4A1D" stroke-width="2"/><path d="M6 22h36" stroke="#2B4A1D" stroke-width="1.5"/><path d="M16 10 L16 20M32 10 L32 20" stroke="#2B4A1D" stroke-width="2" stroke-linecap="round"/><path d="M15 32 L20 37 L33 26" stroke="#4C7A32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                title: 'Fast Delivery',
                desc: 'Same-day dispatch for orders placed before 2 PM. Nationwide delivery with safe, tamper-proof packaging.',
                delay: 'd2',
              },
              {
                n: '04',
                icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4 C16 4 10 10 10 18 C10 28 18 36 24 42 C30 36 38 28 38 18 C38 10 32 4 24 4Z" fill="none" stroke="#9B4F1A" stroke-width="2"/><path d="M24 4 C16 4 10 10 10 18 C10 28 18 36 24 42 C30 36 38 28 38 18 C38 10 32 4 24 4Z" fill="#9B4F1A" opacity="0.12"/><path d="M18 18 L22 22 L30 14" stroke="#9B4F1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                title: 'Expert Support',
                desc: 'Our culinary experts are available 7 days a week to help you find the perfect spice for any recipe.',
                delay: 'd3',
              },
            ].map((card) => (
              <div key={card.n} className={`why-card reveal ${card.delay}`}>
                <div className="why-n">{card.n}</div>
                <div className="why-icon" dangerouslySetInnerHTML={{ __html: card.icon }} />
                <div className="why-t">{card.title}</div>
                <div className="why-d">{card.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="testi" id="testi">
          <div className="sec-row reveal">
            <div>
              <div className="sec-label"><span>Reviews</span></div>
              <h2 className="sec-heading">
                Voices of <em>Trust</em>
              </h2>
            </div>
          </div>
          <div className="testi-grid">
            {[
              {
                q: '"The Murgir Mangshor Masala transformed my Sunday cooking. The aroma alone is incredible — nothing like store-bought blends. My whole family was amazed!"',
                name: 'Rashida Begum', loc: 'Dhaka', init: 'R', delay: '',
              },
              {
                q: '"Ordered the Dry Apple and Dry Anarosh — the packaging is so premium, I gifted them to friends. The freshness is unbelievable for dried fruit. Will keep ordering!"',
                name: 'Karim Chowdhury', loc: 'Chittagong', init: 'K', delay: 'd1',
              },
              {
                q: '"The Amchoor Powder is exactly what my chaat recipes needed — pure tang with no artificial bite. Zestopia has become my only source for quality spices."',
                name: 'Sultana Noor', loc: 'Sylhet', init: 'S', delay: 'd2',
              },
            ].map((t, i) => (
              <div key={i} className={`testi-card reveal ${t.delay}`}>
                <div className="testi-stars">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>
                <p className="testi-q">{t.q}</p>
                <div className="testi-author">
                  <div className="testi-av">{t.init}</div>
                  <div>
                    <div className="testi-n">{t.name}</div>
                    <div className="testi-l">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ NEWSLETTER ═══════════════ */}
        <section className="nl" id="nl">
          <div className="nl-inner reveal">
            <div className="sec-label" style={{ justifyContent: 'center' }}>
              <span>Newsletter</span>
            </div>
            <h2 className="nl-heading">
              Join the <em>Zestopia</em> Family
            </h2>
            <p className="nl-sub">
              Exclusive recipes, new launches, seasonal offers and spice stories — straight to
              your inbox. No spam, ever.
            </p>
            <div className="nl-form">
              <input
                className="nl-input"
                type="email"
                ref={nlEmailRef}
                placeholder="Your email address…"
              />
              <button className="nl-submit" onClick={handleNl}>
                Subscribe
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* ═══ TOAST ═══ */}
      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}