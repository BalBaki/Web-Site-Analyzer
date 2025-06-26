import { Status } from '@/enums';
import { askSchema } from '@/schemas';
import { AnalyzerService } from '@/services/analyzer.service';

export async function POST(request: Request) {
    const body = await request.json();
    const validatedBody = askSchema.safeParse(body);

    if (!validatedBody.success) return Response.json({ status: Status.Err, err: 'Enter valid data..!' });

    return Response.json(await AnalyzerService.assistant(validatedBody.data));
}
