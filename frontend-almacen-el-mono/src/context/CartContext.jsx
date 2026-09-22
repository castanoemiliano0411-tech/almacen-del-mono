import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FREE_SHIPPING_FROM } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'almacen-del-mono-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, { size, color, quantity = 1 } = {}) => {
    setItems((current) => {
      const key = `${product.id}-${size}-${color}`
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...current,
        {
          key,
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images[0],
          size,
          color,
          quantity,
        },
      ]
    })
    setOpen(true)
  }

  const removeItem = (key) => {
    setItems((current) => current.filter((item) => item.key !== key))
  }

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      removeItem(key)
      return
    }
    setItems((current) => current.map((item) => (item.key === key ? { ...item, quantity } : item)))
  }

  const clearCart = () => setItems([])

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = total >= FREE_SHIPPING_FROM || total === 0 ? 0 : 12000
    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      count,
      total,
      shipping,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      toggleCart: () => setOpen((v) => !v),
    }
  }, [items, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
