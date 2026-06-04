"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Stop Link navigation

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-border/50",
      isDefault ? "bg-gradient-to-br from-card to-primary/5 border-primary/30" : "bg-card/50"
    )}>
      {/* Optimistic Loading Overlay */}
      {updateDefaultLoading && (
        <div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      <Link href={`/account/${id}`} className="block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              {name}
            </CardTitle>
            <div className="flex items-center gap-2">
               <div className={cn(
                 "w-2 h-2 rounded-full animate-pulse",
                 isDefault ? "bg-emerald-500" : "bg-zinc-600"
               )} />
               <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
                 {isDefault ? "Primary Account" : "Secondary"}
               </span>
            </div>
          </div>
          
          <div onClick={(e) => e.preventDefault()}> {/* Wrap switch to isolate clicks */}
            <Switch
              checked={isDefault}
              onCheckedChange={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-muted-foreground">$</span>
            <span className="text-3xl font-bold tracking-tight">
              {parseFloat(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-border/40 pt-4 bg-muted/5 transition-colors group-hover:bg-muted/10">
          <div className="flex gap-4">
            <div className="flex items-center text-[11px] font-medium text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              IN
            </div>
            <div className="flex items-center text-[11px] font-medium text-rose-500">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              OUT
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground transform transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Link>
    </Card>
  );
}