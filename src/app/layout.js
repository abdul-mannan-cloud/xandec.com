import './globals.css';
import { Anton, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '../components/navbar';
import Footer from '../components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
});

export const metadata = {
  title: 'Xandria',
  description: 'We develop custom AI solutions for innovative companies',
};

const navItems = [
  { name: "Home", link: "#home" },
  { name: "About", link: "#about" },
  { name: "Services", link: "#services" },
  { name: "Reviews", link: "#reviews" },
  { name: "Work", link: "/work" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.className} ${anton.variable} min-h-screen bg-black text-white`}>
        <Navbar navItems={navItems} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
