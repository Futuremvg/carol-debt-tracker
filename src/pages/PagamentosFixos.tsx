import React from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Pencil } from "lucide-react";
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
  quinzenal: "Quinzenal",
  semanal: "Semanal",
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

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pagamentos Fixos</h1>
          <Button onClick={openNew} className="gap-2">
            <Plus size={18} /> Adicionar
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Estimativa Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">
              R$ {totalMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">Nenhum pagamento cadastrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{frequencyLabels[item.frequency]}</TableCell>
                      <TableCell>{item.dueDay}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="flex gap-2 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Pagamento" : "Novo Pagamento"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Input
              placeholder="Descrição (ex: Seguro, Aluguel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={value}
              min={0}
              step={0.01}
              onChange={(e) => setValue(e.target.value)}
            />
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger>
                <SelectValue placeholder="Frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="quinzenal">Quinzenal</SelectItem>
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
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!description || !value}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PagamentosFixos;
