import React, { useState, useEffect } from 'react'
import '../styles/Shop.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Shop() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [orderForm, setOrderForm] = useState({
    medicine_id: '',
    customer_name: '',
    customer_email: '',
    quantity: 1
  })

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching medicines from:', `${API_BASE_URL}/api/medicines`)
      const response = await fetch(`${API_BASE_URL}/api/medicines`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Medicines data received:', data)
      
      if (data.success) {
        setMedicines(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch medicines')
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch medicines'
      setError(errorMsg)
      console.error('Error fetching medicines:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item._id === medicine._id)
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
  }

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item._id !== medicineId))
  }

  const handlePlaceOrder = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicine_id: item._id,
          customer_name: orderForm.customer_name || 'Guest',
          customer_email: orderForm.customer_email || 'guest@example.com',
          quantity: item.quantity
        })
      })
      const data = await response.json()
      if (data.success) {
        alert('Order placed successfully!')
        removeFromCart(item._id)
        fetchMedicines()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Failed to place order')
      console.error(err)
    }
  }

  if (loading) return <div className="shop-page"><p>Loading medicines...</p></div>
  if (error) return <div className="shop-page"><p>{error}</p></div>

  return (
    <div className="shop-page">
      <h1>Pharmacy Shop</h1>

      <div className="shop-container">
        <div className="medicines-section">
          <h2>Available Medicines ({medicines.length})</h2>
          <div className="medicines-grid">
            {medicines.map(medicine => (
              <div key={medicine._id} className="medicine-card">
                {medicine.image_url && (
                  <img src={medicine.image_url} alt={medicine.name} className="medicine-image" />
                )}
                <div className="medicine-info">
                  <h3>{medicine.name}</h3>
                  <p className="category">{medicine.category}</p>
                  <p className="description">{medicine.description}</p>
                  <div className="price-stock">
                    <span className="price">₹{medicine.price.toFixed(2)}</span>
                    <span className={`stock ${medicine.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => addToCart(medicine)}
                    disabled={medicine.stock === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h2>Shopping Cart ({cart.length})</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="order-form">
                <h3>Place Order</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={orderForm.customer_name}
                  onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={orderForm.customer_email}
                  onChange={(e) => setOrderForm({...orderForm, customer_email: e.target.value})}
                  className="form-input"
                />
                <div className="cart-total">
                  <p className="total">
                    Total: ₹
                    {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </p>
                </div>
                {cart.length > 0 && (
                  <button
                    className="checkout-btn"
                    onClick={() => handlePlaceOrder(cart[0])}
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
