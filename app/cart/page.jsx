'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './cart.css'

/* ══ ILLUSTRATIONS ══ */
const ILLOS = {
  masala_aludom: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="100" rx="48" ry="16" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><path d="M20 90Q18 68 22 52Q28 32 65 30Q102 32 108 52Q112 68 110 90Z" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/><ellipse cx="65" cy="90" rx="45" ry="14" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><ellipse cx="65" cy="82" rx="30" ry="8" fill="#C8784A" opacity=".3"/><path d="M88 28L105 16" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><ellipse cx="92" cy="35" rx="12" ry="8" transform="rotate(-30 92 35)" fill="#D4B483" stroke="#A8885A" stroke-width="2"/><text x="65" y="70" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Alur Dom</text></svg>`,
  masala_chicken: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 110C40 100 20 78 20 55C20 35 40 20 65 20C90 20 110 35 110 55C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" stroke-width="2"/><path d="M65 95C48 88 35 74 35 58C35 44 48 33 65 33C82 33 95 44 95 58C95 74 82 88 65 95Z" fill="#D4A882" stroke="#B8844A" stroke-width="1.5"/><circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" stroke-width="2"/><circle cx="65" cy="60" r="7" fill="#8B3A14" opacity=".6"/><text x="65" y="120" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Murgir Mangshor</text></svg>`,
  masala_beef: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 108C38 96 16 73 16 50C16 30 36 16 65 16C94 16 114 30 114 50C114 73 92 96 65 108Z" fill="#C89464" stroke="#9B6A38" stroke-width="2"/><path d="M65 90C46 82 32 68 32 53C32 41 46 30 65 30C84 30 98 41 98 53C98 68 84 82 65 90Z" fill="#B48050" stroke="#9B6A38" stroke-width="1.5"/><circle cx="65" cy="55" r="18" fill="#7A3418" stroke="#5C2410" stroke-width="2"/><circle cx="65" cy="55" r="8" fill="#3A1408" opacity=".7"/><text x="65" y="119" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Gorur Mangshor</text></svg>`,
  spice_amchoor: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 18C65 18 25 30 18 60C12 85 30 108 65 112C100 108 118 85 112 60C105 30 65 18 65 18Z" fill="#E8D4A0" stroke="#C8A848" stroke-width="2"/><path d="M65 32C65 32 38 42 34 62C30 80 42 98 65 100C88 98 100 80 96 62C92 42 65 32 65 32Z" fill="#D4BC80" stroke="#B89840" stroke-width="1.5"/><path d="M65 18C62 8 68 4 70 10" stroke="#2B4A1D" stroke-width="3" stroke-linecap="round" fill="none"/><text x="65" y="90" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Amchoor</text></svg>`,
  dry_banana: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 95C20 80 20 55 30 40C40 25 58 20 72 28C86 36 95 55 88 72C82 88 65 98 48 97C40 97 35 100 30 95Z" fill="#E8D878" stroke="#C8B440" stroke-width="2"/><path d="M70 28C74 18 82 14 86 20" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/><ellipse cx="95" cy="88" rx="18" ry="12" transform="rotate(-20 95 88)" fill="#D4B483" stroke="#A8885A" stroke-width="1.5"/><text x="60" y="118" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Kola o Badam Bite</text></svg>`,
  dry_apple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="65" cy="68" r="45" fill="#F5D8C0" stroke="#E8A87A" stroke-width="2"/><circle cx="65" cy="68" r="32" fill="#F0CAAA" stroke="#E8A87A" stroke-width="1.5" stroke-dasharray="5 4" opacity=".6"/><circle cx="65" cy="68" r="12" fill="#D48A5A" stroke="#B8643A" stroke-width="2"/><path d="M65 23C62 12 68 8 70 14" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round" fill="none"/><text x="65" y="125" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Apple</text></svg>`,
  masala_achar: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="35" width="70" height="85" rx="10" fill="#F5EFE6" stroke="#C8B898" stroke-width="2"/><path d="M30 60L100 60" stroke="#C8B898" stroke-width="1"/><rect x="42" y="20" width="46" height="20" rx="5" fill="#DDD0BC" stroke="#C8B898" stroke-width="1.5"/><rect x="38" y="12" width="54" height="12" rx="5" fill="#2B4A1D"/><rect x="50" y="48" width="30" height="30" rx="4" fill="white" opacity=".6"/><path d="M65 56C60 56 55 60 55 65C55 72 65 78 65 78C65 78 75 72 75 65C75 60 70 56 65 56Z" fill="#9B4F1A" opacity=".7"/><text x="65" y="100" font-family="serif" font-size="8" fill="#7C6A54" text-anchor="middle" font-style="italic">Achar</text></svg>`,
  dry_pineapple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 100C45 96 28 78 28 58C28 38 44 22 65 22C86 22 102 38 102 58C102 78 85 96 65 100Z" fill="#E8C84A" stroke="#C8A830" stroke-width="2"/><path d="M45 58L65 38L85 58L65 78Z" fill="none" stroke="#B89820" stroke-width="1" opacity=".5"/><path d="M55 22C52 10 56 4 60 8C58 0 64-2 65 4C66-2 72 0 70 8C74 4 78 10 75 22" fill="none" stroke="#2B4A1D" stroke-width="2.5" stroke-linecap="round"/><text x="65" y="115" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Dry Anarosh</text></svg>`,
}

