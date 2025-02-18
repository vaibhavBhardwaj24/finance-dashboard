import { connectToDatabase } from "@/lib/mongo";
import expenseModel from "@/model/expense.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const newData = await expenseModel.find().sort({ timestamp: -1 });
    return NextResponse.json({ newData: newData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
