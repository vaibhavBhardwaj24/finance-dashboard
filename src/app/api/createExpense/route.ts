import { connectToDatabase } from "@/lib/mongo";
import expenseModel from "@/model/expense.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { amount, description, type } = await req.json();
    const newData = await expenseModel.create({ amount, description, type });
    console.log(newData);
    return NextResponse.json("Added", { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
