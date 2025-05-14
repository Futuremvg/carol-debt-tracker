
// Dashboard inicial

import MainLayout from "@/components/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Dashboard Financeiro</h1>
        <p className="text-lg text-muted-foreground text-center">
          Acompanhe suas dívidas, pagamentos fixos e saldo de forma simples. Use os menus acima para acessar cada área.
        </p>
        {/* Aqui futuramente pode entrar o resumo dos totais */}
        <div className="w-full mt-8 flex flex-col gap-4">
          <div className="bg-card rounded-lg border p-5 shadow">
            <span className="block font-semibold text-gray-700 dark:text-gray-200">Credit Line</span>
            <span className="text-2xl font-bold text-primary">R$ 0,00</span>
            <span className="block text-sm text-muted-foreground">Sua dívida em aberto</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border p-5 shadow">
              <span className="block font-semibold text-gray-700 dark:text-gray-200">Carro (bi-weekly)</span>
              <span className="text-lg font-bold text-primary">R$ 0,00</span>
              <span className="block text-sm text-muted-foreground">Pagamento do mês</span>
            </div>
            <div className="bg-card rounded-lg border p-5 shadow">
              <span className="block font-semibold text-gray-700 dark:text-gray-200">Seguro</span>
              <span className="text-lg font-bold text-primary">R$ 0,00</span>
              <span className="block text-sm text-muted-foreground">Pagamento do mês</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
