'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './orders.css'

/* ════════════════════════════════════════
   MOCK ORDER DATA
════════════════════════════════════════ */
const ORDERS = [
  {
    id: 'ZST-20250412-0041',
    date: 'April 12, 2025',
    status: 'delivered',
    total: 490,
    deliveredOn: 'April 15, 2025',
    address: 'Flat 4B, Green View Tower, Dhanmondi, Dhaka-1209',
    paymentMethod: 'bKash',
    items: [
      { id: 3, name: 'Murgir Mangshor Masala', bn: 'মুরগির মাংসের মশলা', qty: 2, price: 160, illo: 'masala_chicken', cat: 'Curry Masala' },
      { id: 6, name: 'Amchoor Powder',          bn: 'আমচুর পাউডার',       qty: 1, price: 120, illo: 'spice_amchoor',  cat: 'Single Spice' },
      { id: 9, name: 'Dry Anarosh',             bn: 'শুকনো আনারস',        qty: 1, price: 165, illo: 'dry_pineapple',  cat: 'Dried Fruit' },
    ],
    tracking: [
      { step: 'Order Placed',      done: true,  ts: 'Apr 12 · 10:32 AM', detail: 'Your order has been received and confirmed.' },
      { step: 'Payment Verified',  done: true,  ts: 'Apr 12 · 10:35 AM', detail: 'bKash payment of ৳490 successfully verified.' },
      { step: 'Processing',        done: true,  ts: 'Apr 12 · 01:15 PM', detail: 'Your spices are being weighed, packed and sealed.' },
      { step: 'Dispatched',        done: true,  ts: 'Apr 13 · 09:00 AM', detail: 'Handed over to SundarBan Courier. Tracking: SBC-88213.' },
      { step: 'Out for Delivery',  done: true,  ts: 'Apr 15 · 08:45 AM', detail: 'Your package is with the local delivery agent.' },
      { step: 'Delivered',         done: true,  ts: 'Apr 15 · 01:22 PM', detail: 'Signed for and delivered to the address on file.' },
    ],
  },
  {
    id: 'ZST-20250503-0117',
    date: 'May 3, 2025',
    status: 'out_for_delivery',
    total: 350,
    address: 'House 12, Road 8, Gulshan-1, Dhaka-1212',
    paymentMethod: 'Nagad',
    items: [
      { id: 1, name: 'Alur Dom Masala',  bn: 'আলুর দম মশলা',  qty: 1, price: 145, illo: 'masala_aludom', cat: 'Curry Masala' },
      { id: 7, name: 'Ada Powder',       bn: 'আদা পাউডার',     qty: 1, price: 110, illo: 'spice_ginger',  cat: 'Single Spice' },
      { id: 10, name: 'Dry Apple',       bn: 'শুকনো আপেল',     qty: 1, price: 180, illo: 'dry_apple',     cat: 'Dried Fruit' },
    ],
    tracking: [
      { step: 'Order Placed',     done: true,  ts: 'May 3 · 02:14 PM', detail: 'Your order has been received and confirmed.' },
      { step: 'Payment Verified', done: true,  ts: 'May 3 · 02:17 PM', detail: 'Nagad payment of ৳350 successfully verified.' },
      { step: 'Processing',       done: true,  ts: 'May 3 · 06:30 PM', detail: 'Your spices are being weighed, packed and sealed.' },
      { step: 'Dispatched',       done: true,  ts: 'May 4 · 09:20 AM', detail: 'Handed over to Pathao Courier. Tracking: PC-44891.' },
      { step: 'Out for Delivery', done: true,  ts: 'May 5 · 08:10 AM', detail: 'Your package is with the local delivery agent in Gulshan.' },
      { step: 'Delivered',        done: false, ts: 'Expected: May 5',   detail: 'Estimated delivery by 5:00 PM today.' },
    ],
  },
  {
    id: 'ZST-20250510-0189',
    date: 'May 10, 2025',
    status: 'processing',
    total: 335,
    address: 'Apartment 3A, Bashundhara R/A, Block C, Dhaka-1229',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 2, name: 'Achar Masala',           bn: 'আচার মশলা',            qty: 1, price: 130, illo: 'masala_achar',  cat: 'Curry Masala' },
      { id: 8, name: 'Dry Kola o Badam Bite',  bn: 'শুকনো কলা ও বাদাম বাইট', qty: 1, price: 190, illo: 'dry_banana',  cat: 'Dried Fruit' },
      { id: 5, name: 'Gorur Mangshor Masala',  bn: 'গরুর মাংসের মশলা',     qty: 1, price: 175, illo: 'masala_beef',   cat: 'Curry Masala' },
    ],
    tracking: [
      { step: 'Order Placed',     done: true,  ts: 'May 10 · 11:05 AM', detail: 'Your order has been received and confirmed.' },
      { step: 'Payment Verified', done: true,  ts: 'May 10 · 11:06 AM', detail: 'Cash on Delivery order confirmed.' },
      { step: 'Processing',       done: true,  ts: 'May 10 · 04:00 PM', detail: 'Your spices are being weighed, packed and sealed.' },
      { step: 'Dispatched',       done: false, ts: 'Expected: May 11',   detail: 'Will be dispatched via courier tomorrow morning.' },
      { step: 'Out for Delivery', done: false, ts: 'Expected: May 12',   detail: 'Estimated out for delivery on May 12.' },
      { step: 'Delivered',        done: false, ts: 'Expected: May 12',   detail: 'Estimated delivery by May 12, 2025.' },
    ],
  },
  {
    id: 'ZST-20250514-0221',
    date: 'May 14, 2025',
    status: 'cancelled',
    total: 175,
    address: 'Road 5, Uttara Sector 11, Dhaka-1230',
    paymentMethod: 'bKash',
    cancellationReason: 'Customer requested cancellation before dispatch.',
    items: [
      { id: 4, name: 'Khashir Mangshor Masala', bn: 'খাশির মাংসের মশলা', qty: 1, price: 175, illo: 'masala_mutton', cat: 'Curry Masala' },
    ],
    tracking: [
      { step: 'Order Placed',     done: true,   ts: 'May 14 · 09:44 AM', detail: 'Your order was received and confirmed.' },
      { step: 'Payment Verified', done: true,   ts: 'May 14 · 09:46 AM', detail: 'bKash payment of ৳175 verified.' },
      { step: 'Cancelled',        done: true,   ts: 'May 14 · 10:30 AM', detail: 'Order cancelled on customer request. Refund initiated.' },
    ],
  },
]

