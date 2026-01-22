import React from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, Receipt, Calendar, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Frequency = "mensal" | "quinzenal" | "semanal";

interface FixedPayment {
  id: string;
  description: string;
  value: number;
  frequency: Frequency;
  dueDay: number;
}

const LOCAL_KEY = "fixed-payments";

function getStoredItems(): FixedPayment[] {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: FixedPayment[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

const frequencyLabels: Record<Frequency, string> = {
  mensal: "Mensal",
  quinzenal: "Bi-weekly",
  semanal: "Semanal",
};

const frequencyIcons: Record<Frequency, React.ReactNode> = {
  mensal: <Calendar size={14} />,
  quinzenal: <RefreshCw size={14} />,
  semanal: <RefreshCw size={14} />,
};

const PagamentosFixos: React.FC = () => {
  const [items, setItems] = React.useState<FixedPayment[]>(getStoredItems);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FixedPayment | null>(null);

  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState("");
  const [frequency, setFrequency] = React.useState<Frequency>("mensal");
  const [dueDay, setDueDay] = React.useState("1");

  React.useEffect(() => {
    saveItems(items);
  }, [items]);

  const openNew = () => {
    setEditingItem(null);
    setDescription("");
    setValue("");
    setFrequency("mensal");
    setDueDay("1");
    setDialogOpen(true);
  };

  const openEdit = (item: FixedPayment) => {
    setEditingItem(item);
    setDescription(item.description);
    setValue(String(item.value));
    setFrequency(item.frequency);
    setDueDay(String(item.dueDay));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!description || !value) return;
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, description, value: parseFloat(value), frequency, dueDay: parseInt(dueDay) }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          description,
          value: parseFloat(value),
          frequency,
          dueDay: parseInt(dueDay),
        },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalMensal = items.reduce((acc, i) => {
    let factor = 1;
    if (i.frequency === "quinzenal") factor = 2;
    if (i.frequency === "semanal") factor = 4;
    return acc + i.value * factor;
  }, 0);

  const formatCurrency = (val: number) =>
    `CAD $${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-light uppercase tracking-widest">Despesas recorrentes</p>
            <h1 className="text-2xl font-light tracking-tight">Pagamentos Fixos</h1>
          </div>
        </div>

        {/* Total Card */}
        <div className="success-gradient rounded-2xl p-6 text-accent-foreground shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Receipt size={18} strokeWidth={1.5} className="opacity-70" />
            <span className="text-xs font-light uppercase tracking-widest opacity-80">Estimativa Mensal</span>
          </div>
          <div className="space-y-2">
            <span className="text-4xl font-extralight tracking-tight">{formatCurrency(totalMensal)}</span>
            <p className="text-xs font-light opacity-70 tracking-wide">{items.length} pagamentos cadastrados</p>
          </div>
        </div>

        {/* Payments List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/30">
            <h2 className="text-sm font-light tracking-wide">Pagamentos</h2>
            <Button onClick={openNew} size="sm" variant="ghost" className="rounded-xl gap-2 text-xs font-light">
              <Plus size={14} strokeWidth={1.5} /> Adicionar
            </Button>
          </div>
          
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-muted-foreground text-xs font-light">Nenhum pagamento cadastrado</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                      <Receipt className="text-primary" size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-light">{item.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-light uppercase tracking-wider">
                          {frequencyIcons[item.frequency]}
                          {frequencyLabels[item.frequency]}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-light">Dia {item.dueDay}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-light">{formatCurrency(item.value)}</span>
                    <div className="flex gap-0.5">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => openEdit(item)}>
                        <Pencil size={12} strokeWidth={1.5} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={12} strokeWidth={1.5} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Pagamento" : "Novo Pagamento"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Input
              placeholder="Descrição (ex: Seguro, Aluguel)"
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
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="quinzenal">Bi-weekly (Quinzenal)</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Dia de vencimento"
              min={1}
              max={31}
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
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
    </MainLayout>
  );
};

export default PagamentosFixos;
