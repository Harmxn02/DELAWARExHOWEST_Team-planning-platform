import { createConnection } from "../../../../lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
        const db = await createConnection();
        const sql = "SELECT * FROM projects ORDER BY dateStarted DESC";
        const [projects] = await db.query(sql);

        return NextResponse.json({ projects: projects });

    } catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}
