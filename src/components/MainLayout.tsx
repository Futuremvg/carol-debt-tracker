import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { CreditCard, Home, Receipt } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Credit Line", to: "/credit-line", icon: CreditCard },
  { label: "Pagamentos", to: "/pagamentos-fixos", icon: Receipt },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl balance-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">FinApp</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-pb">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
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
