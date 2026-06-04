"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { cn } from "@/lib/utils";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  // Optimistic UI: Determine color based on threshold
  const getBudgetColor = (percent) => {
    if (percent >= 90) return "bg-rose-500";
    if (percent >= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Monthly Budget
            {percentUsed >= 90 && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2 mt-2 bg-background/50 p-1 rounded-lg border border-border">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-28 h-8 border-none focus-visible:ring-0 text-lg font-bold"
                  placeholder="0.00"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight">
                  {initialBudget ? `$${initialBudget.amount.toLocaleString()}` : "Not Set"}
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity border-border/50"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {!isEditing && initialBudget && (
          <div className="text-right">
             <span className={cn(
               "text-xs font-bold px-2 py-1 rounded-md",
               percentUsed >= 90 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
             )}>
               {percentUsed >= 100 ? "Limit Reached" : `${(100 - percentUsed).toFixed(0)}% Left`}
             </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {initialBudget ? (
          <div className="space-y-3">
            <Progress
              value={Math.min(percentUsed, 100)}
              className="h-3"
              indicatorClassName={cn("transition-all duration-500", getBudgetColor(percentUsed))}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>${currentExpenses.toFixed(2)} spent</span>
              </div>
              <p className={cn(
                "text-sm font-mono font-bold",
                percentUsed >= 90 ? "text-rose-500" : "text-foreground"
              )}>
                {percentUsed.toFixed(1)}%
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground mb-2">No active budget</p>
            <Button variant="link" size="sm" onClick={() => setIsEditing(true)}>
              Create one now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}