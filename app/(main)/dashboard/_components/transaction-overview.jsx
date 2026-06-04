"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, History, PieChart as PieIcon, Wallet } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Optimized Kuber Palette: Vibrant but dark-mode friendly
const COLORS = [
  "hsl(var(--primary))",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </div>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[160px] bg-background/50 border-border/50">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="capitalize">
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground text-sm font-medium">No transactions found</p>
              </div>
            ) : (
              recentTransactions.map((transaction, i) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-muted/30 group",
                    i !== recentTransactions.length - 1 && "border-b border-border/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-transform group-hover:scale-110",
                      transaction.type === "EXPENSE" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {transaction.type === "EXPENSE" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold capitalize group-hover:text-primary transition-colors">
                        {transaction.description || "Untitled"}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                        {format(new Date(transaction.date), "MMM dd, yyyy")} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-mono font-bold",
                    transaction.type === "EXPENSE" ? "text-rose-500" : "text-emerald-500"
                  )}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PieIcon className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {pieChartData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center">
               <div className="w-32 h-32 rounded-full border-4 border-dashed border-border/30 mb-4" />
               <p className="text-muted-foreground text-sm font-medium">No expenses tracked this month</p>
            </div>
          ) : (
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70} // Makes it a Donut chart
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="stroke-background hover:opacity-80 transition-opacity"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))", fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium text-muted-foreground uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}