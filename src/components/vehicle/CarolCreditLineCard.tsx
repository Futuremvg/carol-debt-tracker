import React from "react";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { CarolCreditLine } from "@/types/vehicleCarol";

interface CarolCreditLineCardProps {
  data: CarolCreditLine;
  onUpdate: (updates: Partial<CarolCreditLine>) => void;
}

const CarolCreditLineCard: React.FC<CarolCreditLineCardProps> = ({ data, onUpdate }) => {
  const estimatedMonthsToPayoff = data.monthlyPayment > 0 
    ? Math.ceil(data.balance / data.monthlyPayment) 
    : null;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <CreditCard size={20} strokeWidth={1.5} className="text-destructive" />
        </div>
        <div>
          <h3 className="text-sm font-light">Credit Line (Carol)</h3>
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Linha de Crédito</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Saldo Devedor ($)
          </label>
          <Input
            type="number"
            value={data.balance || ""}
            onChange={(e) => onUpdate({ balance: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="7000"
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Custo Juros Mensal (Fixo) ($)
          </label>
          <Input
            type="number"
            value={data.monthlyInterestCost || ""}
            onChange={(e) => onUpdate({ monthlyInterestCost: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="63.73"
            min={0}
            step={0.01}
          />
          <p className="text-[10px] text-muted-foreground font-light">
            Valor fixo informado (não calculado por APR).
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Pagamento Mensal ($) — Opcional
          </label>
          <Input
            type="number"
            value={data.monthlyPayment || ""}
            onChange={(e) => onUpdate({ monthlyPayment: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="0"
            min={0}
            step={0.01}
          />
        </div>
      </div>

      {estimatedMonthsToPayoff !== null && (
        <div className="p-3 rounded-xl bg-muted/50 space-y-1">
          <p className="text-xs font-light">
            Projeção simples: <span className="font-medium">{estimatedMonthsToPayoff} meses</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-light">
            Este cálculo ignora mudanças nos juros e assume pagamento direto no principal.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarolCreditLineCard;
