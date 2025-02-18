"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircleIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
// import { useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { toast } from "sonner";
import Transactions from "./transactions";
import Budget from "./budget";
interface Data {
  _id: string;
  amount: number;
  description: string;
  timestamp: Date;
  type: string;
}
export interface BudgetDTO {
  budget: number;
  type: string;
}
export default function Home() {
  const [desc, setDesc] = useState("");
  const [Amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<Data[]>();
  const [budget, setBudget] = useState<BudgetDTO[]>();
  const fetchBudget = async () => {
    const type = await axios.get("/api/getBudget");
    setBudget(type.data.budget);
    console.log(type.data.budget);
  };
  const addTrans = async () => {
    const newData = await axios.post("/api/createExpense", {
      amount: Number(Amount),
      description: desc,
      type: type,
    });
    if (newData.status == 201) {
      toast("Added Transaction");
      fetch();
    } else {
      toast("Something went wrong");
    }
    setDesc("");
    setAmount("");
    setType("");
  };

  const fetch = async () => {
    const daat = await axios.get("/api/getExpense");

    setData(daat.data.newData);
  };

  useEffect(() => {
    fetch();
    fetchBudget();
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="px-5 pt-5">
      <Tabs defaultValue="Dashboard" className="w-full ">
        <span className="flex flex-col md:flex-row md:pl-3 md:gap-4 gap-2 items-center">
          <TabsList className="">
            <TabsTrigger className="md:text-2xl" value="Dashboard">
              Dashboard
            </TabsTrigger>
            <TabsTrigger className="md:text-2xl" value="Transactions">
              Transactions
            </TabsTrigger>
            <TabsTrigger className="md:text-2xl" value="Budget">
              Budget
            </TabsTrigger>
          </TabsList>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="">
                <PlusCircleIcon /> Add Transactions
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
                    <Select onValueChange={setType}>
                      <SelectTrigger className="w-[225px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
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
                <AlertDialogAction onClick={() => addTrans()}>
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </span>
        <Suspense fallback={<p>Loading....</p>}>
          <TabsContent value="Dashboard">
            <Dashboard data={data} />
          </TabsContent>
          <TabsContent value="Transactions">
            <Transactions data={data} fetch={fetch} />
          </TabsContent>
          <TabsContent value="Budget">
            <Budget budgetData={budget} data={data} />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
}
