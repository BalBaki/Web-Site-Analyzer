import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { InvalidPayloadException } from 'src/exceptions/invalid-payload.exception';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(
        private schema: ZodSchema,
        private action?: string,
    ) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);

            return parsedValue;
        } catch (error) {
            throw new InvalidPayloadException(this.action);
        }
    }
}
