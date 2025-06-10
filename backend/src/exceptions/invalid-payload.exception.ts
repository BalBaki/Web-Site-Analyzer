import { HttpException } from '@nestjs/common';
import { Status } from 'src/enums';

export class InvalidPayloadException extends HttpException {
    constructor() {
        super(
            {
                status: Status.Err,
                error: 'Enter valid data..!',
            },
            402,
        );
    }
}