const ILLOS = {
  masala_aludom: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="65" cy="100" rx="48" ry="16" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><path d="M20 90Q18 68 22 52Q28 32 65 30Q102 32 108 52Q112 68 110 90Z" fill="#F0EAE0" stroke="#B5A48C" stroke-width="2"/><ellipse cx="65" cy="90" rx="45" ry="14" fill="#EDE6DA" stroke="#B5A48C" stroke-width="1.5"/><ellipse cx="65" cy="82" rx="30" ry="8" fill="#C8784A" opacity=".3"/><path d="M88 28L105 16" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><ellipse cx="92" cy="35" rx="12" ry="8" transform="rotate(-30 92 35)" fill="#D4B483" stroke="#A8885A" stroke-width="2"/></svg>`,
  masala_achar: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="35" width="70" height="85" rx="10" fill="#F5EFE6" stroke="#C8B898" stroke-width="2"/><path d="M30 60L100 60" stroke="#C8B898" stroke-width="1"/><rect x="42" y="20" width="46" height="20" rx="5" fill="#DDD0BC" stroke="#C8B898" stroke-width="1.5"/><rect x="38" y="12" width="54" height="12" rx="5" fill="#2B4A1D"/><rect x="50" y="48" width="30" height="30" rx="4" fill="white" opacity=".6"/><path d="M65 56C60 56 55 60 55 65C55 72 65 78 65 78C65 78 75 72 75 65C75 60 70 56 65 56Z" fill="#9B4F1A" opacity=".7"/></svg>`,
  masala_chicken: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 110C40 100 20 78 20 55C20 35 40 20 65 20C90 20 110 35 110 55C110 78 90 100 65 110Z" fill="#E8C4A0" stroke="#C8924A" stroke-width="2"/><path d="M65 95C48 88 35 74 35 58C35 44 48 33 65 33C82 33 95 44 95 58C95 74 82 88 65 95Z" fill="#D4A882" stroke="#B8844A" stroke-width="1.5"/><circle cx="65" cy="60" r="15" fill="#C8784A" stroke="#9B5A2A" stroke-width="2"/><circle cx="65" cy="60" r="7" fill="#8B3A14" opacity=".6"/></svg>`,
  masala_mutton: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 108C40 98 18 76 18 53C18 33 38 18 65 18C92 18 112 33 112 53C112 76 90 98 65 108Z" fill="#D4A882" stroke="#A87848" stroke-width="2"/><circle cx="65" cy="58" r="16" fill="#9B5A2A" stroke="#7A3D18" stroke-width="2"/><circle cx="65" cy="58" r="7" fill="#5C2810" opacity=".7"/></svg>`,
  masala_beef: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 108C38 96 16 73 16 50C16 30 36 16 65 16C94 16 114 30 114 50C114 73 92 96 65 108Z" fill="#C89464" stroke="#9B6A38" stroke-width="2"/><circle cx="65" cy="55" r="18" fill="#7A3418" stroke="#5C2410" stroke-width="2"/><circle cx="65" cy="55" r="8" fill="#3A1408" opacity=".7"/></svg>`,
  spice_amchoor: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 18C65 18 25 30 18 60C12 85 30 108 65 112C100 108 118 85 112 60C105 30 65 18 65 18Z" fill="#E8D4A0" stroke="#C8A848" stroke-width="2"/><path d="M65 32C65 32 38 42 34 62C30 80 42 98 65 100C88 98 100 80 96 62C92 42 65 32 65 32Z" fill="#D4BC80" stroke="#B89840" stroke-width="1.5"/></svg>`,
  spice_ginger: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 75C18 62 22 44 35 35C48 26 58 36 68 33C78 30 90 18 102 25C116 33 118 53 110 65C98 80 78 75 62 72C46 69 35 90 25 75Z" fill="#D4B483" stroke="#A8885A" stroke-width="2"/></svg>`,
  dry_banana: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 95C20 80 20 55 30 40C40 25 58 20 72 28C86 36 95 55 88 72C82 88 65 98 48 97C40 97 35 100 30 95Z" fill="#E8D878" stroke="#C8B440" stroke-width="2"/></svg>`,
  dry_pineapple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M65 100C45 96 28 78 28 58C28 38 44 22 65 22C86 22 102 38 102 58C102 78 85 96 65 100Z" fill="#E8C84A" stroke="#C8A830" stroke-width="2"/><path d="M45 58L65 38L85 58L65 78Z" fill="none" stroke="#B89820" stroke-width="1" opacity=".5"/></svg>`,
  dry_apple: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="65" cy="68" r="45" fill="#F5D8C0" stroke="#E8A87A" stroke-width="2"/><circle cx="65" cy="68" r="12" fill="#D48A5A" stroke="#B8643A" stroke-width="2"/></svg>`,
}

const STATUS_META = {
  delivered:        { label: 'Delivered',        cls: 'status-delivered',   icon: '✓' },
  out_for_delivery: { label: 'Out for Delivery',  cls: 'status-out',         icon: '🚚' },
  processing:       { label: 'Processing',        cls: 'status-processing',  icon: '⚙' },
  cancelled:        { label: 'Cancelled',         cls: 'status-cancelled',   icon: '✕' },
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function OrdersPage() {
  const [cartCount]                   = useState(0)
  const [toast, setToast]             = useState({ msg: '', show: false })
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const toastTimer                    = useRef(null)

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2600)
  }, [])

  const FILTERS = [
    { key: 'all',              label: 'All Orders' },
    { key: 'processing',       label: 'Processing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered',        label: 'Delivered' },
    { key: 'cancelled',        label: 'Cancelled' },
  ]

  const filtered = activeFilter === 'all'
    ? ORDERS
    : ORDERS.filter(o => o.status === activeFilter)

  const currentTracking = ORDERS.find(o => o.id === trackingOrder)

  const activeStepIndex = (order) => {
    const last = [...order.tracking].reverse().find(t => t.done)
    return order.tracking.indexOf(last)
  }

  return (
    <>
      <Navbar cartCount={cartCount} onShowToast={showToast} />

      {/* ── PAGE HEADER ── */}
      <div className="ord-header">
        <div className="ord-header-inner">
          <nav className="ord-breadcrumb">
            <Link href="/">Home</Link>
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <Link href="/account">Account</Link>
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>My Orders</span>
          </nav>
          <div className="ord-header-row">
            <div>
              <h1 className="ord-page-title">My <em>Orders</em></h1>
              <p className="ord-page-sub">{ORDERS.length} orders across all time</p>
            </div>
            <div className="ord-header-stats">
              <div className="ord-stat">
                <div className="ord-stat-num">
                  {ORDERS.filter(o => o.status === 'delivered').length}
                </div>
                <div className="ord-stat-label">Delivered</div>
              </div>
              <div className="ord-stat-sep"></div>
              <div className="ord-stat">
                <div className="ord-stat-num">
                  {ORDERS.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.total, 0).toLocaleString()}৳
                </div>
                <div className="ord-stat-label">Total Spent</div>
              </div>
              <div className="ord-stat-sep"></div>
              <div className="ord-stat">
                <div className="ord-stat-num">
                  {ORDERS.reduce((a, o) => a + o.items.reduce((b, i) => b + i.qty, 0), 0)}
                </div>
                <div className="ord-stat-label">Items Ordered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ord-body">

        {/* Filter bar */}
        <div className="ord-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`ord-filt${activeFilter === f.key ? ' on' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              <span className="ord-filt-count">
                {f.key === 'all' ? ORDERS.length : ORDERS.filter(o => o.status === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="ord-empty">
            <div className="ord-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h3 className="ord-empty-title">No orders found</h3>
            <p className="ord-empty-sub">You don't have any {activeFilter !== 'all' ? activeFilter.replace('_', ' ') + ' ' : ''}orders yet.</p>
            <Link href="/#products" className="ord-btn-shop">Browse Products</Link>
          </div>
        ) : (
          <div className="ord-list">
            {filtered.map(order => {
              const meta    = STATUS_META[order.status]
              const isOpen  = expandedOrder === order.id
              const isTrack = trackingOrder  === order.id
              const stepIdx = activeStepIndex(order)

              return (
                <div key={order.id} className={`ord-card${isOpen ? ' expanded' : ''}`}>

                  {/* ── Card Header ── */}
                  <div className="ord-card-head">
                    <div className="ord-card-meta">
                      <div className="ord-id-row">
                        <span className="ord-id">{order.id}</span>
                        <span className={`ord-status-pill ${meta.cls}`}>
                          <span className="ord-status-dot"></span>
                          {meta.label}
                        </span>
                      </div>
                      <div className="ord-date-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Placed on {order.date}</span>
                        {order.deliveredOn && (
                          <>
                            <span className="ord-date-sep">·</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Delivered {order.deliveredOn}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ord-card-total">
                      <div className="ord-total-amount">৳{order.total.toLocaleString()}</div>
                      <div className="ord-total-label">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod}</div>
                    </div>
                  </div>

                  {/* ── Product thumbnails ── */}
                  <div className="ord-items-row">
                    <div className="ord-item-illos">
                      {order.items.map((item, i) => (
                        <div key={i} className="ord-item-illo-wrap" title={item.name}>
                          <div className="ord-item-illo" dangerouslySetInnerHTML={{ __html: ILLOS[item.illo] || '' }} />
                          {item.qty > 1 && <span className="ord-item-qty">×{item.qty}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="ord-card-actions">
                      {order.status !== 'cancelled' && (
                        <button
                          className={`ord-btn-track${isTrack ? ' active' : ''}`}
                          onClick={() => setTrackingOrder(isTrack ? null : order.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {isTrack ? 'Hide Tracking' : 'Track Order'}
                        </button>
                      )}
                      <button
                        className="ord-btn-details"
                        onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d={isOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
                        </svg>
                        {isOpen ? 'Hide Details' : 'View Details'}
                      </button>
                      {order.status === 'delivered' && (
                        <button className="ord-btn-reorder" onClick={() => showToast('Items added to cart!')}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                          </svg>
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── TRACKING PANEL ── */}
                  {isTrack && (
                    <div className="ord-tracking-panel">
                      <div className="ord-track-header">
                        <div className="ord-track-title">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="1" y="3" width="15" height="13" rx="1"/>
                            <path d="M16 8h4l3 3v5h-7V8z"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                          Live Tracking
                        </div>
                        <span className="ord-track-id">Order {order.id}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="ord-progress-bar-wrap">
                        <div
                          className="ord-progress-bar-fill"
                          style={{
                            width: order.status === 'cancelled'
                              ? '100%'
                              : `${(stepIdx / (order.tracking.length - 1)) * 100}%`,
                            background: order.status === 'cancelled' ? 'var(--spice)' : undefined,
                          }}
                        ></div>
                      </div>

                      {/* Steps */}
                      <div className="ord-steps-track">
                        {order.tracking.map((step, i) => {
                          const isCurrent = step.done && (i === order.tracking.length - 1 || !order.tracking[i + 1]?.done)
                          const isCancelled = order.status === 'cancelled' && step.step === 'Cancelled'
                          return (
                            <div
                              key={i}
                              className={`ord-step${step.done ? ' done' : ''}${isCurrent ? ' current' : ''}${isCancelled ? ' cancelled' : ''}`}
                            >
                              <div className="ord-step-left">
                                <div className="ord-step-dot">
                                  {step.done
                                    ? isCancelled
                                      ? <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                                      : <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    : <span>{i + 1}</span>
                                  }
                                </div>
                                {i < order.tracking.length - 1 && (
                                  <div className={`ord-step-line${step.done ? ' done' : ''}`}></div>
                                )}
                              </div>
                              <div className="ord-step-content">
                                <div className="ord-step-name">{step.step}</div>
                                <div className="ord-step-ts">{step.ts}</div>
                                <div className="ord-step-detail">{step.detail}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Delivery info chip */}
                      <div className="ord-track-address">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{order.address}</span>
                      </div>
                    </div>
                  )}

                  {/* ── EXPANDED DETAILS ── */}
                  {isOpen && (
                    <div className="ord-details-panel">
                      <div className="ord-details-grid">

                        {/* Items table */}
                        <div className="ord-detail-section">
                          <div className="ord-detail-label">Order Items</div>
                          <div className="ord-items-table">
                            {order.items.map((item, i) => (
                              <div key={i} className="ord-item-row">
                                <div className="ord-item-thumb">
                                  <div dangerouslySetInnerHTML={{ __html: ILLOS[item.illo] || '' }} />
                                </div>
                                <div className="ord-item-info">
                                  <div className="ord-item-name">{item.name}</div>
                                  <div className="ord-item-bn">{item.bn}</div>
                                  <div className="ord-item-cat-tag">{item.cat}</div>
                                </div>
                                <div className="ord-item-pricing">
                                  <div className="ord-item-unit">৳{item.price} × {item.qty}</div>
                                  <div className="ord-item-subtotal">৳{item.price * item.qty}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary + Address */}
                        <div>
                          {/* Price summary */}
                          <div className="ord-detail-section">
                            <div className="ord-detail-label">Payment Summary</div>
                            <div className="ord-summary-box">
                              <div className="ord-summary-row">
                                <span>Subtotal</span>
                                <span>৳{order.items.reduce((a, i) => a + i.price * i.qty, 0)}</span>
                              </div>
                              <div className="ord-summary-row">
                                <span>Delivery</span>
                                <span className="ord-free-tag">Free</span>
                              </div>
                              <div className="ord-summary-row">
                                <span>Payment Method</span>
                                <span>{order.paymentMethod}</span>
                              </div>
                              <div className="ord-summary-divider"></div>
                              <div className="ord-summary-row total">
                                <span>Total</span>
                                <span>৳{order.total}</span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery address */}
                          <div className="ord-detail-section" style={{ marginTop: '1.5rem' }}>
                            <div className="ord-detail-label">Delivery Address</div>
                            <div className="ord-address-box">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                                <polyline points="9,22 9,12 15,12 15,22"/>
                              </svg>
                              <span>{order.address}</span>
                            </div>
                          </div>

                          {/* Cancellation reason */}
                          {order.cancellationReason && (
                            <div className="ord-detail-section" style={{ marginTop: '1.5rem' }}>
                              <div className="ord-detail-label">Cancellation Reason</div>
                              <div className="ord-cancel-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                                <span>{order.cancellationReason}</span>
                              </div>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="ord-detail-actions">
                            {order.status === 'delivered' && (
                              <Link href={`/product/${order.items[0].id}`} className="ord-action-link">
                                Write a Review
                              </Link>
                            )}
                            <button className="ord-action-link" onClick={() => showToast('Invoice downloaded.')}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              Download Invoice
                            </button>
                            {order.status === 'processing' && (
                              <button className="ord-action-cancel" onClick={() => showToast('Cancellation request sent.')}>
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Need Help strip ── */}
        <div className="ord-help-strip">
          <div className="ord-help-inner">
            <div className="ord-help-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div className="ord-help-text">
              <strong>Need help with an order?</strong>
              Our support team is available 7 days a week. We typically reply within 2 hours.
            </div>
            <button className="ord-btn-support" onClick={() => showToast('Support chat opened.')}>
              Contact Support
            </button>
          </div>
        </div>

      </div>

      <Footer />
      <div className={`ord-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}