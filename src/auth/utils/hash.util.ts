import * as bcrypt from 'bcrypt';

export class HashUtil {
    static async hashPassword(password: string): Promise<string>{
        return bcrypt.hash(password, 10)
    }

    static async comparePassword(password: string, hashed: string): Promise<boolean>{
        return bcrypt.compare(password, hashed)
    }
}