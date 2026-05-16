'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import './product.css'

/* ════════════════════════════════════════
   PRODUCT ILLUSTRATIONS (same as shop)
════════════════════════════════════════ */
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

/* ════════════════════════════════════════
   DEEP PRODUCT DATA
════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1, name: 'Alur Dom Masala', bn: 'আলুর দম মশলা',
    cat: 'masala', catLabel: 'Curry Masala',
    price: 145, originalPrice: 180,
    illo: 'masala_aludom', badge: 'bestseller',
    rating: 4.8, reviews: 48,
    weight: '100g', shelfLife: '12 Months', origin: 'Bangladesh',
    shortDesc: 'Aromatic potato curry blend with whole spices — the secret behind a perfect Alur Dom.',
    longDesc: [
      'Our Alur Dom Masala is a carefully crafted blend of 14 whole and powdered spices, developed over generations in traditional Bengali households. Every batch is stone-ground in small quantities to preserve the volatile essential oils that give this masala its characteristic warmth and depth.',
      'The blend strikes a perfect balance between the earthiness of coriander and cumin, the heat of dried red chilli, and the fragrant sweetness of cinnamon and cardamom. A touch of sun-dried mango powder adds the subtle tang that lifts the whole dish.',
      'Use it as your base for the iconic Bengali Alur Dom or experiment with it in stuffed parathas, egg curries, and mixed vegetable dishes. The versatility of this masala makes it an essential pantry staple.'
    ],
    features: [
      { title: 'Stone-Ground', desc: 'Slow-ground on traditional stone mills to retain maximum flavour and aroma.' },
      { title: 'No Preservatives', desc: 'Absolutely no artificial colours, fillers, or chemical preservatives.' },
      { title: 'Small Batch', desc: 'Crafted in small batches to ensure freshness and consistent quality.' },
      { title: 'Airtight Pack', desc: 'Resealable, moisture-proof packaging locks in freshness for up to 12 months.' },
    ],
    ingredients: ['Coriander Seeds', 'Cumin', 'Dried Red Chilli', 'Turmeric', 'Black Pepper', 'Cinnamon', 'Cardamom', 'Cloves', 'Bay Leaf', 'Fennel Seeds', 'Dried Mango Powder', 'Ginger Powder', 'Fenugreek Seeds', 'Rock Salt'],
    nutrition: [
      { label: 'Serving Size', value: '5g (1 tsp)' },
      { label: 'Calories', value: '18 kcal' },
      { label: 'Total Fat', value: '0.8g' },
      { label: 'Carbohydrates', value: '3.2g' },
      { label: 'Protein', value: '0.7g' },
      { label: 'Sodium', value: '95mg' },
      { label: 'Dietary Fibre', value: '1.1g' },
    ],
    steps: [
      { title: 'Heat Oil', desc: 'Heat 2 tbsp mustard oil in a kadhai over medium flame until it shimmers lightly.' },
      { title: 'Temper Whole Spices', desc: 'Add a bay leaf and dried red chilli. Allow them to sizzle for 20 seconds until fragrant.' },
      { title: 'Fry Onion', desc: 'Add finely sliced onion and cook until golden — about 8 minutes on medium-low heat.' },
      { title: 'Add Masala', desc: 'Add 1–2 tsp Alur Dom Masala along with a splash of water to form a paste. Cook 2 minutes.' },
      { title: 'Add Potatoes', desc: 'Add parboiled baby potatoes, coat in the masala, and cook covered on low heat for 10 minutes.' },
      { title: 'Finish & Serve', desc: 'Add a pinch of sugar, stir, and garnish with fresh coriander. Serve with luchi or paratha.' },
    ],
    recipe: {
      title: 'Classic Bengali Alur Dom',
      items: ['500g baby potatoes (parboiled)', '2 tsp Alur Dom Masala', '2 tbsp mustard oil', '1 onion, finely sliced', 'Salt & sugar to taste', 'Fresh coriander to garnish'],
      note: 'Tip: A teaspoon of ghee stirred in at the end takes this dish to the next level of richness.'
    },
    reviewsList: [
      { name: 'Rashida Begum', loc: 'Dhaka', init: 'R', rating: 5, date: 'March 2025', body: 'This masala completely transformed my Sunday Alur Dom. My husband said it tasted just like his grandmother\'s cooking — I could not believe it came from a packet. The aroma alone fills the whole kitchen.', tag: 'Verified Purchase' },
      { name: 'Karim Uddin', loc: 'Chittagong', init: 'K', rating: 5, date: 'February 2025', body: 'I\'ve tried a dozen brands and none come close. The balance of spices is perfect — not too hot, not too mild. You can taste the quality of each ingredient. Ordered three packs this time.', tag: 'Verified Purchase' },
      { name: 'Sultana Noor', loc: 'Sylhet', init: 'S', rating: 4, date: 'January 2025', body: 'Excellent quality and the packaging keeps it very fresh. Delivery was fast. I only wish they also offered a larger 200g pack for families who cook daily.', tag: 'Verified Purchase' },
      { name: 'Farhan Rahman', loc: 'Rajshahi', init: 'F', rating: 5, date: 'December 2024', body: 'As someone who grew up in a Bengali household but now lives abroad, this masala brings me right back home. The authenticity is unmatched. Will keep reordering.', tag: 'Regular Customer' },
    ],
    ratingDist: [
      { stars: 5, pct: 72 },
      { stars: 4, pct: 18 },
      { stars: 3, pct: 6  },
      { stars: 2, pct: 3  },
      { stars: 1, pct: 1  },
    ],
    related: [2, 3, 6, 7],
  },
  {
    id: 2, name: 'Achar Masala', bn: 'আচার মশলা',
    cat: 'masala', catLabel: 'Curry Masala',
    price: 130, originalPrice: 160,
    illo: 'masala_achar', badge: 'new',
    rating: 4.5, reviews: 22,
    weight: '80g', shelfLife: '18 Months', origin: 'Bangladesh',
    shortDesc: 'Tangy, zesty pickle spice mix for the most flavorful homemade achars and chutneys.',
    longDesc: [
      'Our Achar Masala is an authentic blend of the tangy, pungent, and deeply fragrant spices traditionally used in Bengali and South Asian pickles. Crafted without any artificial additives, this masala gives your homemade achars a professional-quality depth.',
      'The core of this blend is an interplay of fenugreek seeds, nigella seeds, and fennel — balanced with dried red chilli and turmeric. Mustard seeds add the characteristic sharpness expected of a proper achar masala.',
      'Use it to make raw mango pickle, mixed vegetable achar, or even as a finishing spice for street-food chaats and bhel puri.'
    ],
    features: [
      { title: 'No Artificial Colours', desc: 'Pure natural spice colour — what you see is the real ingredient.' },
      { title: 'Multi-Purpose', desc: 'Works for mango, mixed vegetable, garlic, and lime pickles alike.' },
      { title: 'Stone-Ground', desc: 'Partially stone-ground for texture and partially whole for aroma.' },
      { title: 'Long Shelf Life', desc: 'Up to 18 months sealed — stays vibrant throughout your pantry.' },
    ],
    ingredients: ['Fenugreek Seeds', 'Nigella Seeds', 'Fennel Seeds', 'Yellow Mustard', 'Dried Red Chilli', 'Turmeric', 'Asafoetida', 'Coriander Seeds', 'Black Mustard Seeds', 'Rock Salt', 'Dried Mango Powder'],
    nutrition: [
      { label: 'Serving Size', value: '3g (½ tsp)' },
      { label: 'Calories', value: '11 kcal' },
      { label: 'Total Fat', value: '0.5g' },
      { label: 'Carbohydrates', value: '1.8g' },
      { label: 'Protein', value: '0.5g' },
      { label: 'Sodium', value: '62mg' },
      { label: 'Dietary Fibre', value: '0.7g' },
    ],
    steps: [
      { title: 'Wash & Dry Produce', desc: 'Thoroughly wash and completely sun-dry your vegetables or fruit. No moisture should remain.' },
      { title: 'Prepare Oil', desc: 'Heat mustard oil until smoking, then let cool to room temperature before using.' },
      { title: 'Mix Masala', desc: 'Combine 2 tsp Achar Masala with the cooled oil to form your pickle base.' },
      { title: 'Coat Ingredients', desc: 'Toss the dried produce in the masala-oil mixture until fully coated.' },
      { title: 'Jar & Sun', desc: 'Pack tightly into a sterilised glass jar. Place in direct sunlight for 2–3 days, shaking daily.' },
      { title: 'Mature & Enjoy', desc: 'Taste after 1 week for a fresh achar or wait 2–3 weeks for deeper, mature flavour.' },
    ],
    recipe: {
      title: 'Quick Raw Mango Achar',
      items: ['2 raw mangoes, cut into pieces', '2 tsp Achar Masala', '4 tbsp mustard oil', '1 tsp salt', '½ tsp sugar', 'Sterilised glass jar'],
      note: 'Tip: Adding a pinch of asafoetida (hing) to the oil before mixing deepens the traditional flavour significantly.'
    },
    reviewsList: [
      { name: 'Nasrin Akter', loc: 'Dhaka', init: 'N', rating: 5, date: 'April 2025', body: 'Made mango achar for the first time ever using this masala and it came out perfectly. The balance of spices is spot on. My mother was impressed — that says everything!', tag: 'Verified Purchase' },
      { name: 'Iqbal Hossain', loc: 'Comilla', init: 'I', rating: 4, date: 'March 2025', body: 'Very authentic taste. I\'ve used other brands before but this one has a depth and aroma that the others lack. The nigella seeds are a lovely touch.', tag: 'Verified Purchase' },
      { name: 'Riya Sen', loc: 'Khulna', init: 'R', rating: 4, date: 'February 2025', body: 'Good product and arrived quickly. The masala is fragrant and tangy. Would love a slightly spicier version for those of us who like extra heat!', tag: 'Verified Purchase' },
    ],
    ratingDist: [
      { stars: 5, pct: 60 }, { stars: 4, pct: 28 }, { stars: 3, pct: 8 }, { stars: 2, pct: 4 }, { stars: 1, pct: 0 },
    ],
    related: [1, 3, 6, 7],
  },
  {
    id: 3, name: 'Murgir Mangshor Masala', bn: 'মুরগির মাংসের মশলা',
    cat: 'masala', catLabel: 'Curry Masala',
    price: 160, originalPrice: 200,
    illo: 'masala_chicken', badge: 'hot',
    rating: 4.9, reviews: 87,
    weight: '120g', shelfLife: '12 Months', origin: 'Bangladesh',
    shortDesc: 'Rich, fragrant chicken curry masala with 18 premium spices — bold and deeply authentic.',
    longDesc: [
      'Our Murgir Mangshor Masala is the product of decades of recipe refinement in Bengali homes. This premium 18-spice blend delivers the deep colour, complex aroma, and layered heat that characterises a perfect Bengali chicken curry.',
      'We use a combination of slow-roasted and raw spices to create dimension — the roasted notes of cumin and coriander meet the freshness of green cardamom and the warm sweetness of mace. Every element is sourced directly from trusted farms.',
      'Whether you are making a simple weeknight chicken curry, a celebratory Eid main dish, or marinating chicken for the grill, this masala works across every method and occasion.'
    ],
    features: [
      { title: '18-Spice Blend', desc: 'A meticulously balanced combination of 18 hand-selected whole and ground spices.' },
      { title: 'Slow-Roasted', desc: 'Key spices are dry-roasted before grinding for a richer, deeper flavour profile.' },
      { title: 'Rich Colour', desc: 'Natural deep reddish-amber colour from quality chilli and turmeric — no artificial dye.' },
      { title: 'Marination Ready', desc: 'Works brilliantly as a dry rub or mixed with yoghurt for overnight marination.' },
    ],
    ingredients: ['Coriander', 'Cumin', 'Turmeric', 'Red Chilli', 'Black Pepper', 'Green Cardamom', 'Black Cardamom', 'Cinnamon', 'Cloves', 'Mace', 'Nutmeg', 'Bay Leaf', 'Fennel', 'Star Anise', 'Ginger', 'Garlic Powder', 'Dried Rose Petals', 'Rock Salt'],
    nutrition: [
      { label: 'Serving Size', value: '8g (1½ tsp)' },
      { label: 'Calories', value: '24 kcal' },
      { label: 'Total Fat', value: '1.1g' },
      { label: 'Carbohydrates', value: '4.3g' },
      { label: 'Protein', value: '1.0g' },
      { label: 'Sodium', value: '140mg' },
      { label: 'Dietary Fibre', value: '1.8g' },
    ],
    steps: [
      { title: 'Marinate Chicken', desc: 'Combine chicken with 1 tsp masala, yoghurt, and lemon juice. Rest 30 minutes minimum.' },
      { title: 'Caramelise Onion', desc: 'Cook sliced onion in oil until deep golden brown — do not rush this step.' },
      { title: 'Bloom Masala', desc: 'Add 1.5 tsp masala with ginger-garlic paste, cook until oil separates.' },
      { title: 'Add Tomatoes', desc: 'Add chopped tomatoes and cook down to a thick, jammy masala base.' },
      { title: 'Cook Chicken', desc: 'Add marinated chicken, coat thoroughly, and cook covered for 25 minutes.' },
      { title: 'Finish with Ghee', desc: 'Stir in 1 tsp ghee and fresh coriander. Rest 5 minutes before serving.' },
    ],
    recipe: {
      title: 'Bengali Murgir Jhol',
      items: ['1kg chicken, cut into pieces', '2 tsp Murgir Masala', '3 onions, sliced', '2 tomatoes, chopped', '3 tbsp oil + 1 tsp ghee', 'Ginger-garlic paste, yoghurt, salt'],
      note: 'Tip: For a restaurant-style finish, add a whole cardamom and bay leaf to the oil before the onion.'
    },
    reviewsList: [
      { name: 'Fatema Khanam', loc: 'Dhaka', init: 'F', rating: 5, date: 'April 2025', body: 'My chicken curry has never tasted this good. The masala gives it such an authentic depth — exactly like what I grew up eating. My whole family finished the pot in one sitting.', tag: 'Verified Purchase' },
      { name: 'Monir Hossain', loc: 'Narayanganj', init: 'M', rating: 5, date: 'March 2025', body: 'I run a small home-catering business and this has become my secret ingredient. Customers always ask what makes my chicken curry different. Now they know!', tag: 'Regular Customer' },
      { name: 'Dilruba Akter', loc: 'Sylhet', init: 'D', rating: 5, date: 'February 2025', body: 'Ordered based on a friend\'s recommendation and am blown away. The aroma when you open the pack is incredible. Goes into everything now — not just chicken!', tag: 'Verified Purchase' },
      { name: 'Rafiq Islam', loc: 'Barisal', init: 'R', rating: 4, date: 'January 2025', body: 'Very good quality and authentic flavour. Packaging is excellent and delivery was prompt. Slightly wish there was a mild version for cooking for children.', tag: 'Verified Purchase' },
    ],
    ratingDist: [
      { stars: 5, pct: 80 }, { stars: 4, pct: 14 }, { stars: 3, pct: 4 }, { stars: 2, pct: 2 }, { stars: 1, pct: 0 },
    ],
    related: [4, 5, 1, 6],
  },
]

// Fallback product for unknown IDs
const FALLBACK = PRODUCTS[0]

const TICKER_ITEMS = [
  'Free Shipping Over ৳500', '100% Natural — No Preservatives', 'Stone-Ground Masalas',
  'Authentic Bengali Recipes', 'Sun-Dried Fruits & Snacks', 'Same-Day Dispatch',
]

const ALL_PRODS_BRIEF = [
  { id:1,  name:'Alur Dom Masala',         cat:'masala', price:'৳145', illo:'masala_aludom'  },
  { id:2,  name:'Achar Masala',            cat:'masala', price:'৳130', illo:'masala_achar'   },
  { id:3,  name:'Murgir Mangshor Masala',  cat:'masala', price:'৳160', illo:'masala_chicken' },
  { id:4,  name:'Khashir Mangshor Masala', cat:'masala', price:'৳175', illo:'masala_mutton'  },
  { id:5,  name:'Gorur Mangshor Masala',   cat:'masala', price:'৳175', illo:'masala_beef'    },
  { id:6,  name:'Amchoor Powder',          cat:'spice',  price:'৳120', illo:'spice_amchoor'  },
  { id:7,  name:'Ada Powder',              cat:'spice',  price:'৳110', illo:'spice_ginger'   },
  { id:8,  name:'Dry Kola o Badam Bite',   cat:'dry',    price:'৳190', illo:'dry_banana'     },
  { id:9,  name:'Dry Anarosh',             cat:'dry',    price:'৳165', illo:'dry_pineapple'  },
  { id:10, name:'Dry Apple',               cat:'dry',    price:'৳180', illo:'dry_apple'      },
]

function catLabel(c) {
  return c === 'masala' ? 'Curry Masala' : c === 'spice' ? 'Single Spice' : 'Dried Fruit & Snack'
}

function badgeCls(b) {
  const map = { bestseller: ['badge-new', 'Best Seller'], new: ['badge-new', 'New'], hot: ['badge-hot', 'Popular'], fresh: ['badge-fr', 'Fresh'] }
  return map[b] || null
}

function StarRow({ rating, size = 14, className = '' }) {
  const sp = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  return (
    <div className={`pd-stars ${className}`}>
      {[1,2,3,4,5].map(i => {
        const cls = i <= Math.floor(rating) ? 'pd-star-full' : i - rating < 1 ? 'pd-star-half' : 'pd-star-empty'
        return <svg key={i} className={cls} viewBox="0 0 24 24"><path d={sp}/></svg>
      })}
    </div>
  )
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ProductDetailPage() {
  const params    = useParams()
  const productId = parseInt(params?.id) || 1
  const product   = PRODUCTS.find(p => p.id === productId) || FALLBACK

  const [cartCount, setCartCount] = useState(0)
  const [wished, setWished]       = useState(false)
  const [qty, setQty]             = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [toast, setToast]         = useState({ msg: '', show: false })
  const toastTimer                = useRef(null)
  const [stickyVisible, setStickyVisible] = useState(false)
  const heroRef                   = useRef(null)
  const tabsSectionRef            = useRef(null)

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const relatedProds = (product.related || [1,2,3,4]).map(id => ALL_PRODS_BRIEF.find(p => p.id === id)).filter(Boolean).slice(0,4)

  const switchTab = (key) => {
    setActiveTab(key)
    if (tabsSectionRef.current) {
      const navHeight = 70
      const top = tabsSectionRef.current.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2600)
  }, [])

  const addToCart = () => {
    setCartCount(c => c + qty)
    showToast(`${qty}× ${product.name} added to cart`)
  }

  const toggleWish = () => {
    setWished(w => {
      showToast(!w ? 'Saved to wishlist ♥' : 'Removed from wishlist')
      return !w
    })
  }

  /* sticky bar visibility */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold: 0 })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  /* tabs */
  const TABS = [
    { key: 'description', label: 'Description' },
    { key: 'ingredients', label: 'Ingredients & Nutrition' },
    { key: 'howto',       label: 'How to Use' },
    { key: 'reviews',     label: `Reviews (${product.reviews})` },
  ]

  return (
    <>
      <Navbar cartCount={cartCount} onShowToast={showToast} />

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}><span className="ticker-sep"></span>{item}</span>
          ))}
        </div>
      </div>

      {/* BREADCRUMB */}
      <nav className="pd-breadcrumb" aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <svg className="pd-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <Link href="/shop">Shop</Link>
        <svg className="pd-breadcrumb-sep" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="bc-current">{product.name}</span>
      </nav>

      {/* ════ HERO SPLIT ════ */}
      <div className="pd-hero" ref={heroRef}>

        {/* GALLERY */}
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {[product.illo, product.illo, product.illo].map((illo, i) => (
              <div key={i} className={`pd-thumb${i === 0 ? ' active' : ''}`}>
                <div className="pd-thumb-inner" dangerouslySetInnerHTML={{ __html: ILLOS[illo] || '' }} />
              </div>
            ))}
          </div>
          <div className="pd-main-img">
            {/* Badge */}
            {badgeCls(product.badge) && (
              <span className={`pd-badge-main ${badgeCls(product.badge)[0]}`}>
                {badgeCls(product.badge)[1]}
              </span>
            )}
            {/* Wishlist */}
            <div className={`pd-wish-main${wished ? ' on' : ''}`} onClick={toggleWish}>
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            {/* Main illustration */}
            <div className="pd-main-illo" dangerouslySetInnerHTML={{ __html: ILLOS[product.illo] || '' }} />
            {/* Zoom hint */}
            <div className="pd-zoom-hint">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Hover to zoom
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="pd-info">
          {/* Category label */}
          <div className="pd-cat-label">
            <span className="pd-cat-pill">{product.catLabel}</span>
            <span className="pd-cat-pipe"></span>
            <span style={{ fontSize: '.65rem', color: 'var(--light)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              {product.weight} pack
            </span>
          </div>

          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-bn">{product.bn}</div>

          {/* Stars */}
          <div className="pd-stars-row">
            <StarRow rating={product.rating} />
            <span className="pd-rating-num">{product.rating}</span>
            <span className="pd-pipe-sep"></span>
            <span className="pd-rating-count">{product.reviews} reviews</span>
            <span className="pd-pipe-sep"></span>
            <span style={{ fontSize: '.72rem', color: 'var(--green-mid)', fontWeight: 600 }}>In Stock</span>
          </div>

          {/* Price */}
          <div className="pd-price-row">
            <div>
              <div className="pd-price-main">৳{product.price}</div>
              <div className="pd-price-unit">per {product.weight} pack</div>
            </div>
            <div>
              <div className="pd-price-original">৳{product.originalPrice}</div>
              <div className="pd-price-saving">Save {discount}%</div>
            </div>
          </div>

          {/* Quick pills */}
          <div className="pd-quick-pills">
            <span className="pd-qpill">
              <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              100% Natural
            </span>
            <span className="pd-qpill">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              No Preservatives
            </span>
            <span className="pd-qpill">
              <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Fast Delivery
            </span>
            <span className="pd-qpill">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Origin: {product.origin}
            </span>
          </div>

          <div className="pd-divider"></div>

          {/* Short description */}
          <p style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'var(--muted)', marginBottom: '1.8rem' }}>
            {product.shortDesc}
          </p>

          {/* Qty + Add */}
          <div className="pd-qty-row">
            <span className="pd-qty-label">Quantity</span>
            <div className="pd-qty-ctrl">
              <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <div className="pd-qty-num">{qty}</div>
              <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div className="pd-cta-row">
            <button className="pd-btn-cart-main" onClick={addToCart}>
              <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Add to Cart
            </button>
            <button className="pd-btn-buy" onClick={() => showToast('Redirecting to checkout…')}>
              Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="pd-delivery-box">
            <div className="pd-delivery-item">
              <div className="pd-del-icon">
                <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <div className="pd-del-text">
                <strong>Free Delivery on orders over ৳500</strong>
                Same-day dispatch for orders placed before 2 PM
              </div>
            </div>
            <div className="pd-delivery-item">
              <div className="pd-del-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
              </div>
              <div className="pd-del-text">
                <strong>Shelf Life: {product.shelfLife}</strong>
                Store in a cool, dry place away from direct sunlight
              </div>
            </div>
            <div className="pd-delivery-item">
              <div className="pd-del-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <div className="pd-del-text">
                <strong>Expert Support Available</strong>
                7 days a week — recipe help, bulk orders, gifting
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="pd-share-row">
            <span className="pd-share-label">Share</span>
            {['fb', 'ig', 'wa', 'tw'].map(s => (
              <div key={s} className="pd-share-btn">{s}</div>
            ))}
            <div className="pd-share-btn" title="Copy link">
              <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ════ TABS ════ */}
      <div className="pd-tabs-section" ref={tabsSectionRef}>
        <nav className="pd-tabs-nav">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`pd-tab-btn${activeTab === t.key ? ' active' : ''}`}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="pd-tab-content">

          {/* ── DESCRIPTION ── */}
          <div className={`pd-tab-panel${activeTab === 'description' ? ' active' : ''}`}>
            <div className="pd-desc-grid">
              <div>
                <div className="pd-desc-long">
                  {product.longDesc.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
              <div>
                <ul className="pd-features-list">
                  {product.features.map((f, i) => (
                    <li key={i}>
                      <div className="pd-feat-icon">
                        <svg viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                      </div>
                      <div className="pd-feat-text">
                        <strong>{f.title}</strong>
                        {f.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── INGREDIENTS ── */}
          <div className={`pd-tab-panel${activeTab === 'ingredients' ? ' active' : ''}`}>
            <div className="pd-ingr-grid">
              <div>
                <h3 className="pd-ingr-title">What's <em>Inside</em></h3>
                <p className="pd-ingr-text">
                  Every ingredient is hand-selected, cleaned, and processed with care. We use only
                  whole or freshly ground spices — no fillers, no artificial flavour enhancers.
                </p>
                <div className="pd-spice-tags">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="pd-spice-tag">{ing}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="pd-nutrition-box">
                  <div className="pd-nutr-head">Nutrition Information</div>
                  <table className="pd-nutr-table">
                    <tbody>
                      {product.nutrition.map((row, i) => (
                        <tr key={i}>
                          <td>{row.label}</td>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '.7rem', color: 'var(--light)', marginTop: '.8rem', lineHeight: 1.6 }}>
                  * Values are approximate. Actual nutritional content may vary slightly by batch.
                  Consult a nutritionist for dietary advice.
                </p>
              </div>
            </div>
          </div>

          {/* ── HOW TO USE ── */}
          <div className={`pd-tab-panel${activeTab === 'howto' ? ' active' : ''}`}>
            <div className="pd-howto-grid">
              <div>
                <h3 className="pd-ingr-title">Step-by-Step <em>Guide</em></h3>
                <div className="pd-steps">
                  {product.steps.map((step, i) => (
                    <div key={i} className="pd-step">
                      <div className="pd-step-num">{i + 1}</div>
                      <div className="pd-step-body">
                        <div className="pd-step-title">{step.title}</div>
                        <div className="pd-step-desc">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="pd-recipe-box">
                  <div className="pd-recipe-tag">Featured Recipe</div>
                  <h4 className="pd-recipe-title"><em>{product.recipe.title}</em></h4>
                  <ul className="pd-recipe-list">
                    {product.recipe.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p className="pd-recipe-note">{product.recipe.note}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── REVIEWS ── */}
          <div className={`pd-tab-panel${activeTab === 'reviews' ? ' active' : ''}`}>
            <div className="pd-reviews-header">
              <div className="pd-rating-big">
                <div className="pd-rating-score">{product.rating}</div>
                <div className="pd-rating-out">out of 5</div>
                <StarRow rating={product.rating} />
                <div className="pd-total-rev">{product.reviews} reviews</div>
              </div>
              <div className="pd-rating-bars">
                {product.ratingDist.map((row) => (
                  <div key={row.stars} className="pd-bar-row">
                    <span className="pd-bar-label">{row.stars}★</span>
                    <div className="pd-bar-track">
                      <div className="pd-bar-fill" style={{ width: `${row.pct}%` }}></div>
                    </div>
                    <span className="pd-bar-pct">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-reviews-list">
              {product.reviewsList.map((rev, i) => (
                <div key={i} className="pd-review-card">
                  <div className="pd-rev-top">
                    <div className="pd-rev-author">
                      <div className="pd-rev-av">{rev.init}</div>
                      <div>
                        <div className="pd-rev-name">{rev.name}</div>
                        <div className="pd-rev-loc">{rev.loc}</div>
                      </div>
                    </div>
                    <span className="pd-rev-date">{rev.date}</span>
                  </div>
                  <div className="pd-rev-stars">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="pd-star-full" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="pd-rev-body">"{rev.body}"</p>
                  <span className="pd-rev-tag">
                    <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/></svg>
                    {rev.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ════ TRUST BAR ════ */}
      <div className="pd-trust-bar">
        {[
          { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, title: '100% Pure & Natural', sub: 'No fillers or artificial additives' },
          { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`, title: 'Nationwide Delivery', sub: 'Fast dispatch across Bangladesh' },
          { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`, title: 'Farm-Direct Sourcing', sub: 'Shorter supply chain, fresher product' },
          { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`, title: 'Expert Support', sub: '7 days a week, always here' },
        ].map((item, i) => (
          <div key={i} className="pd-trust-item">
            <div className="pd-trust-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
            <div className="pd-trust-text">
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ════ RELATED PRODUCTS ════ */}
      <section className="pd-related">
        <div className="pd-related-head">
          <div>
            <div className="pd-sec-label"><span>You May Also Like</span></div>
            <h2 className="pd-sec-title">Related <em>Products</em></h2>
          </div>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="pd-rel-grid">
          {relatedProds.map(p => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="pd-rel-card">
                <div className="pd-rel-img">
                  <div className="pd-rel-illo" dangerouslySetInnerHTML={{ __html: ILLOS[p.illo] || '' }} />
                </div>
                <div className="pd-rel-body">
                  <div className="pd-rel-cat">{catLabel(p.cat)}</div>
                  <div className="pd-rel-name">{p.name}</div>
                  <div className="pd-rel-foot">
                    <span className="pd-rel-price">{p.price}</span>
                    <button
                      className="pd-rel-add"
                      onClick={e => { e.preventDefault(); setCartCount(c => c + 1); showToast(`${p.name} added to cart`) }}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      {/* ════ STICKY BOTTOM BAR (mobile) ════ */}
      <div className={`pd-sticky-bar${stickyVisible ? ' show' : ''}`} style={{ display: stickyVisible ? 'flex' : 'none' }}>
        <div className="pd-sticky-info">
          <div className="pd-sticky-name">{product.name}</div>
          <div className="pd-sticky-price">৳{product.price}</div>
        </div>
        <div className="pd-sticky-btns">
          <button
            className={`pd-sticky-wish${wished ? ' on' : ''}`}
            onClick={toggleWish}
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
          <button className="pd-sticky-cart" onClick={addToCart}>
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Add to Cart
          </button>
        </div>
      </div>

      {/* TOAST */}
      <div className={`pd-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </>
  )
}