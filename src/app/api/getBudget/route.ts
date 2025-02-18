import { connectToDatabase } from "@/lib/mongo";
import budgetModel from "@/model/budget.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const budget = await budgetModel.find();
    return NextResponse.json({ budget: budget }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
