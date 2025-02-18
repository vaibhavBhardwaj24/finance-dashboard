"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BudgetDTO } from "./page";

interface Data {
  _id: string;
  amount: number;
  description: string;
  timestamp: Date;
  type: string;
}

const Budget = ({
  budgetData,
  data,
}: {
  budgetData: BudgetDTO[] | undefined;
  data: Data[] | undefined;
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newBudgetValue, setNewBudgetValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatedBudgets, setUpdatedBudgets] = useState<Record<string, number>>(
    {}
  );

  const typeData: Record<string, number> = {};
  const types = [
    "Housing",
    "Food",
    "Transport",
    "Health",
    "Entertainment",
    "Savings",
    "Miscellaneous",
  ];

  types.forEach((type) => {
    typeData[type] = 0;

    data!.forEach((transaction) => {
      if (transaction.type === type) {
        typeData[type] += Math.abs(transaction.amount);
      }
    });
  });

  const colors = {
    actual: "#60a5fa",
    budget: "#4ade80",
    overBudget: "#f87171",
    background: "#000000",
    cardBackground: "#121212",
    text: "#ffffff",
    subtext: "#a3a3a3",
  };

  const categories = Object.keys(typeData);

  const handleEditBudget = (category: string) => {
    setEditingCategory(category);
    const currentBudget =
      budgetData!.find((item) => item.type === category)?.budget || 0;
    setNewBudgetValue(String(currentBudget));
  };

  const handleUpdateBudget = async () => {
    if (!editingCategory || !newBudgetValue) return;

    try {
      setIsUpdating(true);

      const response = await axios.post("/api/setBudget", {
        type: editingCategory,
        budget: Number(newBudgetValue),
      });

      if (response.status == 200) {
        // Update local state to reflect the change immediately
        setUpdatedBudgets({
          ...updatedBudgets,
          [editingCategory]: Number(newBudgetValue),
        });
        setEditingCategory(null);
      } else {
        console.error("Failed to update budget");
        alert("Failed to update budget. Please try again.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("An error occurred while updating the budget.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewBudgetValue("");
  };

  return (
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4"
        style={{ backgroundColor: colors.background }}
      >
        {categories.map((category) => {
          // Get budget value, prioritizing any updated values
          const originalBudget =
            budgetData!.find((item) => item.type === category)?.budget || 0;
          const budget =
            category in updatedBudgets
              ? updatedBudgets[category]
              : Number(originalBudget);
          const actual = typeData[category];
          const isOverBudget = actual > budget;

          const chartData = [
            {
              name: "Budget",
              value: budget,
              fill: colors.budget,
            },
            {
              name: "Actual",
              value: actual,
              fill: isOverBudget ? colors.overBudget : colors.actual,
            },
          ];

          return (
            <Card
              key={category}
              className="shadow-lg bg-white/10"
              style={{
                color: colors.text,
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-center text-3xl"
                  style={{ color: colors.text }}
                >
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="60%"
                      innerRadius="60%"
                      outerRadius="150%"
                      barSize={30}
                      data={chartData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={2}
                        label={{
                          position: "insideStart",
                          fill: colors.text,
                          formatter: (value: string) => `₹${value}`,
                        }}
                      />

                      <Legend
                        formatter={(value: string) => (
                          <span style={{ color: colors.text }}>{value}</span>
                        )}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center space-y-2">
                  {editingCategory === category ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Update Budget:</p>
                      <div className="flex items-center justify-center space-x-2">
                        <Input
                          className="w-28 text-white"
                          type="number"
                          value={newBudgetValue}
                          onChange={(e) => setNewBudgetValue(e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="flex justify-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUpdateBudget}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium">
                        Budget:{" "}
                        <span style={{ color: colors.budget }}>
                          ₹{String(budget)}
                        </span>
                      </p>
                      <p className="text-lg font-medium">
                        Actual:{" "}
                        <span
                          style={{
                            color: isOverBudget
                              ? colors.overBudget
                              : colors.actual,
                          }}
                        >
                          ₹{actual}
                        </span>
                      </p>
                      <p className="text-lg font-semibold">
                        {isOverBudget ? (
                          <span style={{ color: colors.overBudget }}>
                            Over budget by ₹{actual - budget}
                          </span>
                        ) : (
                          <span style={{ color: colors.budget }}>
                            Under budget by ₹{budget - actual}
                          </span>
                        )}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleEditBudget(category)}
                      >
                        Update Budget
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
