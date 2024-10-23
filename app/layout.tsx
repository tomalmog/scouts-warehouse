import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Warehouse",
  description: "Tzofim-Warehouse",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {/* <SignedOut>
//             <SignInButton />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn> */}
//         <Layout children={children} />
//       </body>
//     </html>
//   );
// }

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Truck } from "lucide-react";
import logo from "../public/logo.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/checkout", icon: ShoppingCart, label: "Checkout" },
  { href: "/orders", icon: Truck, label: "Orders" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center p-6 border-b">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Image src={logo} alt="logo" width={60} height={60} />
                  </div>
                  <h1 className="ml-3 text-xl font-semibold text-gray-800">
                    Tzofim
                  </h1>
                </div>
                <nav className=" overflow-y-auto py-4">
                  <ul className="space-y-2 px-3">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t">
                  <div className="flex items-center px-4 py-2 m-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <SignedOut>
                      <div className="mr-auto">
                        <SignInButton mode="modal">
                          <Button>Log In</Button>
                        </SignInButton>
                      </div>
                      <div className="ml-auto">
                        <SignUpButton mode="modal">
                          <Button>Sign Up</Button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                      <span className="ml-3">Signed In</span>
                    </SignedIn>
                  </div>
                </div>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
