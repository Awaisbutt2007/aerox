import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'aerox-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo(() => {
    const add = (product) => {
      setItems((prev) => {
        const found = prev.find((i) => i.name === product.name)
        if (found) return prev.map((i) => (i.name === product.name ? { ...i, qty: i.qty + 1 } : i))
        return [...prev, { name: product.name, price: product.price, img: product.img, qty: 1 }]
      })
      setToast({ name: product.name, id: Date.now() })
    }
    const setQty = (name, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((i) => i.name !== name) : prev.map((i) => (i.name === name ? { ...i, qty } : i))))
    const remove = (name) => setItems((prev) => prev.filter((i) => i.name !== name))
    const clear = () => setItems([])
    const count = items.reduce((n, i) => n + i.qty, 0)
    const total = items.reduce((n, i) => n + i.qty * i.price, 0)
    return { items, count, total, add, setQty, remove, clear, open, setOpen, toast }
  }, [items, open, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
