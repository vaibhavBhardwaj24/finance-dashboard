import { connectToDatabase } from "@/lib/mongo";
import expenseModel from "@/model/expense.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    const newData = await expenseModel.findByIdAndDelete(id);
    console.log(newData);
    return NextResponse.json("Deleted", { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
