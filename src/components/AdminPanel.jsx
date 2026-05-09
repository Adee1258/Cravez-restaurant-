import React, { useState, useRef, useEffect } from 'react';
import { categories } from '../data/menuData';

// Auth helpers
const getStoredCreds = () => {
  const user = localStorage.getItem('cravez_admin_username');
  const pass = localStorage.getItem('cravez_admin_password');
  return {
    username: user || 'admin',
    password: pass || 'admin123'
  };
};

export default function AdminPanel({ onAddFood, onUpdateFood, onDeleteFood, menuItems }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [activeTab, setActiveTab] = useState('add-food'); // 'add-food', 'edit-menu', 'profile', 'privacy', 'analytics', 'settings'
  
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    cat: 'paratha',
    price: '',
    image: '',
    desc: '',
    badge: '',
    featured: false
  });

  const [message, setMessage] = useState('');

  // Profile settings state
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  const storedCreds = getStoredCreds();

  const handleLogin = (e) => {
    e.preventDefault();
    const creds = getStoredCreds();
    if (loginUser === creds.username && loginPass === creds.password) {
      setIsLoggedIn(true);
      setCurrentUsername(creds.username);
      setCurrentPassword(creds.password);
    } else {
      alert('Invalid username or password! Try again.');
    }
  };

  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setProfileMessage('Username and password cannot be empty!');
      setTimeout(() => setProfileMessage(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileMessage('Passwords do not match!');
      setTimeout(() => setProfileMessage(''), 3000);
      return;
    }
    localStorage.setItem('cravez_admin_username', newUsername.trim());
    localStorage.setItem('cravez_admin_password', newPassword.trim());
    setCurrentUsername(newUsername.trim());
    setCurrentPassword(newPassword.trim());
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setProfileMessage('Credentials updated successfully!');
    setTimeout(() => setProfileMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert('Please fill at least name, price, and add an image');
      return;
    }

    if (editingItem) {
      onUpdateFood({
        ...formData,
        id: editingItem.id,
        price: parseInt(formData.price)
      });
      setMessage(`Successfully updated ${formData.name}!`);
      setEditingItem(null);
      setActiveTab('edit-menu');
    } else {
      const newItem = {
        ...formData,
        id: Date.now(), // Unique ID
        price: parseInt(formData.price)
      };
      onAddFood(newItem);
      setMessage(`Successfully added ${formData.name} to ${formData.cat}!`);
    }
    
    // Reset form
    setFormData({
        name: '',
        cat: 'paratha',
        price: '',
        image: '',
        desc: '',
        badge: '',
        featured: false
      });
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setMessage(''), 3000);
    };

    const startEdit = (item) => {
      setEditingItem(item);
      setFormData({
        name: item.name,
        cat: item.cat,
        price: item.price.toString(),
        image: item.image,
        desc: item.desc || '',
        badge: item.badge || '',
        featured: item.featured || false
      });
      setActiveTab('add-food');
    };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDeleteFood(id);
    }
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1a120b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{
          background: '#231a12',
          padding: '50px',
          borderRadius: '16px',
          border: '1px solid rgba(232,84,26,0.15)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 8,
            letterSpacing: 2
          }}>
            CR<span style={{ color: '#E8541A' }}>A</span>VEZ
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#E8541A', marginBottom: '30px', fontSize: 20 }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              style={{
                ...inputStyle,
                width: '100%',
                marginBottom: '12px',
                textAlign: 'center',
                fontSize: '16px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              style={{
                ...inputStyle,
                width: '100%',
                marginBottom: '24px',
                textAlign: 'center',
                fontSize: '16px'
              }}
            />
            <button type="submit" style={{
              width: '100%',
              background: '#E8541A',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}>
              UNLOCK DASHBOARD
            </button>
          </form>
          <p style={{ color: '#555', marginTop: '20px', fontSize: '12px' }}>
            Default: {storedCreds.username} / {storedCreds.password}
          </p>
        </div>
      </div>
    );
  }

  // Sidebar Component
  const Sidebar = () => (
    <div style={{
      width: '280px',
      background: '#1e150d',
      borderRight: '1px solid rgba(232,84,26,0.15)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 10
    }}>
      <div style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: '24px', 
        fontWeight: '900', 
        color: '#fff', 
        marginBottom: '40px',
        paddingLeft: '15px'
      }}>
        CR<span style={{ color: '#E8541A' }}>A</span>VEZ <span style={{fontSize: '12px', color: '#666'}}>ADMIN</span>
      </div>

      <SidebarItem 
        label={editingItem ? "Editing Item" : "Add New Food"} 
        icon="➕" 
        active={activeTab === 'add-food'} 
        onClick={() => setActiveTab('add-food')} 
      />
      <SidebarItem 
        label="Edit Menu" 
        icon="📝" 
        active={activeTab === 'edit-menu'} 
        onClick={() => {
          setActiveTab('edit-menu');
          setEditingItem(null);
        }} 
      />
      <SidebarItem 
        label="Admin Profile" 
        icon="👤" 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')} 
      />
      <SidebarItem 
        label="Privacy Policy" 
        icon="🔒" 
        active={activeTab === 'privacy'} 
        onClick={() => setActiveTab('privacy')} 
      />
      <SidebarItem 
        label="Analytics" 
        icon="📊" 
        active={activeTab === 'analytics'} 
        onClick={() => setActiveTab('analytics')} 
      />
      <SidebarItem 
        label="Settings" 
        icon="⚙️" 
        active={activeTab === 'settings'} 
        onClick={() => setActiveTab('settings')} 
      />

      <div style={{ marginTop: 'auto', padding: '15px' }}>
        <button 
          onClick={() => {
            setIsLoggedIn(false);
            window.location.href = '/';
          }}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            color: '#666',
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );

  const SidebarItem = ({ label, icon, active, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        padding: '15px 20px',
        borderRadius: '12px',
        background: active ? 'rgba(232, 84, 26, 0.1)' : 'transparent',
        color: active ? '#E8541A' : '#888',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        transition: 'all 0.3s ease',
        fontWeight: active ? 'bold' : 'normal'
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a120b',
      color: '#fff',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '60px 80px' }}>
        
        {activeTab === 'add-food' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '10px' }}>
              {editingItem ? 'Edit Food Item' : 'Add Food Item'}
            </h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>
              {editingItem ? `Currently editing: ${editingItem.name}` : 'Fill the details below to add a new dish to the live menu.'}
            </p>

            {message && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid #4CAF50',
                color: '#4CAF50',
                padding: '15px',
                marginBottom: '30px',
                borderRadius: '8px'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '25px',
              background: '#231a12',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(232,84,26,0.15)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Food Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Cheese Paratha" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Category</label>
                <select name="cat" value={formData.cat} onChange={handleChange} style={inputStyle} >
                  {categories.filter(c => c.key !== 'all').map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Price (Rs)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 150" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Food Image (Local Upload)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  style={{...inputStyle, padding: '10px'}} 
                />
              </div>

              {formData.image && (
                <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #E8541A' }} 
                  />
                  <p style={{fontSize: '10px', color: '#444', marginTop: '5px'}}>Image Preview</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder="Brief description of the dish..." style={{ ...inputStyle, height: '100px', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Badge (Optional)</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. New, Popular" style={inputStyle} />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                <button type="submit" style={{
                  width: '100%',
                  background: '#E8541A',
                  color: '#fff',
                  border: 'none',
                  padding: '20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease'
                }}>
                  {editingItem ? 'Update Item' : 'Push to Menu'}
                </button>
                {editingItem && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({ name: '', cat: 'paratha', price: '', image: '', desc: '', badge: '' });
                    }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      color: '#666',
                      border: '1px solid #333',
                      padding: '10px',
                      fontSize: '12px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      borderRadius: '8px'
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'edit-menu' && (
          <div style={{ maxWidth: '900px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '10px' }}>Edit Menu</h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>Update or delete items from your live menu categories.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {menuItems.slice().reverse().map(item => (
                <div key={item.id} style={{
                  background: '#231a12',
                  padding: '20px 25px',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(232,84,26,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '18px' }}>{item.name}</div>
                      <div style={{ color: '#E8541A', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.cat}</div>
                      <div style={{ color: '#444', fontSize: '12px' }}>Rs. {item.price}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => onUpdateFood({...item, featured: !item.featured})}
                      style={{
                        background: item.featured ? '#E8541A' : 'transparent',
                        color: item.featured ? '#fff' : '#E8541A',
                        border: '1px solid #E8541A',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                      }}
                    >
                      {item.featured ? '🌟 Featured' : '☆ Feature'}
                    </button>
                    <button 
                      onClick={() => startEdit(item)}
                      style={{
                        background: '#333',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        color: '#ff4444',
                        border: '1px solid #ff4444',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '40px' }}>Privacy Policy</h1>
            <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
              At Cravez Restaurant, we take your privacy seriously. This policy outlines how we collect, use, and protect your information when you use our ordering system and website.
            </p>
            
            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Information We Collect</h2>
              <ul style={{ color: '#fff', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>Personal Information: Name, email, phone number for order delivery</li>
                <li style={{ marginBottom: '12px' }}>Order History: Previous orders and preferences</li>
                <li style={{ marginBottom: '12px' }}>Payment Information: Secure payment processing details</li>
                <li style={{ marginBottom: '12px' }}>Location Data: Delivery address and location services</li>
                <li style={{ marginBottom: '12px' }}>Usage Analytics: How you interact with our menu and features</li>
              </ul>
            </div>

            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>How We Use Your Information</h2>
              <ul style={{ color: '#fff', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>Order Processing: To process and deliver your food orders</li>
                <li style={{ marginBottom: '12px' }}>Customer Support: To respond to your inquiries and issues</li>
                <li style={{ marginBottom: '12px' }}>Service Improvement: To enhance our menu and delivery experience</li>
                <li style={{ marginBottom: '12px' }}>Marketing: To inform about special offers and new menu items</li>
                <li style={{ marginBottom: '12px' }}>Legal Compliance: To meet food service regulations</li>
              </ul>
            </div>

            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Data Protection</h2>
              <ul style={{ color: '#fff', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>🔒 Secure encryption for all payment transactions</li>
                <li style={{ marginBottom: '12px' }}>🛡️ Limited access to authorized personnel only</li>
                <li style={{ marginBottom: '12px' }}>📊 Regular security audits and updates</li>
                <li style={{ marginBottom: '12px' }}>⏰ Data retention limits - we don't keep data forever</li>
                <li style={{ marginBottom: '12px' }}>🚫 No sharing with third parties without consent</li>
              </ul>
            </div>

            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Your Rights</h2>
              <ul style={{ color: '#fff', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>👁 Access: View and download your personal data</li>
                <li style={{ marginBottom: '12px' }}>✏️ Correction: Update or correct your information</li>
                <li style={{ marginBottom: '12px' }}>🗑️ Deletion: Request removal of your account and data</li>
                <li style={{ marginBottom: '12px' }}>📧 Portability: Transfer data to other services</li>
                <li style={{ marginBottom: '12px' }}>🚫 Opt-out: Choose what marketing you receive</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(232, 84, 26, 0.1)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(232, 84, 26, 0.3)' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Contact for Privacy Issues</h2>
              <p style={{ color: '#fff', marginBottom: '15px' }}>
                <strong>Email:</strong> privacy@cravez.com
              </p>
              <p style={{ color: '#fff', marginBottom: '15px' }}>
                <strong>Phone:</strong> +92-51-XXXXXXX
              </p>
              <p style={{ color: '#fff' }}>
                <strong>Store Address:</strong> I-10/2 Street 11 Hussain Market, Islamabad
              </p>
              <p style={{ color: '#E8541A', fontSize: '14px', marginTop: '20px' }}>
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '40px' }}>Analytics Dashboard</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Monitor your restaurant performance and customer insights.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#231a12', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#E8541A', marginBottom: '5px' }}>{menuItems.length}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Total Menu Items</div>
              </div>
              
              <div style={{ background: '#231a12', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🍽</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#E8541A', marginBottom: '5px' }}>{categories.length - 1}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Active Categories</div>
              </div>
              
              <div style={{ background: '#231a12', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#E8541A', marginBottom: '5px' }}>{menuItems.filter(item => item.featured).length}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Featured Items</div>
              </div>
              
              <div style={{ background: '#231a12', padding: '25px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📈</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#E8541A', marginBottom: '5px' }}>+24%</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Monthly Growth</div>
              </div>
            </div>

            <div style={{ background: 'rgba(232, 84, 26, 0.1)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(232, 84, 26, 0.3)' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Recent Activity</h2>
              <div style={{ color: '#fff', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '10px' }}>📝 <strong>Menu Updated:</strong> 5 new items added this week</p>
                <p style={{ marginBottom: '10px' }}>🍽 <strong>Popular Items:</strong> Chicken Biryani, Aloo Paratha, Special Chai</p>
                <p style={{ marginBottom: '10px' }}>⏰ <strong>Peak Hours:</strong> 12PM - 3PM, 7PM - 9PM</p>
                <p>📱 <strong>Mobile Orders:</strong> 67% of total orders</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '40px' }}>Settings</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Configure your restaurant management system.
            </p>
            
            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Restaurant Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Restaurant Name</label>
                  <input type="text" defaultValue="Cravez" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Delivery Radius (km)</label>
                  <input type="number" defaultValue="5" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Opening Time</label>
                  <input type="time" defaultValue="08:00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Closing Time</label>
                  <input type="time" defaultValue="23:00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#231a12', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>Order Settings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Minimum Order Amount</label>
                  <input type="number" defaultValue="200" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#E8541A' }}>Delivery Fee</label>
                  <input type="number" defaultValue="50" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(232, 84, 26, 0.1)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(232, 84, 26, 0.3)' }}>
              <h2 style={{ color: '#E8541A', fontSize: '20px', marginBottom: '20px' }}>System Settings</h2>
              <div style={{ color: '#fff', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    <span>Enable Email Notifications</span>
                  </label>
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    <span>Auto Backup Menu Data</span>
                  </label>
                </p>
                <p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
                    <span>Maintenance Mode</span>
                  </label>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', marginBottom: '40px' }}>Admin Profile</h1>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}>
              {/* Profile Card */}
              <div style={{
                background: '#231a12',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(232,84,26,0.15)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #E8541A, #ff8c00)',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: '#fff',
                  boxShadow: '0 20px 40px rgba(232, 84, 26, 0.3)'
                }}>
                  👨‍🍳
                </div>
                <h2 style={{ fontSize: '24px', marginBottom: '6px', color: '#fff' }}>{currentUsername || storedCreds.username}</h2>
                <p style={{ color: '#E8541A', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', marginBottom: '30px' }}>Head Chef & Manager</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <div style={profileInfoBox}>
                    <div style={profileInfoLabel}>Role</div>
                    <div style={profileInfoValue}>Super Admin</div>
                  </div>
                  <div style={profileInfoBox}>
                    <div style={profileInfoLabel}>Store</div>
                    <div style={profileInfoValue}>Cravez Islamabad</div>
                  </div>
                  <div style={profileInfoBox}>
                    <div style={profileInfoLabel}>Categories</div>
                    <div style={profileInfoValue}>9 Active</div>
                  </div>
                  <div style={profileInfoBox}>
                    <div style={profileInfoLabel}>Menu Items</div>
                    <div style={profileInfoValue}>{menuItems.length} Items</div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div style={{
                background: '#231a12',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(232,84,26,0.15)',
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  color: '#E8541A',
                  marginBottom: '8px'
                }}>Security Settings</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '30px' }}>
                  Change your login credentials. Keep them secure!
                </p>

                {profileMessage && (
                  <div style={{
                    background: profileMessage.includes('success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                    border: `1px solid ${profileMessage.includes('success') ? '#4CAF50' : '#ff4444'}`,
                    color: profileMessage.includes('success') ? '#4CAF50' : '#ff4444',
                    padding: '12px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    {profileMessage}
                  </div>
                )}

                <form onSubmit={handleUpdateCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>New Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder={currentUsername || 'admin'}
                      style={{ ...inputStyle, width: '100%', marginTop: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle, width: '100%', marginTop: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle, width: '100%', marginTop: '6px' }}
                    />
                  </div>
                  <button type="submit" style={{
                    background: '#E8541A',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    marginTop: '10px',
                    fontSize: '13px'
                  }}>
                    Update Credentials
                  </button>
                </form>

                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(232,84,26,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(232,84,26,0.1)'
                }}>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Current Username</p>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{currentUsername || 'admin'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  background: '#2a1f15',
  border: '1px solid #333',
  padding: '15px 18px',
  color: '#fff',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s'
};

const labelStyle = {
  fontSize: '11px',
  color: '#444',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontWeight: '800'
};

const profileInfoBox = {
  background: '#1e150d',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid rgba(232,84,26,0.15)'
};

const profileInfoLabel = {
  color: '#444',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '5px'
};

const profileInfoValue = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold'
};
