import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Settings } from "lucide-react";
import { CarLoan } from "@/types/vehicleCarol";

interface CarLoanCardProps {
  data: CarLoan;
  onUpdate: (updates: Partial<CarLoan>) => void;
}

const CarLoanCard: React.FC<CarLoanCardProps> = ({ data, onUpdate }) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Car size={20} strokeWidth={1.5} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-light">Financiamento do Carro</h3>
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Car Loan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Saldo Devedor ($)
          </label>
          <Input
            type="number"
            value={data.balance || ""}
            onChange={(e) => onUpdate({ balance: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="40000"
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Taxa APR (%)
          </label>
          <Input
            type="number"
            value={data.aprPercent || ""}
            onChange={(e) => onUpdate({ aprPercent: Math.min(60, Math.max(0, parseFloat(e.target.value) || 0)) })}
            className="rounded-xl font-light"
            placeholder="9.99"
            min={0}
            max={60}
            step={0.01}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Valor Parcela ($)
          </label>
          <Input
            type="number"
            value={data.paymentAmount || ""}
            onChange={(e) => onUpdate({ paymentAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="418"
            min={0}
            step={0.01}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Frequência
          </label>
          <Select
            value={data.paymentFrequency}
            onValueChange={(v) => onUpdate({ paymentFrequency: v as "biweekly" | "monthly" })}
          >
            <SelectTrigger className="rounded-xl font-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biweekly">Quinzenal (Bi-weekly)</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Valor Mercado ($)
          </label>
          <Input
            type="number"
            value={data.estimatedCarMarketValue || ""}
            onChange={(e) => onUpdate({ estimatedCarMarketValue: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="35000"
            min={0}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Extra Mensal ($)
          </label>
          <Input
            type="number"
            value={data.extraPaymentMonthly || ""}
            onChange={(e) => onUpdate({ extraPaymentMonthly: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="rounded-xl font-light"
            placeholder="0"
            min={0}
          />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground font-light">
        Pagamentos quinzenais são convertidos para equivalente mensal (26 pagamentos/ano).
      </p>
    </div>
  );
};

export default CarLoanCard;
