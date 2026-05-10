'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './checkout.css'

/* ══ ILLUSTRATIONS (subset) ══ */
const ILLOS = {
  masala_aludom:  `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="100" rx="48" ry="16" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><path d="M20 90Q18 68 22 52Q28 32 65 30Q102 32 108 52Q112 68 110 90Z" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/><ellipse cx="65" cy="90" rx="45" ry="14" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><ellipse cx="65" cy="82" rx="30" ry="8" fill="#C8784A" opacity=".3"/><text x="65" y="70" font-family="serif" font-size="9" fill="#7C6A54" text-anchor="middle" font-style="italic">Alur Dom</text></svg>`,
  masala_chicken: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 110C40 100 20 78 20 55C20 35 40 20 65 20C90 20 110 35 110 55C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" stroke-width="2"/><circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" stroke-width="2"/><circle cx="65" cy="60" r="7" fill="#8B3A14" opacity=".6"/><text x="65" y="120" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Murgir Mangshor</text></svg>`,
  dry_banana:     `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 95C20 80 20 55 30 40C40 25 58 20 72 28C86 36 95 55 88 72C82 88 65 98 48 97C40 97 35 100 30 95Z" fill="#E8D878" stroke="#C8B440" stroke-width="2"/><text x="60" y="118" font-family="serif" font-size="7.5" fill="#7C6A54" text-anchor="middle" font-style="italic">Kola o Badam Bite</text></svg>`,
}

/* ══ MOCK CART (normally you'd pull from shared state / context) ══ */
const CART_ITEMS = [
  { id:1, name:'Alur Dom Masala',        bn:'আলুর দম মশলা',           price:145, qty:2, illo:'masala_aludom'  },
  { id:3, name:'Murgir Mangshor Masala', bn:'মুরগির মাংসের মশলা',     price:160, qty:1, illo:'masala_chicken' },
  { id:8, name:'Dry Kola o Badam Bite',  bn:'শুকনো কলা ও বাদাম বাইট', price:190, qty:1, illo:'dry_banana'     },
]

const TICKER_ITEMS = [
  'Free Shipping Over ৳500','100% Natural — No Preservatives',
  'Stone-Ground Masalas','Authentic Bengali Recipes',
  'Sun-Dried Fruits & Snacks','Premium Airtight Packaging','Same-Day Dispatch',
]

const DIVISIONS = [
  'Dhaka','Chittagong','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh',
]

