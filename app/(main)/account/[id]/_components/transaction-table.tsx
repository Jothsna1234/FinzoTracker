// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import React, { useEffect, useMemo, useState } from "react";
// import { format } from "date-fns";
// import { categoryColors } from "@/data/categories";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   MoreHorizontal,
//   RefreshCw,
//   Search,
//   Trash,
//   X,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import useFetch from "@/hooks/use-fetch";
// import { bulkDeleteTransactions } from "@/actions/account";
// import { toast } from "sonner";
// import { BarLoader } from "react-spinners";

// /* ---------------------------------- */
// /* CONSTANTS */
// /* ---------------------------------- */

// const RECURRING_INTERVALS = {
//   DAILY: "Daily",
//   WEEKLY: "Weekly",
//   MONTHLY: "Monthly",
//   YEARLY: "Yearly",
// };

// /* ---------------------------------- */
// /* TYPES */
// /* ---------------------------------- */

// type Transaction = {
//   id: string;
//   date: string;
//   amount: number | string;
//   category: string;
//   description?: string;
//   type: "INCOME" | "EXPENSE";
//   isRecurring: boolean;
//   recurringInterval?: keyof typeof RECURRING_INTERVALS;
//   nextRecurringDate?: string;
//   accountId?: string;
// };

// type SortField = "date" | "amount" | "category";

// type SortConfig = {
//   field: SortField;
//   direction: "asc" | "desc";
// };

// /* ---------------------------------- */
// /* COMPONENT */
// /* ---------------------------------- */

