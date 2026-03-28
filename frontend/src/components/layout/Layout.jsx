import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen text-[var(--text-secondary)] selection:bg-mint-leaf-500/30 selection:text-mint-leaf-50 relative">
      {/* Fixed Background Layer - Prevents repaints on scroll */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[var(--bg-base)]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(51,204,204,0.05),transparent_40%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(11,244,178,0.03),transparent_40%)]" />
      </div>

      <Header />
      <div className="flex-1 flex flex-col relative z-0 pt-28">{children}</div>

      <Footer />

      {/* Subtle bottom gradient glow */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none z-0" />
    </div>
  );
}
