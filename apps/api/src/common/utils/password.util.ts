import bcrypt from 'bcryptjs';

export class PasswordUtil {
  private static SALT_ROUNDS = 12;

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
