import { createConnection } from "../../../../lib/db.js";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const body = await request.json()
		const db = await createConnection();
		const sql = "INSERT INTO project_assignments (employeeId, projectId) VALUES (?, ?)";
		const [result] = await db.query(sql, [body.employeeId, body.projectId]);
		
		return NextResponse.json({ result: result });
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}
