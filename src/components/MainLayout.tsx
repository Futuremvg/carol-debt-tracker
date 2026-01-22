import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { CreditCard, Home, Receipt } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Credit", to: "/credit-line", icon: CreditCard },
  { label: "Fixos", to: "/pagamentos-fixos", icon: Receipt },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-2xl border-b border-border/30">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg balance-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-xs">F</span>
            </div>
            <span className="font-light text-base tracking-tight">FinApp</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg w-full mx-auto px-5 py-8 pb-28">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/30 safe-area-pb">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1.5 px-6 py-2 transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 1.8 : 1.5} />
                <span className={`text-[10px] font-light tracking-wider uppercase ${isActive ? "font-normal" : ""}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
