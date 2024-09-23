'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Truck } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-800 text-white p-4">
            <nav className="space-y-2">
              <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <LayoutDashboard size={20} />
                <span>Home</span>
              </Link>
              <Link href="/products" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <Package size={20} />
                <span>Products</span>
              </Link>
              <Link href="/checkout" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <ShoppingCart size={20} />
                <span>Checkout</span>
              </Link>
              <Link href="/orders" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <Truck size={20} />
                <span>Orders</span>
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}