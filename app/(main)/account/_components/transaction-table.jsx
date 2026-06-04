"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Filter,
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

const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // 1. Memoized Filtering and Sorting Logic
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

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
      await deleteFn(selectedIds);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setRecurringFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-md transition-all">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 bg-background/50 border-border/50 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
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

          <Select value={recurringFilter} onValueChange={(v) => { setRecurringFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px] bg-background/50 border-border/50 rounded-xl">
              <RefreshCw className="w-3 h-3 mr-2 opacity-50" />
              <SelectValue placeholder="Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Everything</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non-recurring">One-time</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="rounded-xl shadow-lg shadow-destructive/20 transition-all active:scale-95">
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter !== "ALL" || recurringFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={handleClearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Table Body */}
      <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden relative shadow-2xl">
        {deleteLoading && (
          <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
            <BarLoader width={200} color="hsl(var(--primary))" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Database...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                  <Checkbox 
                    onCheckedChange={() => setSelectedIds(selectedIds.length === paginatedTransactions.length ? [] : paginatedTransactions.map(t => t.id))}
                    checked={selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0} 
                  />
                </TableHead>
                {["date", "description", "category", "amount"].map((field) => (
                  <TableHead 
                    key={field}
                    className={cn("cursor-pointer font-bold text-[10px] uppercase tracking-widest", field === "amount" && "text-right")}
                    onClick={() => setSortConfig({ field, direction: sortConfig.direction === "asc" ? "desc" : "asc" })}
                  >
                    <div className={cn("flex items-center gap-1", field === "amount" && "justify-end")}>
                      {field}
                      {sortConfig.field === field && (sortConfig.direction === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="w-[50px] pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-40 text-center text-muted-foreground">No transactions match your search</TableCell></TableRow>
              ) : (
                paginatedTransactions.map((t) => (
                  <TableRow key={t.id} className="group border-border/40 transition-colors hover:bg-primary/5">
                    <TableCell className="pl-4"><Checkbox checked={selectedIds.includes(t.id)} onCheckedChange={() => setSelectedIds(prev => prev.includes(t.id) ? prev.filter(i => i !== t.id) : [...prev, t.id])} /></TableCell>
                    <TableCell className="text-sm font-medium">{format(new Date(t.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-semibold">{t.description || "Untitled"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColors[t.category] }} />
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
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
                                <RefreshCw className="h-3 w-3" /> {RECURRING_INTERVALS[t.recurringInterval]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Next Sync: {format(new Date(t.nextRecurringDate), "PPP")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-border/50 gap-1"><Clock className="h-3 w-3" /> One-time</Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/50">
                          <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${t.id}`)}>Edit Record</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteFn([t.id])}>Delete Permanently</DropdownMenuItem>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)}</span> of{" "}
            <span className="text-foreground">{filteredAndSortedTransactions.length}</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="rounded-xl border-border/50">
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button 
                  key={i} 
                  variant={currentPage === i + 1 ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setCurrentPage(i + 1)} 
                  className={cn("w-8 h-8 rounded-lg text-xs", currentPage === i + 1 && "shadow-lg shadow-primary/20")}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-xl border-border/50">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}