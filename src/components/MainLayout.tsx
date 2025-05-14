
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Credit Line", to: "/credit-line" },
  { label: "Pagamentos Fixos", to: "/pagamentos-fixos" },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-semibold px-3 py-1 rounded-md transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground shadow"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </header>
      <main className="max-w-2xl w-full mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default MainLayout;
