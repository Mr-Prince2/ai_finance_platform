"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const netValue = totals.income - totals.expense;

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">Performance Insights</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed overview of your cash flow</p>
        </div>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px] bg-background/50 border-border/50 rounded-xl">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key} className="text-sm">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {/* Modern Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Income</span>
            </div>
            <p className="text-2xl font-mono font-bold text-emerald-500">
              ${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 transition-all hover:bg-rose-500/10">
            <div className="flex items-center gap-2 text-rose-500 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Expenses</span>
            </div>
            <p className="text-2xl font-mono font-bold text-rose-500">
              ${totals.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={cn(
            "p-4 rounded-2xl border transition-all",
            netValue >= 0 ? "bg-primary/5 border-primary/10 hover:bg-primary/10" : "bg-muted/30 border-border/50"
          )}>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Minus className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Net Flow</span>
            </div>
            <p className={cn(
              "text-2xl font-mono font-bold",
              netValue >= 0 ? "text-primary" : "text-foreground"
            )}>
              {netValue >= 0 ? "+" : ""}${netValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Improved Chart Visualization */}
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              barGap={8}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="date"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#incomeGradient)"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="url(#expenseGradient)"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}