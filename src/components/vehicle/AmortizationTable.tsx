import React, { useState } from "react";
import { AmortizationEntry } from "@/types/vehicleCarol";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AmortizationTableProps {
  schedule: AmortizationEntry[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const displaySchedule = showAll ? schedule : schedule.slice(0, 12);

  // Group by year for summary
  const yearSummary = schedule.reduce((acc, entry) => {
    const year = Math.ceil(entry.month / 12);
    if (!acc[year]) {
      acc[year] = { interest: 0, principal: 0, finalBalance: 0 };
    }
    acc[year].interest += entry.interest;
    acc[year].principal += entry.principal;
    acc[year].finalBalance = entry.balance;
    return acc;
  }, {} as Record<number, { interest: number; principal: number; finalBalance: number }>);

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Table size={20} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-light">Projeção de Pagamentos</h3>
            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">
              Amortization Schedule
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="rounded-xl"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>

      {/* Year Summary - Always visible */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">
          Resumo por Ano
        </p>
        <div className="space-y-1.5">
          {Object.entries(yearSummary).slice(0, 5).map(([year, data]) => (
            <div key={year} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
              <span className="text-xs font-light">Ano {year}</span>
              <div className="flex gap-4 text-xs font-light">
                <span className="text-destructive">{formatCurrency(data.interest)} juros</span>
                <span className="text-accent">{formatCurrency(data.finalBalance)} saldo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">
              Detalhamento Mensal
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="py-2 px-2 text-left font-light text-muted-foreground">Mês</th>
                    <th className="py-2 px-2 text-right font-light text-muted-foreground">Parcela</th>
                    <th className="py-2 px-2 text-right font-light text-muted-foreground">Juros</th>
                    <th className="py-2 px-2 text-right font-light text-muted-foreground">Principal</th>
                    <th className="py-2 px-2 text-right font-light text-muted-foreground">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySchedule.map((entry) => (
                    <tr key={entry.month} className="border-b border-border/10 hover:bg-muted/10">
                      <td className="py-2 px-2 font-light">{entry.month}</td>
                      <td className="py-2 px-2 text-right font-light">{formatCurrency(entry.payment)}</td>
                      <td className="py-2 px-2 text-right font-light text-destructive">{formatCurrency(entry.interest)}</td>
                      <td className="py-2 px-2 text-right font-light text-accent">{formatCurrency(entry.principal)}</td>
                      <td className="py-2 px-2 text-right font-light">{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {schedule.length > 12 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full rounded-xl text-xs"
              >
                {showAll ? "Mostrar menos" : `Ver todos os ${schedule.length} meses`}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AmortizationTable;
