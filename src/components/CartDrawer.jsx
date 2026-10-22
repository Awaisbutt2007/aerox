import { useEffect, useRef, useState } from 'react'
import { useCart } from '../lib/cart'
import { initSmoothScroll } from '../lib/scroll'

export default function CartDrawer() {
  const { items, total, open, setOpen, setQty, remove, clear, toast } = useCart()
  const [done, setDone] = useState(false)

  // Freeze page scroll while the drawer is open so its list can scroll.
  const wasOpen = useRef(false)
  useEffect(() => {
    const lenis = initSmoothScroll()
    if (open) lenis.stop()
    else if (wasOpen.current) lenis.start() // don't unlock scroll while the loader is running
    wasOpen.current = open
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const checkout = () => {
    clear()
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <>
      <div className={`cart-overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        <div className="cart__head">
          <h3>Your Cart</h3>
          <button className="cart__close" onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {done ? (
          <div className="cart__empty">
            <b>Order placed ✓</b>
            <p className="muted">Thanks! This is a demo store — no payment was taken.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="cart__empty">
            <b>Your cart is empty</b>
            <p className="muted">Add something from the collection.</p>
          </div>
        ) : (
          <ul className="cart__list">
            {items.map((i) => (
              <li key={i.name} className="cart__item">
                <img src={`/images/${i.img}.jpg`} alt={i.name} />
                <div className="cart__meta">
                  <span className="cart__name">{i.name}</span>
                  <span className="muted">${i.price}</span>
                  <div className="cart__qty">
                    <button onClick={() => setQty(i.name, i.qty - 1)} aria-label="Decrease">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.name, i.qty + 1)} aria-label="Increase">+</button>
                  </div>
                </div>
                <div className="cart__right">
                  <b>${i.price * i.qty}</b>
                  <button className="cart__remove" onClick={() => remove(i.name)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart__foot">
          <div className="cart__total"><span>Total</span><b>${total}</b></div>
          <button className="btn cart__checkout" disabled={!items.length} onClick={checkout}>Checkout</button>
        </div>
      </aside>

      {toast && (
        <div className="toast" key={toast.id}>
          <span>✓</span> {toast.name} added to cart
          <button onClick={() => setOpen(true)}>View</button>
        </div>
      )}
    </>
  )
}
