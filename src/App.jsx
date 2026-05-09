import { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OurStorySection from './components/OurStorySection';
import FoodViewer3D from './components/FoodViewer3D';
import BiryaniShowcase3D from './components/BiryaniShowcase3D';
import { InfoSection, CartModal, Toast } from './components/InfoSection';
import FoodShowcaseSection from './components/FoodShowcaseSection';
import AdminPanel from './components/AdminPanel';
import FeaturedScrollingFood from './components/FeaturedScrollingFood';
import { menuData as initialMenuData } from './data/menuData';

export default function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Dynamic Menu State
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('cravez_menu');
    return saved ? JSON.parse(saved) : initialMenuData;
  });

  useEffect(() => {
    localStorage.setItem('cravez_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const addToCart = useCallback((item) => {
    setCart(prev => [...prev, item]);
    setToast(`${item.emoji} ${item.name} added!`);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  }, []);

  const addFood = (newItem) => {
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateFood = (updatedItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteFood = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const isAdmin = window.location.pathname === '/admin';

  return (
    <>
      {!isAdmin && <Navbar cartCount={cart.length} onCartClick={() => setShowCart(true)} />}
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            
            <FeaturedScrollingFood menuItems={menuItems} onAdd={addToCart} />

            <FoodShowcaseSection
              id="paratha-showcase"
              category="paratha"
              imagePath="/assets/3d-models/food-images/Pratha.png"
              title="The Perfect Paratha"
              scale={3.6}
              description={[
                "Our parathas are crafted with tradition, layered with butter, and cooked to golden perfection on a traditional tawa.",
                "Experience the authentic taste of Islamabad's finest flatbreads, served hot and fresh.",
                "Signature Varieties: Plain Paratha, Aloo Paratha, Chicken Paratha, Qeema Paratha, Anda Paratha, and Lacha Paratha.",
                "The ultimate crispy, flaky comfort food that satisfies every craving."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="biryani-showcase"
              category="biryani"
              imagePath="/assets/3d-models/food-images/Biryani.png"
              title="Royal Chicken Biryani"
              scale={3.8}
              animation="flip"
              description={[
                "Fragrant basmati rice layered with tender, marinated chicken and a secret blend of spices.",
                "Each bite is a journey through the rich culinary heritage of the subcontinent.",
                "Menu Specials: Aloo Biryani, Chicken Biryani, and our famous Biryani Combo.",
                "The ultimate royal feast for every biryani lover."
              ]}
              onAdd={addToCart}
              reverse={true}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="pulao-showcase"
              category="pulao"
              imagePath="/assets/3d-models/food-images/Pulao.png"
              title="Aromatic Chicken Pulao"
              scale={3.8}
              animation="bounce"
              description={[
                "Light, fragrant, and cooked with long-grain basmati rice and tender chicken.",
                "The perfect balance of subtle spices and rich aroma in every single grain.",
                "Signature Pulao: Chicken Pulao and our special Pulao Combo feast.",
                "A wholesome traditional meal that feels just like home."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="specialdesi-showcase"
              category="specialdesi"
              imagePath="/assets/3d-models/food-images/Nehari.png"
              title="Legendary Beef Nihari"
              scale={4.0}
              animation="steam"
              description={[
                "Slow-cooked overnight to achieve a depth of flavor that is truly legendary.",
                "Our Nihari is rich, aromatic, and served with fresh ginger and green chilies.",
                "Available Now: Chicken Nihari, Beef Nihari, and Halwa Puri specials.",
                "A true taste of tradition that melts in your mouth."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="chanay-showcase"
              category="chanay"
              imagePath="/assets/3d-models/food-images/Chanay.png"
              title="Spiced Chanay Masala"
              scale={4.0}
              animation="spice"
              description={[
                "A morning classic in Islamabad, slow-simmered in a blend of traditional spices.",
                "Rich and savory curry that's best enjoyed with hot paratha or naan.",
                "Our Varieties: Single Plain Chanay, Full Plain Chanay, Single Murgh Chanay, Murgh Chanay, Naan Chanay, and Chanay Paratha.",
                "The perfect spicy start to your day."
              ]}
              onAdd={addToCart}
              reverse={true}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="egg-showcase"
              category="egg"
              imagePath="/assets/3d-models/food-images/Omelet.png"
              title="Fluffy Signature Omelette"
              scale={3.6}
              animation="drop"
              description={[
                "Whisked to perfection with fresh green chilies, coriander, and onions.",
                "A burst of flavor in every bite, served hot and fluffy for the ultimate breakfast.",
                "Egg Selection: Half Fry, Full Fry, Boiled Egg, and our Signature Omelette.",
                "Simple, healthy, and incredibly delicious."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="drinks-showcase"
              category="drinks"
              imagePath="/assets/3d-models/food-images/Drink.png"
              title="Refreshing Beverages"
              scale={4.2}
              animation="pour"
              description={[
                "Quench your thirst with our selection of traditional and modern drinks.",
                "From hot aromatic chai to chilled creamy lassi, perfect for any time of day.",
                "Menu Highlights: Special Chai, Dhoodh Patti, Sweet Lassi, and Soft Drinks.",
                "Freshly prepared to complement your meal perfectly."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
              reverse={true}
            />

            <FoodShowcaseSection
              id="dessert-showcase"
              category="dessert"
              imagePath="/assets/3d-models/food-images/Suji halwa.png"
              title="Sweet Dessert Delights"
              scale={4.0}
              animation="spin"
              description={[
                "Indulge in our traditional Pakistani desserts crafted with love and authentic recipes.",
                "From warm semolina halwa to creamy rice kheer, each bite is a taste of home.",
                "Menu Favorites: Suji Halwa with dry fruits, Homestyle Kheer with cardamom.",
                "The perfect sweet ending to your meal."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <FoodShowcaseSection
              id="addon-showcase"
              category="addon"
              imagePath="/assets/3d-models/food-images/Salad + shami.png"
              title="Fresh Adds On"
              scale={4.2}
              animation="snap"
              description={[
                "Complete your meal with our fresh and flavorful side dishes.",
                "Crispy Shami kababs, refreshing Salad, and cool Raita to enhance your dining experience.",
                "Menu Selection: Fresh Salad, Crispy Shami Kabab, and Cool Yogurt Raita.",
                "The perfect companions to any main course."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
              reverse={true}
            />

            <FoodShowcaseSection
              id="beverages-showcase"
              category="beverages"
              imagePath="/assets/3d-models/food-images/Chai + green tea.png"
              title="Hot & Cold Beverages"
              scale={4.0}
              animation="rise"
              description={[
                "Warm your soul with our aromatic teas or refresh with our chilled drinks.",
                "From traditional doodh patti to soothing green tea, brewed to perfection.",
                "Menu Favorites: Special Chai, Dhoodh Patti, Green Tea, Sweet & Salted Lassi.",
                "The perfect beverage for every mood and moment."
              ]}
              onAdd={addToCart}
              menuItems={menuItems}
            />

            <OurStorySection />
            <InfoSection />
          </>
        } />

        <Route path="/admin" element={
          <AdminPanel 
            onAddFood={addFood} 
            onUpdateFood={updateFood} 
            onDeleteFood={deleteFood} 
            menuItems={menuItems} 
          />
        } />
      </Routes>

      {!isAdmin && (
        <>
          {/* Footer */}
          <footer className="footer" style={{
            background: '#0a0a0a', borderTop: '1px solid #1a1a1a',
            padding: '40px', textAlign: 'center',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            <div className="brand-name" style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 32, fontWeight: 900, color: '#fff',
              letterSpacing: 2, marginBottom: 12,
            }}>
              CR<span style={{ color: '#E8541A' }}>A</span>VEZ
            </div>
            <p className="tagline" style={{ color: '#444', fontSize: 12, letterSpacing: 2 }}>
              SATISFY EVERY CRAVING™
            </p>
            <p className="address" style={{ color: '#333', fontSize: 11, marginTop: 20 }}>
              © 2025 Cravez · I-10/2 Street 11 Hussain Market, Islamabad
            </p>
          </footer>

          {/* Cart Modal */}
          {showCart && (
            <CartModal
              cart={cart}
              onClose={() => setShowCart(false)}
              onClear={clearCart}
              onRemove={removeFromCart}
            />
          )}

          {/* Toast */}
          {toast && (
            <Toast message={toast} onDone={() => setToast(null)} />
          )}

          {/* 3D Food Viewer Modal */}
          <FoodViewer3D
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAdd={(item) => {
              addToCart(item);
              setSelectedItem(null);
            }}
          />

          {/* Floating Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="floating-cart-btn"
            style={{
              position: 'fixed', bottom: 30, right: 30, zIndex: 200,
              background: '#E8541A', color: '#fff', border: 'none',
              width: 60, height: 60, borderRadius: '50%',
              fontSize: 22, cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(232,84,26,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
              animation: cart.length > 0 ? 'cartPop 0.4s' : 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🛒
          </button>
        </>
      )}
    </>
  );
}
