'use client'

import { useState, useEffect } from 'react'

export default function Navbar({ cartCount, onShowToast }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    const handleScroll = () => setRaised(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      const nav = document.getElementById('nav')
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
        <a href="#home" className="logo">
          <svg
            className="logo-leaf"
            viewBox="0 0 30 38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 36 C15 36 2 26 1 14 C0 2 11 0 15 3 C19 0 30 2 29 14 C28 26 15 36 15 36Z" />
            <path d="M15 36 L15 3" stroke="#1D3314" strokeWidth="1.5" fill="none" />
          </svg>
          Zestopia
        </a>

        <ul className="nav-links">
          <li><a href="#products">Shop</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#story">Our Story</a></li>
          <li><a href="#testi">Reviews</a></li>
        </ul>

        <div className="nav-right">
          <button className="btn-nav">Sign In</button>
          <div className="cart-btn" onClick={() => onShowToast('Cart opened')}>
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">{cartCount}</span>
          </div>
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
          <li><a href="#products" onClick={closeMenu}>Shop</a></li>
          <li><a href="#categories" onClick={closeMenu}>Categories</a></li>
          <li><a href="#story" onClick={closeMenu}>Our Story</a></li>
          <li><a href="#testi" onClick={closeMenu}>Reviews</a></li>
          <li><a href="#" onClick={closeMenu}>Sign In</a></li>
        </ul>
        <div className="mobile-menu-footer">
          <button className="btn-nav" style={{ borderRadius: '2px' }}>
            Sign In
          </button>
          <div
            className="cart-btn"
            style={{ flexShrink: 0 }}
            onClick={() => {
              onShowToast('Cart opened')
              closeMenu()
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}