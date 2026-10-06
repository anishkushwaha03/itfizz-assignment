import './globals.css';

export const metadata = {
  title: 'Next-Gen Mobility',
  description: 'The future of aerodynamics and automotive performance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-black text-white selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}