const DELIVERY_OPTS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    desc: '3–5 business days',
    price: 0,   // free if subtotal >= 500, else 60
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><path d="M9 21H6a2 2 0 01-2-2V11l3-3h8l4 4v5a2 2 0 01-2 2h-3"/><circle cx="16" cy="18" r="2"/><circle cx="9" cy="18" r="2"/></svg>`,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    desc: 'Next business day by 6 PM',
    price: 120,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    id: 'pickup',
    name: 'Store Pickup',
    desc: 'Ready in 2 hours · Dhaka store',
    price: 0,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  },
]

const VALID_COUPONS = {
  ZEST10:  { type:'percent', value:10, label:'10% off' },
  SPICE20: { type:'percent', value:20, label:'20% off' },
  FLAT50:  { type:'flat',    value:50, label:'৳50 off' },
}

/* format card number with spaces */
function fmtCard(v) {
  return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
}
function fmtExpiry(v) {
  const d = v.replace(/\D/g,'').slice(0,4)
  return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d
}

/* ══ MAIN ══ */
export default function CheckoutPage() {
  /* ── form state ── */
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', area:'', city:'', division:'', postcode:'',
    notes:'',
    saveAddress: false,
  })
  const [errors, setErrors]         = useState({})
  const [touched, setTouched]       = useState({})

  /* ── delivery & payment ── */
  const [delivery, setDelivery]     = useState('standard')
  const [payment, setPayment]       = useState('cod')

  /* ── card details ── */
  const [card, setCard]             = useState({ number:'', name:'', expiry:'', cvv:'' })
  const [cardErrors, setCardErrors] = useState({})

  /* ── coupon ── */
  const [coupon, setCoupon]         = useState('')
  const [applied, setApplied]       = useState(null)
  const [couponMsg, setCouponMsg]   = useState(null)

  /* ── place order ── */
  const [placing, setPlacing]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [orderNum, setOrderNum]     = useState('')

  /* ── toast ── */
  const [toast, setToast]           = useState({ msg:'', show:false, err:false })
  const toastTimer                  = useRef(null)

  /* ── totals ── */
  const subtotal = CART_ITEMS.reduce((s,i) => s + i.price * i.qty, 0)
  const deliveryOpt = DELIVERY_OPTS.find(d => d.id === delivery)
  const baseShipping = subtotal >= 500 ? 0 : 60
  const shippingCost = delivery === 'standard'
    ? baseShipping
    : delivery === 'express'
    ? 120
    : 0
  const discount = applied
    ? applied.type === 'percent'
      ? Math.round(subtotal * applied.value / 100)
      : Math.min(applied.value, subtotal)
    : 0
  const total = subtotal - discount + shippingCost
  const totalQty = CART_ITEMS.reduce((s,i) => s + i.qty, 0)

  /* ── Toast ── */
  const showToast = useCallback((msg, err=false) => {
    setToast({ msg, show:true, err })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({...t, show:false})), 2800)
  }, [])

  /* ── Input change ── */
  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }
  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    validateField(field, form[field])
  }

  /* ── Validation ── */
  const validateField = (field, value) => {
    let err = ''
    if (['firstName','lastName','address','area','city','division'].includes(field) && !value.trim())
      err = 'This field is required.'
    if (field === 'email') {
      if (!value.trim()) err = 'Email is required.'
      else if (!/\S+@\S+\.\S+/.test(value)) err = 'Enter a valid email address.'
    }
    if (field === 'phone') {
      if (!value.trim()) err = 'Phone is required.'
      else if (!/^(\+?880|0)1[3-9]\d{8}$/.test(value.replace(/\s/g,'')))
        err = 'Enter a valid Bangladeshi number.'
    }
    if (field === 'postcode' && value && !/^\d{4}$/.test(value))
      err = 'Enter a valid 4-digit postcode.'
    setErrors(e => ({ ...e, [field]: err }))
    return !err
  }

  const validateAll = () => {
    const required = ['firstName','lastName','email','phone','address','area','city','division']
    let ok = true
    const newErrors = {}
    const newTouched = {}
    required.forEach(f => {
      newTouched[f] = true
      let err = ''
      if (!form[f].trim()) { err = 'This field is required.'; ok = false }
      if (f==='email' && form[f] && !/\S+@\S+\.\S+/.test(form[f])) { err='Invalid email.'; ok=false }
      if (f==='phone' && form[f] && !/^(\+?880|0)1[3-9]\d{8}$/.test(form[f].replace(/\s/g,''))) { err='Invalid number.'; ok=false }
      newErrors[f] = err
    })
    if (payment === 'card') {
      const ce = {}
      if (!card.number.replace(/\s/g,'') || card.number.replace(/\s/g,'').length < 16) { ce.number='Enter a valid 16-digit card number.'; ok=false }
      if (!card.name.trim()) { ce.name='Cardholder name required.'; ok=false }
      if (!card.expiry || card.expiry.length < 5) { ce.expiry='Enter expiry (MM/YY).'; ok=false }
      if (!card.cvv || card.cvv.length < 3) { ce.cvv='Enter CVV.'; ok=false }
      setCardErrors(ce)
    }
    setErrors(newErrors)
    setTouched(newTouched)
    return ok
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
      setCouponMsg({ ok:false, text:'Invalid code. Try ZEST10, SPICE20, or FLAT50.' })
    }
  }

  /* ── Place Order ── */
  const placeOrder = () => {
    if (!validateAll()) {
      showToast('Please fill in all required fields.', true)
      // scroll to first error
      const firstErr = document.querySelector('.form-input.err, .form-select.err')
      if (firstErr) firstErr.scrollIntoView({ behavior:'smooth', block:'center' })
      return
    }
    setPlacing(true)
    setTimeout(() => {
      setPlacing(false)
      const num = 'ZST-' + Date.now().toString().slice(-6)
      setOrderNum(num)
      setSuccess(true)
    }, 2200)
  }

  /* ── Scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) }
      }),
      { threshold: 0.06 }
    )
    document.querySelectorAll('.reveal-co:not(.on)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* ── input class helper ── */
  const inputCls = (f) =>
    `form-input${touched[f] && errors[f] ? ' err' : touched[f] && !errors[f] && form[f] ? ' ok' : ''}`

  return (
    <>
      <Navbar cartCount={totalQty} onShowToast={showToast} />

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item,i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-sep"></span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="co-hero">
        <div className="co-breadcrumb">
          <Link href="/">Home</Link>
          <svg className="co-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <Link href="/shop">Shop</Link>
          <svg className="co-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <Link href="/cart">Cart</Link>
          <svg className="co-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span className="crumb-active">Checkout</span>
        </div>
        <div className="co-hero-inner">
          <div>
            <div className="co-sec-label"><span>Secure Checkout</span></div>
            <h1 className="co-hero-title">Complete Your <em>Order</em></h1>
          </div>
          <div className="co-steps">
            <div className="co-step done">
              <div className="co-step-dot">
                <svg viewBox="0 0 12 10"><polyline points="1,5 4,8 11,1"/></svg>
              </div>
              <span>Cart</span>
            </div>
            <div className="co-step-sep"></div>
            <div className="co-step active">
              <div className="co-step-dot">2</div>
              <span>Checkout</span>
            </div>
            <div className="co-step-sep"></div>
            <div className="co-step">
              <div className="co-step-dot">3</div>
              <span>Confirm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="co-body">

        {/* ══════════ LEFT COLUMN ══════════ */}
        <div>

          {/* ─── 1. CONTACT INFO ─── */}
          <div className="co-card reveal-co">
            <div className="co-card-header">
              <div className="co-card-title">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="co-card-num">1</span>
                Contact Information
              </div>
            </div>
            <div className="co-card-body">
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    First Name <span className="req">*</span>
                  </label>
                  <input
                    className={inputCls('firstName')}
                    type="text"
                    placeholder="Rashida"
                    value={form.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                  />
                  {touched.firstName && errors.firstName && (
                    <span className="field-err">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Last Name <span className="req">*</span>
                  </label>
                  <input
                    className={inputCls('lastName')}
                    type="text"
                    placeholder="Begum"
                    value={form.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                  />
                  {touched.lastName && errors.lastName && (
                    <span className="field-err">{errors.lastName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    className={inputCls('email')}
                    type="email"
                    placeholder="rashida@example.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                  />
                  {touched.email && errors.email && (
                    <span className="field-err">{errors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="req">*</span>
                  </label>
                  <div className="phone-wrap">
                    <div className="phone-flag">
                      <svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="12" fill="#006A4E"/>
                        <circle cx="8" cy="6" r="3.5" fill="#F42A41"/>
                      </svg>
                      +880
                    </div>
                    <div className="phone-divider"></div>
                    <input
                      className={`${inputCls('phone')} with-flag`}
                      type="tel"
                      placeholder="01712 345 678"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <span className="field-err">{errors.phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── 2. DELIVERY ADDRESS ─── */}
          <div className="co-card reveal-co cod1">
            <div className="co-card-header">
              <div className="co-card-title">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="co-card-num">2</span>
                Delivery Address
              </div>
            </div>
            <div className="co-card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Street Address <span className="req">*</span>
                  </label>
                  <input
                    className={inputCls('address')}
                    type="text"
                    placeholder="House no, road, block…"
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                  />
                  {touched.address && errors.address && (
                    <span className="field-err">{errors.address}</span>
                  )}
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Area / Thana <span className="req">*</span>
                    </label>
                    <input
                      className={inputCls('area')}
                      type="text"
                      placeholder="Gulshan, Mirpur…"
                      value={form.area}
                      onChange={e => handleChange('area', e.target.value)}
                      onBlur={() => handleBlur('area')}
                    />
                    {touched.area && errors.area && (
                      <span className="field-err">{errors.area}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      City <span className="req">*</span>
                    </label>
                    <input
                      className={inputCls('city')}
                      type="text"
                      placeholder="Dhaka"
                      value={form.city}
                      onChange={e => handleChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                    />
                    {touched.city && errors.city && (
                      <span className="field-err">{errors.city}</span>
                    )}
                  </div>
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Division <span className="req">*</span>
                    </label>
                    <select
                      className={`form-select${touched.division && errors.division ? ' err' : touched.division && !errors.division && form.division ? ' ok' : ''}`}
                      value={form.division}
                      onChange={e => handleChange('division', e.target.value)}
                      onBlur={() => handleBlur('division')}
                    >
                      <option value="">Select Division…</option>
                      {DIVISIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {touched.division && errors.division && (
                      <span className="field-err">{errors.division}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postcode</label>
                    <input
                      className={`form-input${touched.postcode && errors.postcode ? ' err' : ''}`}
                      type="text"
                      placeholder="1212"
                      maxLength={4}
                      value={form.postcode}
                      onChange={e => handleChange('postcode', e.target.value.replace(/\D/g,''))}
                      onBlur={() => handleBlur('postcode')}
                    />
                    {touched.postcode && errors.postcode && (
                      <span className="field-err">{errors.postcode}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Order Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any special instructions for your order or delivery…"
                    value={form.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                  />
                  <span className="form-hint">Optional. Include landmark or gate number if helpful.</span>
                </div>

                <label style={{ display:'flex', alignItems:'center', gap:'.7rem', cursor:'pointer', fontSize:'.78rem', color:'var(--muted)' }}>
                  <div
                    style={{
                      width:16, height:16,
                      border:`1.5px solid ${form.saveAddress ? 'var(--green)' : 'var(--border2)'}`,
                      borderRadius:2,
                      background: form.saveAddress ? 'var(--green)' : 'var(--cream)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, transition:'all .2s', cursor:'pointer',
                    }}
                    onClick={() => handleChange('saveAddress', !form.saveAddress)}
                  >
                    {form.saveAddress && (
                      <svg width="9" height="7" viewBox="0 0 12 10" fill="none">
                        <polyline points="1,5 4,8 11,1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  Save this address for future orders
                </label>
              </div>
            </div>
          </div>

          {/* ─── 3. DELIVERY METHOD ─── */}
          <div className="co-card reveal-co cod2">
            <div className="co-card-header">
              <div className="co-card-title">
                <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><path d="M9 21H6a2 2 0 01-2-2V11l3-3h8l4 4v5a2 2 0 01-2 2h-3"/><circle cx="16" cy="18" r="2"/><circle cx="9" cy="18" r="2"/></svg>
                <span className="co-card-num">3</span>
                Delivery Method
              </div>
            </div>
            <div className="co-card-body">
              <div className="delivery-opts">
                {DELIVERY_OPTS.map(opt => {
                  const price = opt.id === 'standard'
                    ? (subtotal >= 500 ? 0 : 60)
                    : opt.price
                  return (
                    <div
                      key={opt.id}
                      className={`delivery-opt${delivery === opt.id ? ' selected' : ''}`}
                      onClick={() => setDelivery(opt.id)}
                    >
                      <div className="del-radio">
                        <div className="del-radio-dot"></div>
                      </div>
                      <div
                        className="del-icon"
                        dangerouslySetInnerHTML={{ __html: opt.icon }}
                      />
                      <div className="del-info">
                        <div className="del-name">{opt.name}</div>
                        <div className="del-desc">{opt.desc}</div>
                      </div>
                      <div className={`del-price${price === 0 ? ' free' : ''}`}>
                        {price === 0 ? 'Free' : `৳${price}`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ─── 4. PAYMENT ─── */}
          <div className="co-card reveal-co cod3">
            <div className="co-card-header">
              <div className="co-card-title">
                <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span className="co-card-num">4</span>
                Payment Method
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.62rem', color:'var(--muted)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SSL Secured
              </div>
            </div>
            <div className="co-card-body">
              <div className="pay-methods">

                {/* bKash */}
                <div
                  className={`pay-method${payment === 'bkash' ? ' selected' : ''}`}
                  onClick={() => setPayment('bkash')}
                >
                  <div className="pay-method-header">
                    <div className="pay-radio"><div className="pay-radio-dot"></div></div>
                    <div className="pay-logo bkash">bKash</div>
                    <div className="pay-method-name">bKash Mobile Banking</div>
                    <div className="pay-method-note">Instant</div>
                  </div>
                  <div className="pay-panel">
                    <div className="pay-panel-inner">
                      <div className="bkash-note">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p>After placing your order, you'll receive a <strong>bKash payment request</strong> on your registered number. Approve within 5 minutes to confirm your order.</p>
                      </div>
                      <div className="form-group" style={{ marginTop:'1rem' }}>
                        <label className="form-label">bKash Number</label>
                        <input className="form-input" type="tel" placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nagad */}
                <div
                  className={`pay-method${payment === 'nagad' ? ' selected' : ''}`}
                  onClick={() => setPayment('nagad')}
                >
                  <div className="pay-method-header">
                    <div className="pay-radio"><div className="pay-radio-dot"></div></div>
                    <div className="pay-logo nagad">Nagad</div>
                    <div className="pay-method-name">Nagad Mobile Banking</div>
                    <div className="pay-method-note">Instant</div>
                  </div>
                  <div className="pay-panel">
                    <div className="pay-panel-inner">
                      <div className="nagad-note">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p>After placing your order, you'll receive a <strong>Nagad payment request</strong> on your registered number. Approve within 5 minutes to confirm your order.</p>
                      </div>
                      <div className="form-group" style={{ marginTop:'1rem' }}>
                        <label className="form-label">Nagad Number</label>
                        <input className="form-input" type="tel" placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit / Debit Card */}
                <div
                  className={`pay-method${payment === 'card' ? ' selected' : ''}`}
                  onClick={() => setPayment('card')}
                >
                  <div className="pay-method-header">
                    <div className="pay-radio"><div className="pay-radio-dot"></div></div>
                    <div className="pay-logo visa">VISA</div>
                    <div className="pay-logo mc" style={{marginLeft:'.3rem'}}>MC</div>
                    <div className="pay-method-name" style={{marginLeft:'.5rem'}}>Credit / Debit Card</div>
                    <div className="pay-method-note">Secure</div>
                  </div>
                  <div className="pay-panel">
                    <div className="pay-panel-inner">
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <div className="card-number-wrap">
                          <input
                            className={`form-input card-num${cardErrors.number ? ' err' : ''}`}
                            type="text"
                            inputMode="numeric"
                            placeholder="0000 0000 0000 0000"
                            value={card.number}
                            onChange={e => setCard(c => ({...c, number: fmtCard(e.target.value)}))}
                            maxLength={19}
                          />
                          <div className="card-icon">
                            <svg viewBox="0 0 28 18" fill="none"><rect width="28" height="18" rx="3" fill="#1A1F71"/><rect x="0" y="6" width="28" height="4" fill="#2957B0" opacity=".7"/><text x="4" y="15" font-size="5" fill="white" font-weight="bold" font-family="sans-serif">VISA</text></svg>
                          </div>
                        </div>
                        {cardErrors.number && <span className="field-err">{cardErrors.number}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input
                          className={`form-input${cardErrors.name ? ' err' : ''}`}
                          type="text"
                          placeholder="As printed on card"
                          value={card.name}
                          onChange={e => setCard(c => ({...c, name: e.target.value}))}
                        />
                        {cardErrors.name && <span className="field-err">{cardErrors.name}</span>}
                      </div>
                      <div className="card-row">
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input
                            className={`form-input${cardErrors.expiry ? ' err' : ''}`}
                            type="text"
                            placeholder="MM / YY"
                            value={card.expiry}
                            onChange={e => setCard(c => ({...c, expiry: fmtExpiry(e.target.value)}))}
                            maxLength={5}
                          />
                          {cardErrors.expiry && <span className="field-err">{cardErrors.expiry}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input
                            className={`form-input${cardErrors.cvv ? ' err' : ''}`}
                            type="password"
                            placeholder="•••"
                            value={card.cvv}
                            onChange={e => setCard(c => ({...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))}
                            maxLength={4}
                          />
                          {cardErrors.cvv && <span className="field-err">{cardErrors.cvv}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`pay-method${payment === 'cod' ? ' selected' : ''}`}
                  onClick={() => setPayment('cod')}
                >
                  <div className="pay-method-header">
                    <div className="pay-radio"><div className="pay-radio-dot"></div></div>
                    <div className="pay-logo cod">COD</div>
                    <div className="pay-method-name">Cash on Delivery</div>
                    <div className="pay-method-note">Pay at door</div>
                  </div>
                  <div className="pay-panel">
                    <div className="pay-panel-inner">
                      <div className="cod-note">
                        <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        <p>Pay <strong>৳{total}</strong> in cash when your order arrives at your doorstep. Please keep exact change ready for a smooth delivery experience.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ══════════ RIGHT COLUMN — ORDER SUMMARY ══════════ */}
        <div>
          <div className="co-summary reveal-co cod1">
            <div className="co-summary-header">
              <div className="co-summary-title">Order Review</div>
              <div className="co-summary-badge">{totalQty} Item{totalQty !== 1 ? 's' : ''}</div>
            </div>
            <div className="co-summary-body">

              {/* Mini items list */}
              <div className="order-items-list">
                {CART_ITEMS.map(item => (
                  <div key={item.id} className="order-item-mini">
                    <div className="order-mini-img">
                      <div
                        className="order-mini-img-inner"
                        dangerouslySetInnerHTML={{ __html: ILLOS[item.illo] || '' }}
                      />
                      <div className="order-mini-qty">{item.qty}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div className="order-mini-name">{item.name}</div>
                      <div className="order-mini-bn">{item.bn}</div>
                    </div>
                    <div className="order-mini-price">৳{item.price * item.qty}</div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ marginBottom:'1.2rem' }}>
                <div style={{ fontSize:'.64rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--brown)', fontWeight:600, marginBottom:'.6rem' }}>
                  Coupon Code
                </div>
                {applied ? (
                  <div className="co-coupon-tag">
                    <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    {coupon.toUpperCase()} — {applied.label} applied
                    <span
                      style={{ cursor:'pointer', opacity:.6, display:'flex', alignItems:'center' }}
                      onClick={() => { setApplied(null); setCoupon(''); setCouponMsg(null) }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{ display:'flex', border:'1.5px solid var(--border2)', borderRadius:3, overflow:'hidden', background:'var(--cream)' }}>
                      <input
                        style={{ flex:1, background:'transparent', border:'none', padding:'.6rem .9rem', fontFamily:'Jost,sans-serif', fontSize:'.78rem', color:'var(--text)', outline:'none' }}
                        type="text"
                        placeholder="Enter coupon…"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponMsg(null) }}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      />
                      <button
                        style={{ background:'var(--green)', color:'#fff', border:'none', padding:'.6rem 1rem', fontFamily:'Jost,sans-serif', fontSize:'.62rem', letterSpacing:'.16em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', flexShrink:0 }}
                        onClick={applyCoupon}
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <div style={{ fontSize:'.65rem', marginTop:'.3rem', color: couponMsg.ok ? 'var(--green-mid)' : 'var(--spice)' }}>
                        {couponMsg.ok ? '✓' : '✗'} {couponMsg.text}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Totals */}
              <div className="co-sum-row">
                <span className="co-sum-label">
                  <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                  Subtotal
                </span>
                <span>৳{subtotal}</span>
              </div>
              <div className="co-sum-row">
                <span className="co-sum-label">
                  <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><path d="M9 21H6a2 2 0 01-2-2V11l3-3h8l4 4v5a2 2 0 01-2 2h-3"/><circle cx="16" cy="18" r="2"/><circle cx="9" cy="18" r="2"/></svg>
                  {deliveryOpt?.name}
                </span>
                {shippingCost === 0
                  ? <span className="co-sum-free">Free</span>
                  : <span>৳{shippingCost}</span>
                }
              </div>
              {applied && (
                <div className="co-sum-row">
                  <span className="co-sum-label">
                    <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    Discount
                  </span>
                  <span className="co-sum-disc">−৳{discount}</span>
                </div>
              )}
              <div className="co-sum-row total">
                <span>Total</span>
                <span className="co-sum-val">৳{total}</span>
              </div>

              {/* Place Order */}
              <button
                className={`btn-place-order${placing ? ' loading' : ''}`}
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <div className="spinner"></div>
                    Processing…
                  </>
                ) : (
                  <>
                    Place Order · ৳{total}
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              <Link href="/cart" className="btn-back-cart">
                <svg viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Cart
              </Link>

              <div className="secure-strip">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                256-bit SSL · Encrypted Checkout
              </div>

              <div className="pay-icons-row">
                <span className="pi-chip">bKash</span>
                <span className="pi-chip">Nagad</span>
                <span className="pi-chip">VISA</span>
                <span className="pi-chip">MC</span>
                <span className="pi-chip">COD</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      <Footer />

      {/* ══ SUCCESS MODAL ══ */}
      <div className={`success-overlay${success ? ' show' : ''}`}>
        <div className="success-modal">
          <div className="success-modal-top">
            <div className="success-check">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Order <em>Confirmed!</em></h2>
            <p>Thank you, {form.firstName || 'valued customer'}. Your order is on its way.</p>
          </div>
          <div className="success-modal-body">
            <div className="success-detail-row">
              <span className="success-detail-label">
                <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                Order Number
              </span>
              <span className="success-detail-val green">{orderNum}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">
                <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><path d="M9 21H6a2 2 0 01-2-2V11l3-3h8l4 4v5a2 2 0 01-2 2h-3"/><circle cx="16" cy="18" r="2"/><circle cx="9" cy="18" r="2"/></svg>
                Delivery
              </span>
              <span className="success-detail-val">{deliveryOpt?.desc}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">
                <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Payment
              </span>
              <span className="success-detail-val" style={{ textTransform:'capitalize' }}>
                { payment === 'cod' ? 'Cash on Delivery'
                : payment === 'bkash' ? 'bKash'
                : payment === 'nagad' ? 'Nagad'
                : 'Card' }
              </span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">
                <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                Total Paid
              </span>
              <span className="success-detail-val green">৳{total}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Confirmation sent to
              </span>
              <span className="success-detail-val">{form.email || '—'}</span>
            </div>
            <div className="success-actions">
              <Link href="/" className="btn-success-primary">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Back to Home
              </Link>
              <Link href="/shop" className="btn-success-secondary">
                <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`co-toast${toast.err ? ' err-toast' : ''}${toast.show ? ' show' : ''}`}>
        {toast.msg}
      </div>
    </>
  )
}