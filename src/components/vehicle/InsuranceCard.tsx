import React from "react";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { InsurancePaidByCarol } from "@/types/vehicleCarol";

interface InsuranceCardProps {
  data: InsurancePaidByCarol;
  onUpdate: (updates: Partial<InsurancePaidByCarol>) => void;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ data, onUpdate }) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Shield size={20} strokeWidth={1.5} className="text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-light">Seguro (Carol)</h3>
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Insurance</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
          Valor Mensal ($)
        </label>
        <Input
          type="number"
          value={data.monthlyAmount || ""}
          onChange={(e) => onUpdate({ monthlyAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
          className="rounded-xl font-light"
          placeholder="150"
          min={0}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default InsuranceCard;
