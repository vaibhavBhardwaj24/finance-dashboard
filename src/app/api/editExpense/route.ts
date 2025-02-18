import { connectToDatabase } from "@/lib/mongo";
import expenseModel from "@/model/expense.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, amount, description, type } = await req.json();
    const newData = await expenseModel.findByIdAndUpdate(
      id,
      {
        amount,
        description,
        type,
      },
      { returnDocument: "after" }
    );
    console.log(newData);
    return NextResponse.json(
      { message: "Edited", newData: newData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
