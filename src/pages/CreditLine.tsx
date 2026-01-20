import React from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface CreditItem {
  id: string;
  description: string;
  value: number;
  date: string;
}

const LOCAL_KEY = "credit-line-items";

function getStoredItems(): CreditItem[] {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: CreditItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

const CreditLine: React.FC = () => {
  const [items, setItems] = React.useState<CreditItem[]>(getStoredItems);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CreditItem | null>(null);

  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    saveItems(items);
  }, [items]);

  const openNew = () => {
    setEditingItem(null);
    setDescription("");
    setValue("");
    setDate(new Date().toISOString().slice(0, 10));
    setDialogOpen(true);
  };

  const openEdit = (item: CreditItem) => {
    setEditingItem(item);
    setDescription(item.description);
    setValue(String(item.value));
    setDate(item.date);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!description || !value) return;
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, description, value: parseFloat(value), date }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        { id: crypto.randomUUID(), description, value: parseFloat(value), date },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items.reduce((acc, i) => acc + i.value, 0);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Credit Line</h1>
          <Button onClick={openNew} className="gap-2">
            <Plus size={18} /> Adicionar
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Total em aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">
              R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lançamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">Nenhum lançamento cadastrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.date}</TableCell>
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
            <DialogTitle>{editingItem ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Input
              placeholder="Descrição"
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
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

export default CreditLine;
