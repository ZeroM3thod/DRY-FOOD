'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar({ cartCount, onShowToast }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [raised, setRaised]     = useState(false)

  useEffect(() => {
    const handleScroll = () => setRaised(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      const nav  = document.getElementById('nav')
      const menu = document.getElementById('mobileMenu')
      if (nav && menu && !nav.contains(e.target) && !menu.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav id="nav" className={raised ? 'raised' : ''}>
        <Link href="/" className="logo">
          <svg className="logo-leaf" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 36 C15 36 2 26 1 14 C0 2 11 0 15 3 C19 0 30 2 29 14 C28 26 15 36 15 36Z" />
            <path d="M15 36 L15 3" stroke="#1D3314" strokeWidth="1.5" fill="none" />
          </svg>
          Zestopia
        </Link>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/#categories">Categories</Link></li>
          <li><Link href="/#story">Our Story</Link></li>
          <li><Link href="/#testi">Reviews</Link></li>
        </ul>

        <div className="nav-right">
          {/* Sign In → /signin */}
          <Link href="/signin" className="btn-nav">Sign In</Link>

          {/* Cart → /cart */}
          <Link href="/cart" className="cart-btn">
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">{cartCount}</span>
          </Link>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            id="hbg"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
        <ul>
          <li><Link href="/"           onClick={closeMenu}>Home</Link></li>
          <li><Link href="/shop"       onClick={closeMenu}>Shop</Link></li>
          <li><Link href="/#categories" onClick={closeMenu}>Categories</Link></li>
          <li><Link href="/#story"     onClick={closeMenu}>Our Story</Link></li>
          <li><Link href="/#testi"     onClick={closeMenu}>Reviews</Link></li>
          <li><Link href="/signin"     onClick={closeMenu}>Sign In</Link></li>
        </ul>
        <div className="mobile-menu-footer">
          {/* Sign In → /signin */}
          <Link href="/signin" className="btn-nav" style={{ borderRadius: '2px', textAlign: 'center' }} onClick={closeMenu}>
            Sign In
          </Link>

          {/* Cart → /cart */}
          <Link href="/cart" className="cart-btn" style={{ flexShrink: 0 }} onClick={closeMenu}>
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  )
}