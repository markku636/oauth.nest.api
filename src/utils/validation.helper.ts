import { ApiReturnCode } from '@/enums/api-return-code';
import { plainToInstance } from 'class-transformer';

import { validate, ValidationError } from 'class-validator';

export const formatValidationErrors = (
    errors: ValidationError[],
): Record<string, string> => {
    return errors.reduce((acc, err) => {
        acc[err.property] = Object.values(err.constraints).join(', ');
        return acc;
    }, {});
};
export async function generalValidateDto<T extends object>(
    dtoClass: new () => T, // 暫時找不到解法去除這個方法，無法像 C# 一樣直接使用 T
    dtoInstance: any,
): Promise<IApiResultWithData<T>> {
    const newDTO = plainToInstance(dtoClass, dtoInstance);

    const errors: ValidationError[] = await validate(newDTO);

    let result: IApiResultWithData<T> = {
        data: undefined,
        isSuccess: false,
        returnCode: ApiReturnCode.ValidationError,
    };

    try {
        if (errors.length > 0) {
            result.validation = formatValidationErrors(errors);
            return result;
        }

        result.data = newDTO;
        result.isSuccess = true;
        result.returnCode = ApiReturnCode.Success;
    } catch (e) {
        // todo write log
    }

    return result;
}
