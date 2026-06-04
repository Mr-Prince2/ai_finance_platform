import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, TrendingUp } from "lucide-react";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="container mx-auto space-y-10 px-4 pb-20 pt-8">
      {/* Header Section: Now uses a glass-card layout for better focus */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/30 p-8 rounded-3xl border border-border/50 glass">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Wallet className="w-8 h-8" />
            </div>
            <Badge variant="outline" className="capitalize px-3 py-1 bg-primary/5 border-primary/20 text-primary font-medium">
              {account.type.toLowerCase()}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Active monitoring enabled
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-1 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Balance</span>
          <div className="text-4xl md:text-5xl font-mono font-bold text-primary flex items-start gap-1">
            <span className="text-2xl mt-1 opacity-70">$</span>
            {parseFloat(account.balance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full w-fit">
            <ArrowUpRight className="w-3 h-3" />
            {account._count.transactions} Transactions Recorded
          </div>
        </div>
      </div>

      {/* Analytics Section: High-fidelity Chart Wrapper */}
      <section className="grid grid-cols-1 gap-6">
        <Card className="border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0 sm:p-6">
            <Suspense
              fallback={
                <div className="h-[300px] flex flex-col items-center justify-center gap-4">
                  <BarLoader width={"50%"} color="hsl(var(--primary))" />
                  <p className="text-sm text-muted-foreground animate-pulse">Calculating insights...</p>
                </div>
              }
            >
              <AccountChart transactions={transactions} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Data Section: Clean Table Container */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
        </div>
        <Card className="border-border/40 bg-card/20 overflow-hidden">
          <Suspense
            fallback={<BarLoader className="w-full" color="hsl(var(--primary))" />}
          >
            <TransactionTable transactions={transactions} />
          </Suspense>
        </Card>
      </section>
    </div>
  );
}