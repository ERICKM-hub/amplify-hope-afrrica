'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa'

const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'About Us',
    href: '/about',
    dropdown: [
      { name: 'The Team', href: '/about/team' },
    ],
  },
  {
    name: 'Our Work',
    href: '/our-work',
    dropdown: [
      { name: 'Our Impact', href: '/our-work/impact' },
      { name: 'Reports', href: '/our-work/reports' },
    ],
  },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Blog', href: '/blog' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="w-3/4 mx-auto px-2 sm:px-6 lg:px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
     <Link href="/" className="flex items-center space-x-2">
      <span className={`text-2xl font-bold transition-colors ${scrolled ? 'text-primary' : 'text-black'}`}>
        <Image 
          src="/images/Logo.jpeg" 
          alt="Company Logo" 
          width={56} 
          height={56} 
          className="h-20 w-auto object-contain rounded-full"
          priority
        />
      </span>
    </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-primary'
                      : scrolled ? 'text-neutral-700' : 'text-black'
                  }`}
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary hover:text-black transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Donate Button & Mobile Menu Toggle */}
          <div className="flex items-center text-black space-x-4">
            <Link
              href="/donate"
              className={`hidden md:inline-block px-6 py-2 font-semibold rounded-lg transition-colors ${
                scrolled 
                  ? 'bg-primary text-black hover:bg-primary-dark' 
                  : 'bg-secondary text-neutral-900 hover:bg-secondary-dark'
              }`}
            >
              Donate
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'hover:bg-neutral-100 text-neutral-700' : 'hover:bg-black/10 text-black'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block text-base font-medium transition-colors hover:text-primary ${
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-primary'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 mt-2 flex flex-col space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-sm text-neutral-500 hover:text-primary transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/donate"
                className="block w-full px-6 py-3 bg-primary text-black font-semibold rounded-lg text-center hover:bg-primary-dark transition-colors"
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
