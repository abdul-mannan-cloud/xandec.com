import './globals.css';
import { Anton, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '../components/navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
});

export const metadata = {
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
      <body className={`${plusJakartaSans.className} ${anton.variable} min-h-screen bg-black text-white`}>
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