/* ══ INITIAL CART DATA ══ */
const INITIAL_CART = [
  { id:1, name:'Alur Dom Masala',        bn:'আলুর দম মশলা',       cat:'masala', price:145, qty:2, illo:'masala_aludom',  badge:'bestseller' },
  { id:3, name:'Murgir Mangshor Masala', bn:'মুরগির মাংসের মশলা', cat:'masala', price:160, qty:1, illo:'masala_chicken', badge:'hot'        },
  { id:8, name:'Dry Kola o Badam Bite',  bn:'শুকনো কলা ও বাদাম বাইট', cat:'dry', price:190, qty:1, illo:'dry_banana',   badge:'hot'        },
]

const INITIAL_SAVED = [
  { id:5, name:'Gorur Mangshor Masala',  bn:'গরুর মাংসের মশলা',  cat:'masala', price:175, illo:'masala_beef'   },
  { id:6, name:'Amchoor Powder',         bn:'আমচুর পাউডার',      cat:'spice',  price:120, illo:'spice_amchoor' },
]

const RELATED = [
  { id:2,  name:'Achar Masala',    cat:'masala', price:130, illo:'masala_achar',   badge:'new'   },
  { id:9,  name:'Dry Anarosh',     cat:'dry',    price:165, illo:'dry_pineapple',  badge:'fresh' },
  { id:10, name:'Dry Apple',       cat:'dry',    price:180, illo:'dry_apple',      badge:'fresh' },
  { id:6,  name:'Amchoor Powder',  cat:'spice',  price:120, illo:'spice_amchoor',  badge:'new'   },
]

const TICKER_ITEMS = [
  'Free Shipping Over ৳500', '100% Natural — No Preservatives',
  'Stone-Ground Masalas', 'Authentic Bengali Recipes',
  'Sun-Dried Fruits & Snacks', 'Premium Airtight Packaging', 'Same-Day Dispatch',
]

const VALID_COUPONS = {
  ZEST10:  { type:'percent', value:10,  label:'10% off'   },
  SPICE20: { type:'percent', value:20,  label:'20% off'   },
  FLAT50:  { type:'flat',    value:50,  label:'৳50 off'   },
}

function catLabel(c) {
  return c === 'masala' ? 'Curry Masala' : c === 'spice' ? 'Single Spice' : 'Dried Fruit & Snack'
}

function badgeMeta(b) {
  const map = {
    bestseller: ['badge-bs-shop','Best Seller'],
    new:        ['badge-new-shop','New'],
    hot:        ['badge-hot-shop','Popular'],
    fresh:      ['badge-fr-shop','Fresh'],
  }
  return map[b] || null
}

