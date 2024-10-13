import { ValidationError } from 'class-validator';

export const formatValidationErrors = (
    errors: ValidationError[],
): Record<string, string> => {
    return errors.reduce((acc, err) => {
        acc[err.property] = Object.values(err.constraints).join(', ');
        return acc;
    }, {});
};
