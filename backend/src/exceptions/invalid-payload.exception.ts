import { HttpException } from '@nestjs/common';

export class InvalidPayloadException extends HttpException {
    constructor(action?: string) {
        super(
            {
                ...(action && { [action]: false }),
                error: 'Enter valid data..!',
            },
            402,
        );
    }
}
