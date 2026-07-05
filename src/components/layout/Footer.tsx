import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const socialLinks = [
  { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/amplifyhopeafrica' },
  { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/amplifyhopeafrica' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/amplifyhopeafrica' },
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/company/amplifyhopeafrica' },
  { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/amplifyhopeafrica' },
]

const footerLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Impact', href: '/our-work/impact' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Reports', href: '/our-work/reports' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-white  bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Amplify Hope Africa</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Empowering children, women, and youth across Africa through transformative skills, training, education, and opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>Email: info@amplifyhopeafrica.org</li>
              <li>Phone: +254 700 000 000</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label={social.name}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
          <p className="text-sm text-neutral-400">
            &copy; {currentYear} Amplify Hope Africa. All rights reserved.
          </p>
          <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
