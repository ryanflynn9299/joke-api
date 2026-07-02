import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)] text-[var(--text-secondary)] selection:bg-mint-leaf-500/30 selection:text-mint-leaf-50">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* pt-28 = fixed header clearance per design system */}
      <div
        id="main"
        tabIndex={-1}
        className="flex-1 flex flex-col pt-28 outline-none"
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