// const TransactionTable = ({
//   transactions,
// }: {
//   transactions: Transaction[];
// }) => {
//   const router = useRouter();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [recurringFilter, setRecurringFilter] = useState("");
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [sortConfig, setSortConfig] = useState<SortConfig>({
//     field: "date",
//     direction: "desc",
//   });

//   /* ---------------------------------- */
//   /* FILTER + SORT */
//   /* ---------------------------------- */

//   const filteredAndSortedTransactions = useMemo(() => {
//     let result = [...transactions];

//     // Search
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       result = result.filter((t) =>
//         t.description?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Recurring filter
//     if (recurringFilter) {
//       result = result.filter((t) =>
//         recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
//       );
//     }

//     // Type filter
//     if (typeFilter) {
//       result = result.filter((t) => t.type === typeFilter);
//     }

//     // Sorting
//     result.sort((a, b) => {
//       let comparison = 0;

//       switch (sortConfig.field) {
//         case "date":
//           comparison =
//             new Date(a.date).getTime() -
//             new Date(b.date).getTime();
//           break;

//         case "amount":
//           comparison =
//             Number(a.amount) - Number(b.amount);
//           break;

//         case "category":
//           comparison = a.category.localeCompare(b.category);
//           break;
//       }

//       return sortConfig.direction === "asc"
//         ? comparison
//         : -comparison;
//     });

//     return result;
//   }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

//   /* ---------------------------------- */
//   /* HANDLERS */
//   /* ---------------------------------- */

//   const handleSort = (field: SortField) => {
//     setSortConfig((current) => ({
//       field,
//       direction:
//         current.field === field && current.direction === "asc"
//           ? "desc"
//           : "asc",
//     }));
//   };

//   const handleSelect = (id: string) => {
//     setSelectedIds((current) =>
//       current.includes(id)
//         ? current.filter((item) => item !== id)
//         : [...current, id]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedIds((current) =>
//       current.length === filteredAndSortedTransactions.length
//         ? []
//         : filteredAndSortedTransactions.map((t) => t.id)
//     );
//   };

//   const {
//     loading: deleteLoading,
//     fn: deleteFn,
//     data: deleted,
//   } = useFetch(bulkDeleteTransactions);

//   const handleBulkDelete = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} transactions?`
//       )
//     )
//       return;

//     deleteFn(selectedIds, transactions[0]?.accountId);
//   };

//   useEffect(() => {
//     if (deleted && !deleteLoading) {
//       toast.error("Transactions deleted successfully");
//       setSelectedIds([]);
//     }
//   }, [deleted, deleteLoading]);

//   const handleClearFilters = () => {
//     setSearchTerm("");
//     setTypeFilter("");
//     setRecurringFilter("");
//     setSelectedIds([]);
//   };

//   /* ---------------------------------- */
//   /* UI */
//   /* ---------------------------------- */

//   return (
//     <div className="space-y-4">
//       {deleteLoading && (
//         <BarLoader width="100%" color="#9333ea" />
//       )}

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search transactions..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8"
//           />
//         </div>

//         <Select value={typeFilter} onValueChange={setTypeFilter}>
//           <SelectTrigger>
//             <SelectValue placeholder="All Types" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="INCOME">Income</SelectItem>
//             <SelectItem value="EXPENSE">Expense</SelectItem>
//           </SelectContent>
//         </Select>

//         <Select
//           value={recurringFilter}
//           onValueChange={setRecurringFilter}
//         >
//           <SelectTrigger className="w-[160px]">
//             <SelectValue placeholder="All Transactions" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="recurring">
//               Recurring Only
//             </SelectItem>
//             <SelectItem value="non-recurring">
//               Non-recurring Only
//             </SelectItem>
//           </SelectContent>
//         </Select>

//         {(searchTerm || typeFilter || recurringFilter) && (
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={handleClearFilters}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[50px]">
//                 <Checkbox
//                   checked={
//                     selectedIds.length ===
//                       filteredAndSortedTransactions.length &&
//                     filteredAndSortedTransactions.length > 0
//                   }
//                   onCheckedChange={handleSelectAll}
//                 />
//               </TableHead>

//               <TableHead
//                 className="cursor-pointer"
//                 onClick={() => handleSort("date")}
//               >
//                 Date
//               </TableHead>

//               <TableHead>Description</TableHead>

//               <TableHead
//                 className="cursor-pointer"
//                 onClick={() => handleSort("category")}
//               >
//                 Category
//               </TableHead>

//               <TableHead
//                 className="cursor-pointer text-right"
//                 onClick={() => handleSort("amount")}
//               >
//                 Amount
//               </TableHead>

//               <TableHead>Recurring</TableHead>
//               <TableHead />
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredAndSortedTransactions.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className="text-center text-muted-foreground"
//                 >
//                   No Transactions Found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredAndSortedTransactions.map((t) => (
//                 <TableRow key={t.id}>
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedIds.includes(t.id)}
//                       onCheckedChange={() =>
//                         handleSelect(t.id)
//                       }
//                     />
//                   </TableCell>

//                   <TableCell>
//                     {format(new Date(t.date), "PP")}
//                   </TableCell>

//                   <TableCell>{t.description}</TableCell>

//                   <TableCell>
//                     <span
//                       className="px-2 py-1 rounded text-white text-sm"
//                       style={{
//                         background:
//                           categoryColors[t.category],
//                       }}
//                     >
//                       {t.category}
//                     </span>
//                   </TableCell>

//                   <TableCell
//                     className="text-right font-medium"
//                     style={{
//                       color:
//                         t.type === "EXPENSE"
//                           ? "red"
//                           : "green",
//                     }}
//                   >
//                     {t.type === "EXPENSE" ? "-" : "+"}$
//                     {Number(t.amount).toFixed(2)}
//                   </TableCell>

//                   <TableCell>
//                     {t.isRecurring ? (
//                       <Badge variant="outline">
//                         <RefreshCw className="h-3 w-3 mr-1" />
//                         {
//                           RECURRING_INTERVALS[
//                             t.recurringInterval!
//                           ]
//                         }
//                       </Badge>
//                     ) : (
//                       <Badge variant="outline">
//                         <Clock className="h-3 w-3 mr-1" />
//                         One-time
//                       </Badge>
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className="h-8 w-8 p-0"
//                         >
//                           <MoreHorizontal />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem
//                           onClick={() =>
//                             router.push(
//                               `/transaction/create?edit=${t.id}`
//                             )
//                           }
//                         >
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           className="text-destructive"
//                           onClick={() =>
//                             deleteFn([t.id])
//                           }
//                         >
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;



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

/* ---------------------------------- */
/* CONSTANTS */
/* ---------------------------------- */

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

/* ---------------------------------- */
/* TYPES */
/* ---------------------------------- */

type Transaction = {
  id: string;
  date: string;
  amount: number | string;
  category: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
  isRecurring: boolean;
  recurringInterval?: keyof typeof RECURRING_INTERVALS;
  nextRecurringDate?: string;
  accountId?: string;
};

type SortField = "date" | "amount" | "category";

type SortConfig = {
  field: SortField;
  direction: "asc" | "desc";
};

/* ---------------------------------- */
/* COMPONENT */
/* ---------------------------------- */

const TransactionTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "date",
    direction: "desc",
  });

  /* ---------------------------------- */
  /* FILTER + SORT */
  /* ---------------------------------- */

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    if (recurringFilter) {
      result = result.filter((t) =>
        recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
      );
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
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

  /* ---------------------------------- */
  /* DELETE */
  /* ---------------------------------- */

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds, transactions[0]?.accountId);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  /* ---------------------------------- */
  /* HANDLERS */
  /* ---------------------------------- */

  const handleSort = (field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */

  return (
    <div className="space-y-4">
      {deleteLoading && <BarLoader width="100%" color="#9333ea" />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={recurringFilter} onValueChange={setRecurringFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Recurring Only</SelectItem>
            <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
          </SelectContent>
        </Select>

        {(searchTerm || typeFilter || recurringFilter) && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearFilters}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Bulk Delete Button */}
      {selectedIds.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
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
                    filteredAndSortedTransactions.length > 0
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
                <TableCell>{format(new Date(t.date), "PP")}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  <span
                    className="px-2 py-1 rounded text-white text-sm"
                    style={{
                      background: categoryColors[t.category],
                    }}
                  >
                    {t.category}
                  </span>
                </TableCell>
                <TableCell
                  className="text-right font-medium"
                  style={{
                    color:
                      t.type === "EXPENSE" ? "red" : "green",
                  }}
                >
                  {t.type === "EXPENSE" ? "-" : "+"}$
                  {Number(t.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {t.isRecurring ? (
                    <Badge variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {
                        RECURRING_INTERVALS[
                          t.recurringInterval!
                        ]
                      }
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
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
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
                        onClick={() =>
                          deleteFn([t.id], t.accountId)
                        }
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
