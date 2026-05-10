'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import './signin.css'

export default function SignInPage() {
  const [pwVisible, setPwVisible] = useState(false)
  const [errors, setErrors] = useState({ email: false, password: false })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })
  const toastTimer = useRef(null)
  const emailRef = useRef(null)
  const pwRef    = useRef(null)

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }, [])

  const clearError = (field) => setErrors(e => ({ ...e, [field]: false }))

  const handleSubmit = () => {
    const email = emailRef.current?.value.trim() ?? ''
    const pw    = pwRef.current?.value ?? ''
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const newErrors = { email: !emailRe.test(email), password: pw.length < 6 }
    setErrors(newErrors)
    if (newErrors.email || newErrors.password) return
    setLoading(true)
    setTimeout(() => { setLoading(false); showToast('Welcome back! Signing you in…') }, 1800)
  }

  const handleSocial = (e, provider) => {
    e.preventDefault()
    showToast(`Connecting with ${provider}…`)
  }

  return (
    <>
      <div className="page">

        {/* ══════════ BRAND PANEL (Left) ══════════ */}
        <aside className="brand-panel">
          <div className="spice-dot sd-1" />
          <div className="spice-dot sd-2" />
          <div className="spice-dot sd-3" />

          <div className="leaf bl-1">
            <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 250 C100 250 10 180 5 100 C0 20 80 0 100 10 C120 0 200 20 195 100 C190 180 100 250 100 250Z" fill="#8AB56A"/>
              <path d="M100 250 L100 10" stroke="#4C7A32" strokeWidth="2" fill="none"/>
              <path d="M100 200 C70 160 30 140 10 80" stroke="#4C7A32" strokeWidth="1.2" fill="none"/>
              <path d="M100 200 C130 160 170 140 190 80" stroke="#4C7A32" strokeWidth="1.2" fill="none"/>
              <path d="M100 160 C75 130 40 120 20 70" stroke="#4C7A32" strokeWidth="0.8" fill="none"/>
              <path d="M100 160 C125 130 160 120 180 70" stroke="#4C7A32" strokeWidth="0.8" fill="none"/>
            </svg>
          </div>
          <div className="leaf bl-2">
            <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 250 C100 250 10 180 5 100 C0 20 80 0 100 10 C120 0 200 20 195 100 C190 180 100 250 100 250Z" fill="#2B4A1D"/>
              <path d="M100 250 L100 10" stroke="#1D3314" strokeWidth="2" fill="none"/>
              <path d="M100 200 C70 160 30 140 10 80" stroke="#1D3314" strokeWidth="1.2" fill="none"/>
              <path d="M100 200 C130 160 170 140 190 80" stroke="#1D3314" strokeWidth="1.2" fill="none"/>
            </svg>
          </div>
          <div className="leaf bl-3">
            <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 170 C70 170 5 120 3 70 C1 20 55 5 70 12 C85 5 139 20 137 70 C135 120 70 170 70 170Z" fill="#4C7A32"/>
              <path d="M70 170 L70 12" stroke="#2B4A1D" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="leaf bl-4">
            <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 170 C70 170 5 120 3 70 C1 20 55 5 70 12 C85 5 139 20 137 70 C135 120 70 170 70 170Z" fill="#8AB56A"/>
              <path d="M70 170 L70 12" stroke="#4C7A32" strokeWidth="1.2" fill="none"/>
              <path d="M70 130 C50 100 22 85 8 48" stroke="#4C7A32" strokeWidth="0.7" fill="none"/>
              <path d="M70 130 C90 100 118 85 132 48" stroke="#4C7A32" strokeWidth="0.7" fill="none"/>
            </svg>
          </div>

          {/* Logo */}
          <div className="brand-top">
            <Link href="/" className="brand-logo">
              <svg viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 36 C15 36 2 26 1 14 C0 2 11 0 15 3 C19 0 30 2 29 14 C28 26 15 36 15 36Z"/>
                <path d="M15 36 L15 3" stroke="#2B4A1D" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="brand-logo-text">Zestopia</span>
            </Link>
          </div>

          {/* Middle: headline + features */}
          <div className="brand-mid">
            <h1 className="brand-tagline">
              Welcome <em>back</em> to<br/>Pure Flavours
            </h1>
            <p className="brand-sub">
              Sign in to manage your spice collection, track orders, and discover new arrivals
              from our curated selection of pure masalas and dry foods.
            </p>

            <ul className="brand-features">
              <li>
                <div className="feat-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Order History</strong>
                  <span>Revisit &amp; reorder your favourite blends anytime</span>
                </div>
              </li>
              <li>
                <div className="feat-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Saved Wishlist</strong>
                  <span>Your curated spice wishlist, always ready</span>
                </div>
              </li>
              <li>
                <div className="feat-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Live Order Tracking</strong>
                  <span>Know exactly where your package is</span>
                </div>
              </li>
              <li>
                <div className="feat-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="feat-text">
                  <strong>Exclusive Member Offers</strong>
                  <span>Early access to seasonal drops &amp; discounts</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quote */}
          <div className="brand-quote">
            <div className="quote-mark">&ldquo;</div>
            <p className="quote-text">
              Every dish tells a story — Zestopia gives me the authentic flavours to tell mine the right way.
            </p>
            <div className="quote-author">
              <div className="quote-av">S</div>
              <div>
                <div className="quote-name">Sumaiya Rahman</div>
                <div className="quote-loc">Dhaka, Bangladesh</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ══════════ FORM PANEL (Right) ══════════ */}
        <main className="form-panel">
          <div className="form-wrap">

            {/* Mobile-only logo */}
            <Link href="/" className="mobile-logo">
              <svg viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 36 C15 36 2 26 1 14 C0 2 11 0 15 3 C19 0 30 2 29 14 C28 26 15 36 15 36Z"/>
                <path d="M15 36 L15 3" stroke="#1D3314" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="mobile-logo-text">Zestopia</span>
            </Link>

            {/* Heading */}
            <div className="form-heading-row">
              <div className="form-eyebrow">
                <span className="eyebrow-dot" />
                <span className="eyebrow-label">Member Access</span>
              </div>
              <h2 className="form-title">Sign <em>in</em> to<br/>your account</h2>
              <p className="form-sub" style={{ marginTop: '0.6rem' }}>
                Don&apos;t have an account?{' '}
                <Link href="/signup">Create one free</Link>
              </p>
            </div>

            {/* Social login */}
            <div className="social-row">
              <a href="#" className="btn-social" onClick={(e) => handleSocial(e, 'Google')}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </a>
              <a href="#" className="btn-social" onClick={(e) => handleSocial(e, 'Facebook')}>
                <svg viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">or sign in with email</span>
            </div>

            {/* Form fields */}
            <div className="form-fields">
              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="signin-email">Email Address</label>
                <div className="field-wrap">
                  <input
                    className={`field-input${errors.email ? ' error' : ''}`}
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    ref={emailRef}
                    onChange={() => clearError('email')}
                  />
                  <span className="field-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,12 2,6"/>
                    </svg>
                  </span>
                </div>
                <span className={`field-error${errors.email ? ' show' : ''}`}>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Please enter a valid email address.
                </span>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="signin-password">Password</label>
                <div className="field-wrap">
                  <input
                    className={`field-input${errors.password ? ' error' : ''}`}
                    id="signin-password"
                    type={pwVisible ? 'text' : 'password'}
                    placeholder="Your password"
                    autoComplete="current-password"
                    ref={pwRef}
                    onChange={() => clearError('password')}
                  />
                  <span className="field-icon">
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <button
                    className="pw-toggle"
                    type="button"
                    onClick={() => setPwVisible(v => !v)}
                    aria-label="Toggle password visibility"
                  >
                    <svg viewBox="0 0 24 24">
                      {pwVisible ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                <span className={`field-error${errors.password ? ' show' : ''}`}>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Password must be at least 6 characters.
                </span>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="extras-row">
              <label className="check-wrap">
                <input type="checkbox" className="check-input" id="remember"/>
                <span className="check-box" />
                <span className="check-label">Remember me</span>
              </label>
              <a
                href="#"
                className="forgot-link"
                onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email!') }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              className={`btn-submit${loading ? ' loading' : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              <span className="spinner" />
              <span className="btn-text">Sign In</span>
              <svg className="btn-arrow" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            {/* Sign up link */}
            <p className="signup-row">
              New to Zestopia?{' '}
              <Link href="/signup">Create a free account</Link>
            </p>

          </div>
        </main>
      </div>

      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}