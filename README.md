# 🍛 CRAVEZ — Restaurant Website

Full 3D animated React JS website for Cravez restaurant, Islamabad.

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Build for production
npm run build
```

App opens at: http://localhost:3000

---

## 📁 Project Structure

```
cravez/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── HeroCanvas.jsx     ← Animated canvas (food emojis + mouse glow)
│   │   ├── Hero.jsx           ← Hero section
│   │   ├── Navbar.jsx         ← Fixed navigation bar
│   │   ├── MenuSection.jsx    ← Menu with category filter tabs
│   │   ├── FoodCard.jsx       ← 3D tilt card for each menu item
│   │   ├── Featured.jsx       ← Nihari featured section
│   │   └── InfoSection.jsx    ← Info blocks + Cart Modal + Toast
│   ├── data/
│   │   └── menuData.js        ← All menu items data
│   ├── App.jsx                ← Root component
│   ├── index.js               ← React entry point
│   └── index.css              ← Global styles + keyframe animations
└── package.json
```

---

## ✨ Features

- **Hero Canvas** — floating food emojis that avoid your mouse cursor
- **Category Tabs** — filter menu by Paratha, Biryani, Nihari, Drinks etc.
- **3D Tilt Cards** — each food card tilts in 3D on mouse hover
- **Plate Animation** — emoji plate zooms and rotates on hover
- **Scroll Animations** — sections animate in as you scroll
- **Cart System** — add items, view cart modal, place order
- **Toast Notifications** — appear when item added to cart
- **Featured Section** — floating Nihari section with stats
- **Responsive** — works on mobile & desktop

---

## 🎨 Tech Stack

- **React 18** — hooks (useState, useEffect, useRef, useCallback)
- **Canvas API** — hero background animation
- **CSS Animations** — keyframes, transitions, perspective 3D
- **IntersectionObserver** — scroll-triggered animations

---

## 📞 Restaurant Info

- **Address:** I-10/2 Street 11 Hussain Market, Islamabad  
- **Phone:** 0311-7466370  
- **Social:** @carvez.pk
