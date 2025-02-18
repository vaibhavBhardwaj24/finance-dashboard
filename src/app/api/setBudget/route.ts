import { connectToDatabase } from "@/lib/mongo";
import budgetModel from "@/model/budget.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { type, budget } = await req.json();
    const newData = await budgetModel.findOneAndUpdate(
      { type: type },
      { budget: budget },
      { new: true, upsert: true }
    );
    // const newData = await budgetModel.create({ type, budget });
    return NextResponse.json({ newData: newData }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
