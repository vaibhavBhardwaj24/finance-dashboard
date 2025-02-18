"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bus,
  ChevronDown,
  ChevronUp,
  Edit3,
  Film,
  Filter,
  Heart,
  Home,
  LucideIcon,
  MoreHorizontal,
  PiggyBank,
  Trash,
  Utensils,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
// import { SelectValue } from "@/components/ui/select";

interface Data {
  _id: string;
  amount: number;
  description: string;
  timestamp: Date;
  type: string;
}
const typeMapping: Record<string, { icon: LucideIcon; color: string }> = {
  Housing: { icon: Home, color: "text-blue-500 bg-blue-500/15" },
  Food: { icon: Utensils, color: "text-green-500 bg-green-500/15" },
  Transport: { icon: Bus, color: "text-yellow-500 bg-yellow-500/15" },
  Health: { icon: Heart, color: "text-red-500 bg-red-500/15" },
  Entertainment: { icon: Film, color: "text-purple-500 bg-purple-500/15" },
  Savings: { icon: PiggyBank, color: "text-teal-500 bg-teal-500/15" },
  Miscellaneous: {
    icon: MoreHorizontal,
    color: "text-gray-500 bg-gray-500/15",
  },
};

const Transactions = ({
  data,
  fetch,
}: {
  data: Data[] | undefined;
  fetch: () => Promise<void>;
}) => {
  const [selectedType, setSelectedType] = useState<string | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [desc, setDesc] = useState("");
  const [Amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [id, setId] = useState("");

  let total = 0;
  const filteredData =
    data?.filter(
      (dat) => selectedType === "All" || dat.type === selectedType
    ) || [];

  const sortedData = [...filteredData].sort((a, b) =>
    sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
  );
  const updateTransaction = async () => {
    const upd = await axios.post("/api/editExpense", {
      id: id,
      amount: Amount,
      description: desc,
      type: type,
    });
    if (upd.status == 200) {
      toast("Updated");
    } else {
      toast("Something went wrong");
    }
    setAmount("");
    setDesc("");
    setType("");
    setId("");
  };
  const deleteTrans = async ({ id }: { id: string }) => {
    const del = await axios.post("/api/deleteExpense", { id });
    if (del.status == 200) {
      toast("Deleted");
      fetch();
    } else {
      toast("Something went wrong");
    }
  };
  return (
    <div className="flex w-full flex-col gap-4 items-center">
      <div className="py-2 ">
        <div className="flex gap-4  ">
          <Select onValueChange={setSelectedType}>
            <SelectTrigger>
              {/* <SelectValue placeholder="Filter" /> */}
              <Filter />
              {selectedType}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="cursor-pointer">
                All
              </SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Savings">Savings</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setSortOrder("asc")} variant="outline">
            <ChevronUp className="w-4 h-4 mr-1" /> Ascending
          </Button>
          <Button onClick={() => setSortOrder("desc")} variant="outline">
            <ChevronDown className="w-4 h-4 mr-1" /> Descending
          </Button>
        </div>
      </div>{" "}
      <Separator className="md:w-2/3" />
      <Table className="md:text-xl">
        <TableCaption>All Your Recent Transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData?.map((dat) => {
            const { icon: Icon, color } =
              typeMapping[dat.type] || typeMapping["Miscellaneous"];
            total += dat.amount;
            return (
              <TableRow key={dat._id}>
                <TableCell>
                  <span className="flex flex- w-fit gap-3 items-center">
                    <span
                      className={`flex w-fit items-center gap-2 px-2 py-1 rounded-lg ${color}`}
                    >
                      <Icon
                        className="size-10"
                        style={{ strokeWidth: "1px" }}
                      />
                    </span>
                    <Badge variant="outline" className="w-full">
                      {" "}
                      {dat.type}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell>₹{dat.amount}</TableCell>
                <TableCell>{dat.description}</TableCell>
                <TableCell>
                  {new Date(dat.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setAmount(String(dat.amount));
                          setDesc(dat.description);
                          setType(dat.type);
                          setId(dat._id);
                        }}
                      >
                        <Edit3 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Add new Transationn</AlertDialogTitle>
                        <AlertDialogDescription>
                          <span className=" flex gap-2 flex-col">
                            <span className=" flex gap-2">
                              <Input
                                placeholder="Add Amout"
                                type="number"
                                className=""
                                value={Amount}
                                onChange={(e) => {
                                  setAmount(e.target.value);
                                }}
                              />
                              <Input
                                placeholder="Add Description"
                                type="text"
                                value={desc}
                                onChange={(e) => {
                                  setDesc(e.target.value);
                                }}
                              />
                            </span>
                            <Select onValueChange={setType} value={type}>
                              <SelectTrigger className="w-[225px]">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Housing">Housing</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Transport">
                                  Transport
                                </SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Entertainment">
                                  Entertainment
                                </SelectItem>
                                <SelectItem value="Savings">Savings</SelectItem>
                                <SelectItem value="Miscellaneous">
                                  Miscellaneous
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            updateTransaction();
                          }}
                        >
                          Update
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      deleteTrans({ id: dat._id });
                    }}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>Total Amount</TableCell>
            <TableCell>₹{total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
