import * as bcrypt from 'bcrypt';

export const encryptPassword = async (
    password: string,
    salt: string,
): Promise<string> => {
    const hash = await bcrypt.hashSync(password, salt);
    return await hash;
};
