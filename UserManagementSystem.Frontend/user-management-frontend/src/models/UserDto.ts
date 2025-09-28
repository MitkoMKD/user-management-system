export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  isActive: boolean;
  passwordHash?: string;
}