/* ══ MAIN ══ */
export default function CartPage() {
  const [cartItems, setCartItems]   = useState(INITIAL_CART)
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED)
  const [removing, setRemoving]     = useState(null)
  const [coupon, setCoupon]         = useState('')
  const [applied, setApplied]       = useState(null) // { type, value, label }
  const [couponMsg, setCouponMsg]   = useState(null) // { ok, text }
  const [toast, setToast]           = useState({ msg:'', show:false })
  const toastTimer                  = useRef(null)

  /* ── Toast ── */
  const showToast = useCallback((msg) => {
    setToast({ msg, show:true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({...t, show:false})), 2600)
  }, [])

  /* ── Quantity ── */
  const changeQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    )
  }

  /* ── Remove ── */
  const removeItem = (id) => {
    setRemoving(id)
    setTimeout(() => {
      setCartItems(prev => prev.filter(i => i.id !== id))
      setRemoving(null)
      showToast('Item removed from cart')
    }, 320)
  }

  /* ── Save for later ── */
  const saveForLater = (id) => {
    const item = cartItems.find(i => i.id === id)
    if (!item) return
    setRemoving(id)
    setTimeout(() => {
      setCartItems(prev => prev.filter(i => i.id !== id))
      setSavedItems(prev => [...prev, item])
      setRemoving(null)
      showToast('Saved for later')
    }, 320)
  }

  /* ── Move to cart ── */
  const moveToCart = (id) => {
    const item = savedItems.find(i => i.id === id)
    if (!item) return
    setSavedItems(prev => prev.filter(i => i.id !== id))
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing) return prev.map(i => i.id === id ? {...i, qty: i.qty+1} : i)
      return [...prev, { ...item, qty:1 }]
    })
    showToast(`${item.name} moved to cart`)
  }

  /* ── Clear all ── */
  const clearCart = () => {
    setCartItems([])
    setApplied(null)
    setCoupon('')
    setCouponMsg(null)
    showToast('Cart cleared')
  }

  /* ── Add related ── */
  const addRelated = (prod) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === prod.id)
      if (ex) return prev.map(i => i.id === prod.id ? {...i, qty:i.qty+1} : i)
      return [...prev, { ...prod, qty:1, bn:'' }]
    })
    showToast(`${prod.name} added to cart`)
  }

  /* ── Coupon ── */
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (VALID_COUPONS[code]) {
      setApplied(VALID_COUPONS[code])
      setCouponMsg({ ok:true, text:`Coupon applied — ${VALID_COUPONS[code].label}` })
      showToast(`Coupon ${code} applied!`)
    } else {
      setApplied(null)
      setCouponMsg({ ok:false, text:'Invalid coupon code. Try ZEST10, SPICE20, or FLAT50.' })
    }
  }

  /* ── Totals ── */
  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping  = subtotal >= 500 ? 0 : 60
  const discount  = applied
    ? applied.type === 'percent'
      ? Math.round(subtotal * applied.value / 100)
      : Math.min(applied.value, subtotal)
    : 0
  const total     = subtotal - discount + shipping
  const freeShipGap = Math.max(0, 500 - subtotal)
  const totalQty  = cartItems.reduce((s, i) => s + i.qty, 0)

  /* ── Scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal-cart:not(.on)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [cartItems])

  return (
    <>
      <Navbar cartCount={totalQty} onShowToast={showToast} />

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

      {/* ── CART HERO ── */}
      <div className="cart-hero">
        <div className="cart-breadcrumb">
          <Link href="/">Home</Link>
          <svg className="cart-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <Link href="/shop">Shop</Link>
          <svg className="cart-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span className="crumb-current">Cart</span>
        </div>
        <div className="cart-hero-inner">
          <div>
            <div className="cart-sec-label"><span>Your Basket</span></div>
            <h1 className="cart-hero-title">
              Your <em>Cart</em>
            </h1>
            <div className="cart-hero-meta">
              <div className="cart-meta-stat">
                <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span><strong>{totalQty}</strong> Item{totalQty !== 1 ? 's' : ''}</span>
              </div>
              <div className="cart-meta-stat">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                <span>100% <strong>Natural</strong></span>
              </div>
              {shipping === 0 ? (
                <div className="cart-meta-stat">
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <span><strong style={{color:'var(--green-mid)'}}>Free shipping</strong> applied!</span>
                </div>
              ) : (
                <div className="cart-meta-stat">
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <span>Add <strong>৳{freeShipGap}</strong> more for free shipping</span>
                </div>
              )}
            </div>
          </div>
          <div className="cart-hero-right">
            <div className="cart-steps">
              <div className="step-item active">
                <div className="step-dot">1</div>
                <span>Cart</span>
              </div>
              <div className="step-sep"></div>
              <div className="step-item">
                <div className="step-dot">2</div>
                <span>Checkout</span>
              </div>
              <div className="step-sep"></div>
              <div className="step-item">
                <div className="step-dot">3</div>
                <span>Confirm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CART BODY ── */}
      <div className="cart-body">

        {cartItems.length === 0 && savedItems.length === 0 ? (

          /* ── EMPTY STATE ── */
          <div className="empty-cart reveal-cart">
            <div className="empty-cart-illo">
              <svg viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2>Your cart is <em>empty</em></h2>
            <p>
              Looks like you haven't added anything yet. Explore our premium masalas,
              spice powders, and sun-dried fruits.
            </p>
            <Link href="/shop" className="btn-empty-shop">
              Browse Products
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

        ) : (

          <>
            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Cart Items */}
              {cartItems.length > 0 && (
                <div className="cart-items-panel reveal-cart">
                  <div className="cart-panel-header">
                    <div className="cart-panel-title">
                      Cart Items ({totalQty})
                    </div>
                    <button className="clear-cart-btn" onClick={clearCart}>
                      <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                      Clear All
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`cart-item${removing === item.id ? ' removing' : ''}`}
                    >
                      {/* Image */}
                      <div className="cart-item-img">
                        <div
                          style={{ width:70, height:70 }}
                          dangerouslySetInnerHTML={{ __html: ILLOS[item.illo] || '' }}
                        />
                      </div>

                      {/* Info */}
                      <div className="cart-item-info">
                        <div className="cart-item-cat">{catLabel(item.cat)}</div>
                        <div className="cart-item-name">{item.name}</div>
                        {item.bn && <div className="cart-item-bn">{item.bn}</div>}
                        <div className="cart-item-badge">
                          <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
                          100% Natural · Airtight Pack
                        </div>
                        <div className="qty-row">
                          <div className="qty-ctrl">
                            <button
                              className="qty-btn"
                              onClick={() => changeQty(item.id, -1)}
                              disabled={item.qty <= 1}
                            >−</button>
                            <div className="qty-num">{item.qty}</div>
                            <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                          </div>
                          <button className="save-later-btn" onClick={() => saveForLater(item.id)}>
                            <svg viewBox="0 0 24 24">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                            </svg>
                            Save for Later
                          </button>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div className="cart-item-right">
                        <div>
                          <div className="cart-item-price">৳{item.price * item.qty}</div>
                          {item.qty > 1 && (
                            <div className="cart-item-unit">৳{item.price} × {item.qty}</div>
                          )}
                        </div>
                        <button className="remove-btn" onClick={() => removeItem(item.id)} title="Remove">
                          <svg viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="saved-section reveal-cart cd1">
                  <div className="saved-title">
                    Saved for Later
                    <span className="saved-count">{savedItems.length} item{savedItems.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="saved-grid">
                    {savedItems.map(item => (
                      <div key={item.id} className="saved-card">
                        <div className="saved-img">
                          <div
                            className="saved-img-inner"
                            dangerouslySetInnerHTML={{ __html: ILLOS[item.illo] || '' }}
                          />
                        </div>
                        <div className="saved-body">
                          <div className="saved-name">{item.name}</div>
                          <div className="saved-price">৳{item.price}<span style={{fontSize:'.6rem',color:'var(--muted)',fontFamily:'Jost,sans-serif',fontWeight:400}}> / pack</span></div>
                          <button className="move-to-cart-btn" onClick={() => moveToCart(item.id)}>
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── ORDER SUMMARY ── */}
            <div>
              <div className="order-summary reveal-cart cd2">
                <div className="summary-header">
                  <div className="summary-title">Order Summary</div>
                  <div className="summary-badge">{totalQty} Item{totalQty !== 1 ? 's' : ''}</div>
                </div>
                <div className="summary-body">

                  {/* Free shipping progress */}
                  {freeShipGap > 0 && (
                    <div className="upsell-strip">
                      <div className="upsell-icon">
                        <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h8m-4-4v8m-7-4l2 2 4-4"/></svg>
                      </div>
                      <div className="upsell-text">
                        Add <strong>৳{freeShipGap}</strong> more to unlock <strong>free shipping!</strong>
                      </div>
                      <div className="upsell-amt">৳60</div>
                    </div>
                  )}

                  {/* Rows */}
                  <div className="summary-row">
                    <span className="sum-label">
                      <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                      Subtotal
                    </span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span className="sum-label">
                      <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><path d="M9 21H6a2 2 0 01-2-2V11l3-3h8l4 4v5a2 2 0 01-2 2h-3"/><circle cx="16" cy="18" r="2"/><circle cx="9" cy="18" r="2"/></svg>
                      Shipping
                    </span>
                    {shipping === 0
                      ? <span className="sum-val-green">Free</span>
                      : <span>৳{shipping}</span>
                    }
                  </div>
                  {applied && (
                    <div className="summary-row">
                      <span className="sum-label">
                        <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Discount ({applied.label})
                      </span>
                      <span className="sum-val-green">−৳{discount}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <div className="sum-val">৳{total}</div>
                  </div>

                  {/* Coupon */}
                  <div className="coupon-wrap">
                    <div style={{fontSize:'.65rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--brown)',fontWeight:600,marginBottom:'.6rem'}}>
                      Coupon Code
                    </div>
                    <div className="coupon-form">
                      <input
                        className="coupon-input"
                        type="text"
                        placeholder="Enter coupon…"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponMsg(null) }}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      />
                      <button className="coupon-apply" onClick={applyCoupon}>Apply</button>
                    </div>
                    {couponMsg && (
                      <div className={`coupon-msg ${couponMsg.ok ? 'ok' : 'err'}`}>
                        {couponMsg.ok ? '✓' : '✗'} {couponMsg.text}
                      </div>
                    )}
                  </div>

                  {/* Checkout button */}
                  <Link
                    href={cartItems.length > 0 ? '/checkout' : '#'}
                    className={`btn-checkout${cartItems.length === 0 ? ' disabled' : ''}`}
                    style={{ textDecoration:'none' }}
                    onClick={e => cartItems.length === 0 && e.preventDefault()}
                  >
                    Proceed to Checkout
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  <Link href="/shop" className="btn-continue">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 12H5M12 5l-7 7 7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Continue Shopping
                  </Link>

                  <div className="secure-note">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Secure &amp; Encrypted Checkout
                  </div>

                  <div className="payment-icons">
                    <span className="pay-icon">bKash</span>
                    <span className="pay-icon">Nagad</span>
                    <span className="pay-icon">VISA</span>
                    <span className="pay-icon">MC</span>
                    <span className="pay-icon">COD</span>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── YOU MAY ALSO LIKE ── */}
      <div className="related-section">
        <div className="cart-sec-label reveal-cart"><span>Recommended</span></div>
        <h2 className="related-title reveal-cart cd1">
          You May Also <em>Like</em>
        </h2>
        <div className="related-grid">
          {RELATED.map((p, i) => {
            const bm = badgeMeta(p.badge)
            const delay = ['','cd1','cd2','cd3'][i % 4]
            return (
              <div key={p.id} className={`related-card reveal-cart ${delay}`}>
                <div className="related-img">
                  {bm && <span className={`prod-badge-shop ${bm[0]}`} style={{position:'absolute',top:'1rem',left:'1rem',fontSize:'.54rem'}}>{bm[1]}</span>}
                  <div
                    className="related-img-inner"
                    dangerouslySetInnerHTML={{ __html: ILLOS[p.illo] || '' }}
                  />
                </div>
                <div className="related-body">
                  <div className="related-cat">{catLabel(p.cat)}</div>
                  <div className="related-name">{p.name}</div>
                  <div className="related-foot">
                    <div className="related-price">৳{p.price}<span style={{fontSize:'.58rem',color:'var(--muted)',fontFamily:'Jost,sans-serif',fontWeight:400}}> /pack</span></div>
                    <button className="btn-related-add" onClick={() => addRelated(p)}>
                      <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />

      {/* Toast */}
      <div className={`cart-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}