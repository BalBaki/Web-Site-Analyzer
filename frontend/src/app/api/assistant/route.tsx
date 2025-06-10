import { askSchema } from '@/schemas';
import analyzer from '@/services/analyzer.service';

export async function POST(request: Request) {
    const body = await request.json();
    const validatedBody = askSchema.safeParse(body);

    if (!validatedBody.success) return Response.json({ assistant: false, error: 'Enter valid data..!' });

    return Response.json(await analyzer.assistant(validatedBody.data));
}
