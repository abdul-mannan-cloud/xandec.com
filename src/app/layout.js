import './globals.css';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
  metadataBase: new URL('https://xandec.com'),
  title: 'xandec.',
  description: 'We develop custom AI solutions for innovative companies',
};

const navItems = [
  { name: "Home", link: "/" },
  { name: "Services", link: "#services" },
  { name: "Work", link: "#archives" },
  { name: "Reviews", link: "#reviews" },
  { name: "About", link: "/about" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-black text-white">
        <ScrollToTop />
        <Navbar navItems={navItems} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
