"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  RefreshCw,
  Clock,
  Filter,
  Edit2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [recurringFilter, setRecurringFilter] = useState("ALL");
  const router = useRouter();

  // Memoized logic for filtering & sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((t) => t.description?.toLowerCase().includes(lower));
    }
    if (typeFilter !== "ALL") result = result.filter((t) => t.type === typeFilter);
    if (recurringFilter !== "ALL") {
      result = result.filter((t) => (recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring));
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortConfig.field === "date") comparison = new Date(a.date) - new Date(b.date);
      else if (sortConfig.field === "amount") comparison = a.amount - b.amount;
      else if (sortConfig.field === "category") comparison = a.category.localeCompare(b.category);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedIds.length} transactions permanently?`)) {
      deleteFn(selectedIds);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.success("Transactions deleted");
      setSelectedIds([]);
    }
  }, [deleted]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header: Optimized for Desktop & Mobile */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/20 p-4 rounded-2xl border border-border/50 glass">
        <div className="relative w-full lg:max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 rounded-xl focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] bg-background/50 border-border/50 rounded-xl">
              <Filter className="w-3 h-3 mr-2 opacity-50" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[150px] bg-background/50 border-border/50 rounded-xl">
              <RefreshCw className="w-3 h-3 mr-2 opacity-50" />
              <SelectValue placeholder="Occurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Everything</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non-recurring">One-time</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="rounded-xl animate-in fade-in zoom-in duration-200">
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter !== "ALL" || recurringFilter !== "ALL") && (
            <Button variant="ghost" size="sm" onClick={() => {setSearchTerm(""); setTypeFilter("ALL"); setRecurringFilter("ALL");}} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table Body: Glassmorphism and Row Hovers */}
      <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden relative">
        {deleteLoading && (
          <div className="absolute inset-0 z-30 bg-background/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
            <BarLoader width={200} color="hsl(var(--primary))" />
            <span className="text-xs font-bold mt-2 animate-pulse uppercase tracking-widest">Processing...</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[50px] pl-4"><Checkbox onCheckedChange={() => setSelectedIds(selectedIds.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map(t => t.id))} checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0} /></TableHead>
                <TableHead className="cursor-pointer font-bold text-xs uppercase tracking-wider" onClick={() => setSortConfig({field: "date", direction: sortConfig.direction === "asc" ? "desc" : "asc"})}>Date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Description</TableHead>
                <TableHead className="cursor-pointer font-bold text-xs uppercase tracking-wider" onClick={() => setSortConfig({field: "category", direction: sortConfig.direction === "asc" ? "desc" : "asc"})}>Category</TableHead>
                <TableHead className="cursor-pointer font-bold text-xs uppercase tracking-wider text-right" onClick={() => setSortConfig({field: "amount", direction: sortConfig.direction === "asc" ? "desc" : "asc"})}>Amount</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-[50px] pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No matches found</TableCell></TableRow>
              ) : (
                filteredAndSortedTransactions.map((t) => (
                  <TableRow key={t.id} className="group border-border/40 hover:bg-primary/5 transition-colors duration-200">
                    <TableCell className="pl-4"><Checkbox checked={selectedIds.includes(t.id)} onCheckedChange={() => setSelectedIds(prev => prev.includes(t.id) ? prev.filter(i => i !== t.id) : [...prev, t.id])} /></TableCell>
                    <TableCell className="text-sm font-medium">{format(new Date(t.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-semibold">{t.description || "Untitled"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[t.category] }} />
                        <span className="text-xs font-medium capitalize">{t.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-right font-mono font-bold", t.type === "EXPENSE" ? "text-rose-500" : "text-emerald-500")}>
                      {t.type === "EXPENSE" ? "-" : "+"}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {t.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1 hover:bg-primary/20 transition-colors">
                                <RefreshCw className="h-3 w-3" /> {RECURRING_INTERVALS[t.recurringInterval]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Next: {format(new Date(t.nextRecurringDate), "PPP")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-border/50 gap-1"><Clock className="h-3 w-3" /> One-time</Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${t.id}`)} className="gap-2"><Edit2 className="w-4 h-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive gap-2" onClick={() => deleteFn([t.id])}><Trash className="w-4 h-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}