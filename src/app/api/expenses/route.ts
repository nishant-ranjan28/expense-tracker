import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin if it hasn't been initialized yet.
if (!admin.apps.length) {
  // Adjust the path to your service account key as needed.
  const serviceAccount = require("../../../serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const snapshot = await db.collection("expenses").get();
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expecting payload with `category` and `amount`
    const newExpense = {
      category: body.category,
      amount: body.amount,
      date: new Date().toISOString(),
    };
    const docRef = await db.collection("expenses").add(newExpense);
    const expenseWithId = { id: docRef.id, ...newExpense };
    return NextResponse.json(expenseWithId, { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}
