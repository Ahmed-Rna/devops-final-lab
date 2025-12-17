import React, { useState, useEffect } from 'react'
import '../styles/Admin.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Admin() {
  const [medicines, setMedicines] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('medicines')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'General',
    image_url: ''
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Fetching data from:', `${API_BASE_URL}/api/medicines`, `${API_BASE_URL}/api/orders`)
      const [medsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/medicines`),
        fetch(`${API_BASE_URL}/api/orders`)
      ])
      
      if (!medsRes.ok) {
        throw new Error(`Medicines API error! status: ${medsRes.status}`)
      }
      if (!ordersRes.ok) {
        throw new Error(`Orders API error! status: ${ordersRes.status}`)
      }
      
      const medsData = await medsRes.json()
      const ordersData = await ordersRes.json()
      
      console.log('Data received:', { medsData, ordersData })
      
      if (medsData.success) setMedicines(medsData.data || [])
      if (ordersData.success) setOrders(ordersData.data || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      alert('Failed to fetch data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    })
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `${API_BASE_URL}/api/medicines/${editingId}`
        : `${API_BASE_URL}/api/medicines`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        alert(`Medicine ${editingId ? 'updated' : 'added'} successfully!`)
        fetchData()
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: 'General',
          image_url: ''
        })
        setEditingId(null)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Failed to save medicine')
      console.error(err)
    }
  }

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        alert('Medicine deleted successfully!')
        fetchData()
      }
    } catch (err) {
      alert('Failed to delete medicine')
      console.error(err)
    }
  }

  const handleEditMedicine = (medicine) => {
    setFormData(medicine)
    setEditingId(medicine._id)
    setActiveTab('medicines')
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        fetchData()
      }
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  if (loading) return <div className="admin-page"><p>Loading...</p></div>

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'medicines' ? 'active' : ''}`}
          onClick={() => setActiveTab('medicines')}
        >
          Medicines Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'medicines' && (
        <div className="admin-section">
          <div className="form-section">
            <h2>{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            <form onSubmit={handleAddMedicine}>
              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                className="form-input"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
              >
                <option>General</option>
                <option>Antibiotics</option>
                <option>Pain Relief</option>
                <option>Cold & Cough</option>
                <option>Vitamins</option>
              </select>
              <input
                type="text"
                name="image_url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={handleInputChange}
                className="form-input"
              />
              <button type="submit" className="submit-btn">
                {editingId ? 'Update Medicine' : 'Add Medicine'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      stock: '',
                      category: 'General',
                      image_url: ''
                    })
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="list-section">
            <h2>Medicines List ({medicines.length})</h2>
            <div className="medicines-table">
              {medicines.length === 0 ? (
                <p>No medicines found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map(medicine => (
                      <tr key={medicine._id}>
                        <td>{medicine.name}</td>
                        <td>{medicine.category}</td>
                        <td>₹{medicine.price.toFixed(2)}</td>
                        <td>{medicine.stock}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditMedicine(medicine)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteMedicine(medicine._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <h2>Orders ({orders.length})</h2>
          <div className="orders-table">
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.slice(0, 8)}...</td>
                      <td>{order.customer_name}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.total_price.toFixed(2)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
