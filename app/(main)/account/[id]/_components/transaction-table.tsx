"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

/* ---------------- TYPES ---------------- */

type Transaction = {
  id: string;
  date: string | Date;
  amount: number | string;
  category: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
  isRecurring: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  nextRecurringDate?: string | Date;
  accountId: string;
};

type SortField = "date" | "amount" | "category";
type SortDirection = "asc" | "desc";

/* ---------------- CONSTANTS ---------------- */

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

/* ---------------- COMPONENT ---------------- */

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "date",
    direction: "desc",
  });

  /* ---------------- FILTER + SORT ---------------- */

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(lower)
      );
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (recurringFilter) {
      result = result.filter((t) =>
        recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison =
            new Date(a.date).getTime() -
            new Date(b.date).getTime();
          break;

        case "amount":
          comparison =
            Number(a.amount) - Number(b.amount);
          break;

        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortConfig.direction === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  /* ---------------- ACTIONS ---------------- */

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = () => {
    if (!window.confirm("Delete selected transactions?")) return;
    deleteFn(selectedIds, transactions[0]?.accountId);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader width="100%" color="#9333ea" />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length ===
                      filteredAndSortedTransactions.length &&
                    selectedIds.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>

              <TableHead onClick={() => handleSort("date")}>
                Date
              </TableHead>

              <TableHead>Description</TableHead>

              <TableHead onClick={() => handleSort("category")}>
                Category
              </TableHead>

              <TableHead
                className="text-right"
                onClick={() => handleSort("amount")}
              >
                Amount
              </TableHead>

              <TableHead>Recurring</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(t.id)}
                    onCheckedChange={() => handleSelect(t.id)}
                  />
                </TableCell>

                <TableCell>
                  {format(new Date(t.date), "PP")}
                </TableCell>

                <TableCell>{t.description}</TableCell>

                <TableCell>
                  <span
                    style={{
                      background: categoryColors[t.category],
                    }}
                    className="px-2 py-1 rounded text-white text-sm"
                  >
                    {t.category}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  {Number(t.amount).toFixed(2)}
                </TableCell>

                <TableCell>
                  {t.isRecurring ? (
                    <Badge>
                      {RECURRING_INTERVALS[t.recurringInterval!]}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      One-time
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/transaction/create?edit=${t.id}`
                          )
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteFn([t.id])}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
