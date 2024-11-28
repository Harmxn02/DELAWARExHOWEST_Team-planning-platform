import { createConnection } from "../../../../lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
        const db = await createConnection();
        const sql = "SELECT * FROM employees WHERE isAvailable = True";
        const [employees] = await db.query(sql);

        return NextResponse.json({ employees: employees });

    } catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}
