export default function Footer() {
  return (
    <footer>
      <div className="foot-top">
        <div>
          <a href="#" className="foot-logo">
            <svg viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 36 C15 36 2 26 1 14 C0 2 11 0 15 3 C19 0 30 2 29 14 C28 26 15 36 15 36Z" />
              <path d="M15 36 L15 3" stroke="#1D3314" strokeWidth="1.5" fill="none" />
            </svg>
            Zestopia
          </a>
          <p className="foot-desc">
            Premium masalas, pure spice powders, and handcrafted dried fruits —
            bringing authentic Bengali flavours to your kitchen.
          </p>
          <div className="socials">
            <a href="#" className="soc">fb</a>
            <a href="#" className="soc">ig</a>
            <a href="#" className="soc">yt</a>
            <a href="#" className="soc">wa</a>
          </div>
        </div>

        <div className="foot-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="#">Curry Masalas</a></li>
            <li><a href="#">Single Spices</a></li>
            <li><a href="#">Dried Fruits</a></li>
            <li><a href="#">Gift Sets</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>

        <div className="foot-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sourcing</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div className="foot-col">
          <h5>Support</h5>
          <ul>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <span className="foot-copy">© 2025 Zestopia. All rights reserved.</span>
        <div className="foot-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}