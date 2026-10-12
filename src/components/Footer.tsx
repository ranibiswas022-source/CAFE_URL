// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock } from 'lucide-react';

// Inline social SVG icons (avoids lucide version compatibility issues)
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const year = CURRENT_YEAR;

  return (
    <footer className="bg-[#050709] border-t border-border">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Coffee size={20} className="text-gold" />
              </div>
              <div>
                <div className="text-white font-serif font-bold text-lg">Bean & Brew</div>
                <div className="text-[10px] text-textSecondary tracking-[0.15em] uppercase">Coffee · Food · Good Vibes</div>
              </div>
            </Link>
            <p className="text-textSecondary text-sm leading-relaxed mb-6">
              A cozy corner for coffee lovers and food enthusiasts. We serve freshly brewed perfection, 
              one cup at a time.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: SocialIcons.Instagram, href: '#', label: 'Instagram' },
                { Icon: SocialIcons.Facebook, href: '#', label: 'Facebook' },
                { Icon: SocialIcons.Twitter, href: '#', label: 'Twitter' },
                { Icon: SocialIcons.Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center
                             text-textSecondary hover:text-gold hover:border-gold/40 transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Menu' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/orders', label: 'My Orders' },
                { to: '/cart', label: 'Cart' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-textSecondary hover:text-gold text-sm transition-colors duration-200
                               flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="text-textSecondary text-sm leading-relaxed">
                  123 Café Street, Green Park,<br />New Delhi — 110016
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+911234567890" className="text-textSecondary hover:text-gold text-sm transition-colors">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:hello@beanandbrew.com" className="text-textSecondary hover:text-gold text-sm transition-colors">
                  hello@beanandbrew.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Opening Hours</h4>
            <ul className="space-y-3">
              {[
                { day: 'Monday – Friday', time: '7:00 AM – 10:00 PM' },
                { day: 'Saturday', time: '8:00 AM – 11:00 PM' },
                { day: 'Sunday', time: '9:00 AM – 9:00 PM' },
              ].map(({ day, time }) => (
                <li key={day} className="flex items-start gap-2">
                  <Clock size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-xs font-medium">{day}</div>
                    <div className="text-textSecondary text-xs">{time}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 bg-success/10 border border-success/20
                            rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-success text-xs font-medium">Open Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center
                        justify-between gap-3">
          <p className="text-textSecondary text-xs">
            © {year} Bean & Brew. All rights reserved.
          </p>
          <p className="text-textSecondary text-xs flex items-center gap-1">
            Made with <span className="text-gold">♥</span> for coffee lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
