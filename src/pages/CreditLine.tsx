import React from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, CreditCard, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreditItem {
  id: string;
  description: string;
  value: number;
  date: string;
  type: "expense" | "payment";
}

interface CreditConfig {
  initialBalance: number;
  interestRate: number;
  interestType: "monthly" | "annual";
}

const LOCAL_KEY = "credit-line-items";
const CONFIG_KEY = "credit-line-config";

function getStoredItems(): CreditItem[] {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getStoredConfig(): CreditConfig {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : { initialBalance: 0, interestRate: 21, interestType: "annual" };
  } catch {
    return { initialBalance: 0, interestRate: 21, interestType: "annual" };
  }
}

function saveItems(items: CreditItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function saveConfig(config: CreditConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

const CreditLine: React.FC = () => {
  const [items, setItems] = React.useState<CreditItem[]>(getStoredItems);
  const [config, setConfig] = React.useState<CreditConfig>(getStoredConfig);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CreditItem | null>(null);

  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = React.useState<"expense" | "payment">("expense");

  const [tempInitialBalance, setTempInitialBalance] = React.useState(String(config.initialBalance));
  const [tempInterestRate, setTempInterestRate] = React.useState(String(config.interestRate));
  const [tempInterestType, setTempInterestType] = React.useState<"monthly" | "annual">(config.interestType);

  React.useEffect(() => {
    saveItems(items);
  }, [items]);

  React.useEffect(() => {
    saveConfig(config);
  }, [config]);

  const openNew = () => {
    setEditingItem(null);
    setDescription("");
    setValue("");
    setDate(new Date().toISOString().slice(0, 10));
    setType("expense");
    setDialogOpen(true);
  };

  const openEdit = (item: CreditItem) => {
    setEditingItem(item);
    setDescription(item.description);
    setValue(String(item.value));
    setDate(item.date);
    setType(item.type);
    setDialogOpen(true);
  };

  const openConfig = () => {
    setTempInitialBalance(String(config.initialBalance));
    setTempInterestRate(String(config.interestRate));
    setTempInterestType(config.interestType);
    setConfigDialogOpen(true);
  };

  const handleSave = () => {
    if (!description || !value) return;
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, description, value: parseFloat(value), date, type }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        { id: crypto.randomUUID(), description, value: parseFloat(value), date, type },
      ]);
    }
    setDialogOpen(false);
  };

  const handleSaveConfig = () => {
    setConfig({
      initialBalance: parseFloat(tempInitialBalance) || 0,
      interestRate: parseFloat(tempInterestRate) || 0,
      interestType: tempInterestType,
    });
    setConfigDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalExpenses = items.filter(i => i.type === "expense").reduce((acc, i) => acc + i.value, 0);
  const totalPayments = items.filter(i => i.type === "payment").reduce((acc, i) => acc + i.value, 0);
  const currentBalance = config.initialBalance + totalExpenses - totalPayments;
  const monthlyInterest = config.interestType === "monthly" 
    ? (currentBalance * config.interestRate) / 100 
    : (currentBalance * config.interestRate) / 100 / 12;

  const formatCurrency = (val: number) =>
    `CAD $${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Credit Line</h1>
            <p className="text-sm text-muted-foreground">RBC Bank</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={openConfig}>
            <Percent size={18} />
          </Button>
        </div>

        {/* Balance Card */}
        <div className="balance-gradient rounded-3xl p-6 text-primary-foreground shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="opacity-80" />
            <span className="text-sm font-medium opacity-90">Saldo Atual</span>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-bold tracking-tight">{formatCurrency(currentBalance)}</span>
            <p className="text-sm opacity-80">Juros estimado/mês: {formatCurrency(monthlyInterest)}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="text-destructive" size={16} />
              </div>
              <span className="text-xs text-muted-foreground">Gastos</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="text-accent" size={16} />
              </div>
              <span className="text-xs text-muted-foreground">Pagamentos</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalPayments)}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="font-semibold">Transações</h2>
            <Button onClick={openNew} size="sm" className="rounded-xl gap-2">
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">Nenhuma transação registrada</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === "payment" ? "bg-accent/10" : "bg-destructive/10"
                    }`}>
                      {item.type === "payment" ? (
                        <DollarSign className="text-accent" size={18} />
                      ) : (
                        <CreditCard className="text-destructive" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${item.type === "payment" ? "text-accent" : "text-foreground"}`}>
                      {item.type === "payment" ? "-" : "+"}{formatCurrency(item.value)}
                    </span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEdit(item)}>
                        <Pencil size={14} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Transação" : "Nova Transação"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Select value={type} onValueChange={(v) => setType(v as "expense" | "payment")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Gasto (aumenta dívida)</SelectItem>
                <SelectItem value="payment">Pagamento (reduz dívida)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
            />
            <Input
              type="number"
              placeholder="Valor (CAD)"
              value={value}
              min={0}
              step={0.01}
              onChange={(e) => setValue(e.target.value)}
              className="rounded-xl"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!description || !value} className="rounded-xl">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Configurar Credit Line</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Saldo Inicial (CAD)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={tempInitialBalance}
                min={0}
                step={0.01}
                onChange={(e) => setTempInitialBalance(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Juros</label>
              <Select value={tempInterestType} onValueChange={(v) => setTempInterestType(v as "monthly" | "annual")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Taxa de Juros {tempInterestType === "monthly" ? "Mensal" : "Anual"} (%)
              </label>
              <Input
                type="number"
                placeholder={tempInterestType === "monthly" ? "1.75" : "21"}
                value={tempInterestRate}
                min={0}
                step={0.1}
                onChange={(e) => setTempInterestRate(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                {tempInterestType === "monthly" 
                  ? "Taxa mensal aplicada (ex: 1.75%/mês)" 
                  : "RBC Prime + margem (típico: 19-22%/ano)"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveConfig} className="rounded-xl">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CreditLine;
