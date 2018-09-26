import { BadRequestException } from '../exception';
import { PipeTransform } from '../feature';
import { ArgumentMetadata } from '../feature';

/**
 * 转为number
 */
export class ParseIntPipe implements PipeTransform<string> {
    async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        const isNumeric =
            'string' === typeof value &&
            !isNaN(parseFloat(value)) &&
            isFinite(value as any);
        if (!isNumeric) {
            throw new BadRequestException(
                'Validation failed (numeric string is expected)',
            );
        }
        return parseInt(value, 10);
    }
}
