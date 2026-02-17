import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { status, resolutionImage } = body;

        const issue = await prisma.issue.update({
            where: { id: params.id },
            data: {
                status,
                imageAfter: resolutionImage,
            },
        });

        return NextResponse.json(issue);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
    }
}
