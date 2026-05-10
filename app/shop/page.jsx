'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './shop.css'

/* ══ PRODUCT ILLUSTRATIONS ══ */
const ILLOS = {
  masala_aludom: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="100" rx="48" ry="16" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><path d="M20 90Q18 68 22 52Q28 32 65 30Q102 32 108 52Q112 68 110 90Z" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/><ellipse cx="65" cy="90" rx="45" ry="14" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><ellipse cx="65" cy="82" rx="30" ry="8" fill="#C8784A" opacity=".3"/><path d="M88 28L105 16" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><ellipse cx="92" cy="35" rx="12" ry="8" transform="rotate(-30 92 35)" fill="#D4B483" stroke="#A8885A" stroke-width="2"/><text x="65" y="70" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Alur Dom</text></svg>`,
  masala_achar: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="35" width="70" height="85" rx="10" fill="#F5EFE6" stroke="#C8B898" stroke-width="2"/><path d="M30 60L100 60" stroke="#C8B898" stroke-width="1"/><rect x="42" y="20" width="46" height="20" rx="5" fill="#DDD0BC" stroke="#C8B898" stroke-width="1.5"/><rect x="38" y="12" width="54" height="12" rx="5" fill="#2B4A1D"/><rect x="50" y="48" width="30" height="30" rx="4" fill="white" opacity=".6"/><path d="M65 56C60 56 55 60 55 65C55 72 65 78 65 78C65 78 75 72 75 65C75 60 70 56 65 56Z" fill="#9B4F1A" opacity=".7"/><text x="65" y="100" font-family="serif" font-size="8" fill="#7C6A54" text-anchor="middle" font-style="italic">Achar</text></svg>`,
  masala_chicken: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 110C40 100 20 78 20 55C20 35 40 20 65 20C90 20 110 35 110 55C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" stroke-width="2"/><path d="M65 95C48 88 35 74 35 58C35 44 48 33 65 33C82 33 95 44 95 58C95 74 82 88 65 95Z" fill="#D4A882" stroke="#B8844A" stroke-width="1.5"/><circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" stroke-width="2"/><circle cx="65" cy="60" r="7" fill="#8B3A14" opacity=".6"/><text x="65" y="120" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Murgir Mangshor</text></svg>`,
  masala_mutton: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 108C40 98 18 76 18 53C18 33 38 18 65 18C92 18 112 33 112 53C112 76 90 98 65 108Z" fill="#D4A882" stroke="#A87848" stroke-width="2"/><path d="M65 92C47 85 33 71 33 56C33 43 47 32 65 32C83 32 97 43 97 56C97 71 83 85 65 92Z" fill="#C89464" stroke="#A87848" stroke-width="1.5"/><circle cx="65" cy="58" r="16" fill="#9B5A2A" stroke="#7A3D18" stroke-width="2"/><circle cx="65" cy="58" r="7" fill="#5C2810" opacity=".7"/><text x="65" y="118" font-family="serif" font-size="7" fill="#7C6A54" text-anchor="middle" font-style="italic">Khashir Mangshor</text></svg>`,
  masala_beef: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 108C38 96 16 73 16 50C16 30 36 16 65 16C94 16 114 30 114 50C114 73 92 96 65 108Z" fill="#C89464" stroke="#9B6A38" stroke-width="2"/><path d="M65 90C46 82 32 68 32 53C32 41 46 30 65 30C84 30 98 41 98 53C98 68 84 82 65 90Z" fill="#B48050" stroke="#9B6A38" stroke-width="1.5"/><circle cx="65" cy="55" r="18" fill="#7A3418" stroke="#5C2410" stroke-width="2"/><circle cx="65" cy="55" r="8" fill="#3A1408" opacity=".7"/><text x="65" y="119" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Gorur Mangshor</text></svg>`,
  spice_amchoor: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 18C65 18 25 30 18 60C12 85 30 108 65 112C100 108 118 85 112 60C105 30 65 18 65 18Z" fill="#E8D4A0" stroke="#C8A848" stroke-width="2"/><path d="M65 32C65 32 38 42 34 62C30 80 42 98 65 100C88 98 100 80 96 62C92 42 65 32 65 32Z" fill="#D4BC80" stroke="#B89840" stroke-width="1.5"/><path d="M65 18C62 8 68 4 70 10" stroke="#2B4A1D" stroke-width="3" stroke-linecap="round" fill="none"/><text x="65" y="90" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Amchoor</text></svg>`,
  spice_ginger: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 75C18 62 22 44 35 35C48 26 58 36 68 33C78 30 90 18 102 25C116 33 118 53 110 65C98 80 78 75 62 72C46 69 35 90 25 75Z" fill="#D4B483" stroke="#A8885A" stroke-width="2"/><path d="M52 34C50 22 58 14 64 20" stroke="#A8885A" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M78 32C80 20 90 16 92 24" stroke="#A8885A" stroke-width="2" stroke-linecap="round" fill="none"/><text x="65" y="110" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Ada Powder</text></svg>`,
  dry_banana: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 95C20 80 20 55 30 40C40 25 58 20 72 28C86 36 95 55 88 72C82 88 65 98 48 97C40 97 35 100 30 95Z" fill="#E8D878" stroke="#C8B440" stroke-width="2"/><path d="M70 28C74 18 82 14 86 20" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/><ellipse cx="95" cy="88" rx="18" ry="12" transform="rotate(-20 95 88)" fill="#D4B483" stroke="#A8885A" stroke-width="1.5"/><text x="60" y="118" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Kola o Badam Bite</text></svg>`,
  dry_pineapple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 100C45 96 28 78 28 58C28 38 44 22 65 22C86 22 102 38 102 58C102 78 85 96 65 100Z" fill="#E8C84A" stroke="#C8A830" stroke-width="2"/><path d="M45 58L65 38L85 58L65 78Z" fill="none" stroke="#B89820" stroke-width="1" opacity=".5"/><path d="M55 22C52 10 56 4 60 8C58 0 64-2 65 4C66-2 72 0 70 8C74 4 78 10 75 22" fill="none" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round"/><text x="65" y="115" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Anarosh</text></svg>`,
  dry_apple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="65" cy="68" r="45" fill="#F5D8C0" stroke="#E8A87A" stroke-width="2"/><circle cx="65" cy="68" r="32" fill="#F0CAAA" stroke="#E8A87A" stroke-width="1.5" stroke-dasharray="5 4" opacity=".6"/><circle cx="65" cy="68" r="12" fill="#D48A5A" stroke="#B8643A" stroke-width="2"/><line x1="65" y1="23" x2="65" y2="113" stroke="#D4884A" stroke-width=".8" opacity=".4"/><line x1="20" y1="68" x2="110" y2="68" stroke="#D4884A" stroke-width=".8" opacity=".4"/><path d="M65 23C62 12 68 8 70 14" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/><text x="65" y="125" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Apple</text></svg>`,
}

/* ══ PRODUCT DATA ══ */
const PRODS = [
  { id:1,  name:'Alur Dom Masala',         bn:'আলুর দম মশলা',           cat:'masala', desc:'Aromatic potato curry blend with whole spices — the secret behind a perfect Alur Dom.',     price:145, illo:'masala_aludom',  badge:'bestseller', rating:5,   reviews:48 },
  { id:2,  name:'Achar Masala',            bn:'আচার মশলা',              cat:'masala', desc:'Tangy, zesty pickle spice mix for the most flavorful homemade achars and chutneys.',       price:130, illo:'masala_achar',   badge:'new',        rating:4.5, reviews:22 },
  { id:3,  name:'Murgir Mangshor Masala',  bn:'মুরগির মাংসের মশলা',     cat:'masala', desc:'Rich, fragrant chicken curry masala with 18 premium spices — bold and deeply authentic.',   price:160, illo:'masala_chicken', badge:'hot',        rating:5,   reviews:87 },
  { id:4,  name:'Khashir Mangshor Masala', bn:'খাশির মাংসের মশলা',      cat:'masala', desc:'Deep, warming mutton curry blend crafted for special occasions and festive cooking.',      price:175, illo:'masala_mutton',  badge:'',           rating:4.5, reviews:34 },
  { id:5,  name:'Gorur Mangshor Masala',   bn:'গরুর মাংসের মশলা',       cat:'masala', desc:'Bold beef curry masala — a Bengali kitchen staple for hearty, slow-cooked curries.',      price:175, illo:'masala_beef',    badge:'',           rating:4,   reviews:29 },
  { id:6,  name:'Amchoor Powder',          bn:'আমচুর পাউডার',           cat:'spice',  desc:'Sun-dried green mango powder adding natural tang and bright depth to every dish.',         price:120, illo:'spice_amchoor',  badge:'new',        rating:4.5, reviews:19 },
  { id:7,  name:'Ada Powder',              bn:'আদা পাউডার',             cat:'spice',  desc:'Pure stone-ground ginger powder — warming, digestive, and intensely fragrant.',            price:110, illo:'spice_ginger',   badge:'',           rating:4,   reviews:15 },
  { id:8,  name:'Dry Kola o Badam Bite',   bn:'শুকনো কলা ও বাদাম বাইট', cat:'dry',   desc:'Crispy dried banana and almond bites — a nutritious, energy-packed premium snack.',      price:190, illo:'dry_banana',     badge:'hot',        rating:5,   reviews:56 },
  { id:9,  name:'Dry Anarosh',             bn:'শুকনো আনারস',            cat:'dry',    desc:'Sweet and chewy sun-dried pineapple — tropical goodness with zero preservatives.',         price:165, illo:'dry_pineapple',  badge:'fresh',      rating:4.5, reviews:31 },
  { id:10, name:'Dry Apple',               bn:'শুকনো আপেল',             cat:'dry',    desc:'Crispy dehydrated apple slices — perfect for snacking, baking, or gifting.',              price:180, illo:'dry_apple',      badge:'fresh',      rating:5,   reviews:42 },
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

const CATS = [
  { key:'all',    label:'All Products',       count:10 },
  { key:'masala', label:'Curry Masalas',      count:5  },
  { key:'spice',  label:'Single Spices',      count:2  },
  { key:'dry',    label:'Dried Fruits & Snacks', count:3 },
]

const BADGES_CONFIG = [
  { key:'new',  label:'New Arrivals',  color:'var(--green)'  },
  { key:'hot',  label:'Popular',       color:'var(--spice)'  },
  { key:'fresh',label:'Fresh Stock',   color:'#5C8A3A'       },
  { key:'best', label:'Best Seller',   color:'var(--brown)'  },
]

/* ══ HELPERS ══ */
function catLabel(c) {
  return c === 'masala' ? 'Curry Masala' : c === 'spice' ? 'Single Spice' : 'Dried Fruit & Snack'
}

function badgeMeta(b) {
  const map = { bestseller:['badge-bs-shop','Best Seller'], new:['badge-new-shop','New'], hot:['badge-hot-shop','Popular'], fresh:['badge-fr-shop','Fresh'] }
  return map[b] || null
}

function StarRow({ rating, reviews }) {
  const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  return (
    <div className="prod-stars-shop">
      {[1,2,3,4,5].map(i => {
        const cls = i <= Math.floor(rating) ? 'star-full' : i - rating < 1 ? 'star-half' : 'star-empty'
        return <svg key={i} className={cls} viewBox="0 0 24 24"><path d={starPath}/></svg>
      })}
      <span className="review-count-shop">({reviews})</span>
    </div>
  )
}

function getFiltered(prods, state) {
  let d = [...prods]
  if (state.cat !== 'all') d = d.filter(p => p.cat === state.cat)
  if (state.badges.length) d = d.filter(p =>
    state.badges.some(b => {
      if (b === 'new')  return p.badge === 'new'
      if (b === 'hot')  return p.badge === 'hot'
      if (b === 'fresh') return p.badge === 'fresh'
      if (b === 'best') return p.badge === 'bestseller'
      return false
    })
  )
  d = d.filter(p => p.price >= state.minP && p.price <= state.maxP)
  if (state.sort === 'price-asc')  d.sort((a,b) => a.price - b.price)
  if (state.sort === 'price-desc') d.sort((a,b) => b.price - a.price)
  if (state.sort === 'name-asc')   d.sort((a,b) => a.name.localeCompare(b.name))
  return d
}

/* ══ MAIN PAGE ══ */
export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0)
  const [wished, setWished]       = useState(new Set())
  const [view, setView]           = useState('grid')       // 'grid' | 'list'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast]         = useState({ msg:'', show:false })
  const toastTimer                = useRef(null)

  const [state, setState] = useState({
    cat:'all', badges:[], minP:0, maxP:300, sort:'default'
  })
  // Separate draft for inputs before "Apply"
  const [draft, setDraft] = useState({ minP:0, maxP:300 })

  const filtered = getFiltered(PRODS, state)

  /* ── Toast ── */
  const showToast = useCallback((msg) => {
    setToast({ msg, show:true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({...t, show:false})), 2600)
  }, [])

  /* ── Cart ── */
  const addCart = (name) => { setCartCount(c => c+1); showToast(`${name} added to cart`) }

  /* ── Wishlist ── */
  const toggleWish = (id) => {
    setWished(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Removed from wishlist') }
      else              { next.add(id);    showToast('Saved to wishlist ♥')   }
      return next
    })
  }

  /* ── Category ── */
  const setCat = (cat) => setState(s => ({...s, cat}))

  /* ── Badges ── */
  const toggleBadge = (key) => {
    setState(s => ({
      ...s,
      badges: s.badges.includes(key) ? s.badges.filter(b => b !== key) : [...s.badges, key]
    }))
  }

  /* ── Price apply ── */
  const applyPrice = () => setState(s => ({...s, minP: draft.minP, maxP: draft.maxP}))

  /* ── Sort ── */
  const setSort = (sort) => setState(s => ({...s, sort}))

  /* ── Clear all ── */
  const clearAll = () => {
    setState({ cat:'all', badges:[], minP:0, maxP:300, sort:'default' })
    setDraft({ minP:0, maxP:300 })
  }

  /* ── Scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal-shop:not(.on)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [filtered])

  /* ── Build active filter tags ── */
  const activeTags = []
  if (state.cat !== 'all') {
    const catObj = CATS.find(c => c.key === state.cat)
    activeTags.push({ label: catObj?.label, remove: () => setCat('all') })
  }
  state.badges.forEach(b => {
    const bc = BADGES_CONFIG.find(x => x.key === b)
    activeTags.push({ label: bc?.label, remove: () => toggleBadge(b) })
  })
  if (state.minP > 0 || state.maxP < 300) {
    activeTags.push({ label:`৳${state.minP}–৳${state.maxP}`, remove:() => { setState(s => ({...s,minP:0,maxP:300})); setDraft({minP:0,maxP:300}) } })
  }

  /* ── Shared sidebar content ── */
  const SidebarContent = () => (
    <>
      {/* Categories */}
      <div className="sb-section">
        <div className="sb-title">
          Categories
          <button onClick={() => setCat('all')}>All</button>
        </div>
        <div className="cat-pills">
          {CATS.map(c => (
            <div
              key={c.key}
              className={`cat-pill${state.cat === c.key ? ' active' : ''}`}
              onClick={() => setCat(c.key)}
            >
              <span>{c.label}</span>
              <span className="cat-pill-count">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="sb-section">
        <div className="sb-title">Availability</div>
        <div className="badge-list">
          {BADGES_CONFIG.map(b => (
            <div key={b.key} className="badge-check" onClick={() => toggleBadge(b.key)}>
              <div className={`check-box${state.badges.includes(b.key) ? ' checked' : ''}`}>
                <svg viewBox="0 0 12 10"><polyline points="1,5 4,8 11,1"/></svg>
              </div>
              <div className="badge-dot" style={{ background: b.color }}></div>
              <span className="check-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="sb-section">
        <div className="sb-title">Price Range</div>
        <div className="price-inputs">
          <input
            className="price-input" type="number"
            placeholder="Min" value={draft.minP} min="0"
            onChange={e => setDraft(d => ({...d, minP: parseInt(e.target.value)||0}))}
          />
          <span className="price-sep-line">—</span>
          <input
            className="price-input" type="number"
            placeholder="Max" value={draft.maxP} max="300"
            onChange={e => setDraft(d => ({...d, maxP: parseInt(e.target.value)||300}))}
          />
        </div>
        <div className="price-info"><span>৳0</span><span>৳300</span></div>
        <button className="btn-apply" onClick={applyPrice}>Apply Filter</button>
        <button className="clear-all-btn" onClick={clearAll}>Clear All Filters</button>
      </div>
    </>
  )

  return (
    <>
      <Navbar cartCount={cartCount} onShowToast={showToast} />

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-sep"></span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── SHOP HERO ── */}
      <div className="shop-hero">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <svg className="breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span className="current">Shop</span>
        </div>
        <div className="shop-hero-inner">
          <div className="shop-hero-left">
            <div className="sec-label-shop"><span>All Products</span></div>
            <h1 className="shop-title">The <em>Complete</em> Collection</h1>
            <div className="shop-meta">
              <div className="meta-stat">
                <svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                <span><strong>{filtered.length}</strong> Products</span>
              </div>
              <div className="meta-stat">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                <span>100% <strong>Natural</strong></span>
              </div>
              <div className="meta-stat">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <span>Free shipping over <strong>৳500</strong></span>
              </div>
            </div>
          </div>
          <div className="shop-hero-right">
            <div className="sort-wrap">
              <span className="sort-label">Sort by</span>
              <select
                className="sort-select"
                value={state.sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn${view === 'grid' ? ' active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button
                className={`view-btn${view === 'list' ? ' active' : ''}`}
                onClick={() => setView('list')}
                title="List view"
              >
                <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE CONTROLS ── */}
      <div className="mobile-controls-shop">
        <button
          className={`ctrl-btn${activeTags.length > 0 ? ' has-filter' : ''}`}
          onClick={() => setDrawerOpen(true)}
        >
          <svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filter
        </button>
        <button className="ctrl-btn" onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}>
          {view === 'grid'
            ? <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          }
          View
        </button>
        <select
          className="ctrl-btn ctrl-sort"
          value={state.sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A–Z</option>
        </select>
      </div>

      {/* ── SHOP BODY ── */}
      <div className="shop-body">

        {/* SIDEBAR — desktop */}
        <aside className="sidebar">
          <SidebarContent />
        </aside>

        {/* MAIN */}
        <main className="main-area">
          <div className="results-bar">
            <div className="results-count">
              Showing <strong>{filtered.length}</strong> of <strong>{PRODS.length}</strong> products
            </div>
            <div className="active-filters">
              {activeTags.map((tag, i) => (
                <span className="filter-tag" key={i}>
                  {tag.label}
                  <button onClick={tag.remove}>
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={`prod-grid-shop${view === 'list' ? ' list-view' : ''}`}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or browsing all categories.</p>
                <button
                  className="btn-apply"
                  onClick={clearAll}
                  style={{ width:'auto', padding:'.6rem 2rem', margin:'0 auto', display:'block' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filtered.map((p, i) => {
                const bm = badgeMeta(p.badge)
                const delay = ['','sd1','sd2'][i % 3]
                return (
                  <div key={p.id} className={`prod-card-shop reveal-shop ${delay}`}>
                    <div className="prod-img-shop">
                      {bm && <span className={`prod-badge-shop ${bm[0]}`}>{bm[1]}</span>}
                      <div
                        className={`wish-shop${wished.has(p.id) ? ' on' : ''}`}
                        onClick={() => toggleWish(p.id)}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                      </div>
                      <div
                        className="prod-img-inner-shop"
                        dangerouslySetInnerHTML={{ __html: ILLOS[p.illo] || '' }}
                      />
                    </div>
                    <div className="prod-body-shop">
                      <div className="prod-cat-shop">{catLabel(p.cat)}</div>
                      <div className="prod-name-shop">{p.name}</div>
                      <div className="prod-bn-shop">{p.bn}</div>
                      <StarRow rating={p.rating} reviews={p.reviews} />
                      <div className="prod-desc-shop">{p.desc}</div>
                      <div className="prod-foot-shop">
                        <div>
                          <div className="prod-price-shop">
                            ৳{p.price}
                            <span className="prod-unit-shop"> / pack</span>
                          </div>
                        </div>
                        <button className="btn-cart-shop" onClick={() => addCart(p.name)}>
                          <svg viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination (static display) */}
          {filtered.length > 0 && (
            <div className="pagination">
              <button className="page-btn arr">
                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              {[1,2,3].map(n => (
                <button key={n} className={`page-btn${n === 1 ? ' active' : ''}`}>{n}</button>
              ))}
              <button className="page-btn arr">
                <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── FILTER DRAWER (mobile) ── */}
      <div
        className={`filter-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`filter-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-handle"></div>
        <div className="drawer-header">
          <span className="drawer-title">Filter Products</span>
          <div className="drawer-close" onClick={() => setDrawerOpen(false)}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        </div>
        <div className="drawer-body">
          <div className="drawer-sb-section">
            <div className="sb-title">Categories</div>
            <div className="cat-pills">
              {CATS.map(c => (
                <div
                  key={c.key}
                  className={`cat-pill${state.cat === c.key ? ' active' : ''}`}
                  onClick={() => setCat(c.key)}
                >
                  <span>{c.label}</span>
                  <span className="cat-pill-count">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="drawer-sb-section">
            <div className="sb-title">Availability</div>
            <div className="badge-list">
              {BADGES_CONFIG.map(b => (
                <div key={b.key} className="badge-check" onClick={() => toggleBadge(b.key)}>
                  <div className={`check-box${state.badges.includes(b.key) ? ' checked' : ''}`}>
                    <svg viewBox="0 0 12 10"><polyline points="1,5 4,8 11,1"/></svg>
                  </div>
                  <div className="badge-dot" style={{ background: b.color }}></div>
                  <span className="check-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="drawer-sb-section">
            <div className="sb-title">Price Range</div>
            <div className="price-inputs">
              <input
                className="price-input" type="number"
                placeholder="Min" value={draft.minP} min="0"
                onChange={e => setDraft(d => ({...d, minP: parseInt(e.target.value)||0}))}
              />
              <span className="price-sep-line">—</span>
              <input
                className="price-input" type="number"
                placeholder="Max" value={draft.maxP} max="300"
                onChange={e => setDraft(d => ({...d, maxP: parseInt(e.target.value)||300}))}
              />
            </div>
            <div className="price-info"><span>৳0</span><span>৳300</span></div>
          </div>
        </div>
        <div className="drawer-footer">
          <button className="clear-all-btn" onClick={() => { clearAll(); setDrawerOpen(false) }}>
            Clear All
          </button>
          <button className="btn-apply" onClick={() => { applyPrice(); setDrawerOpen(false) }}>
            Show Results
          </button>
        </div>
      </div>

      <Footer />

      {/* Toast */}
      <div className={`shop-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}