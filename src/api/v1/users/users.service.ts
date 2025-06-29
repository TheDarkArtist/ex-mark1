import { ConflictError } from '../../../utils/app-error';
import User from './users.model';
import type { IUser } from "./users.model"
import bcrypt from 'bcrypt';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  phoneNumber?: string;
  profilePicture?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  phoneNumber?: string;
  profilePicture?: string;
  isActive?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export async function createUser(data: CreateUserInput): Promise<IUser> {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = new User({
    ...data,
    password: hashedPassword,
  });

  return user.save();
}

export async function getUserById(id: string): Promise<IUser | null> {
  return User.findById(id).exec();
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email }).exec();
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<IUser | null> {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12);
  }
  return User.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteUser(id: string): Promise<IUser | null> {
  return User.findByIdAndDelete(id).exec();
}

export async function listUsers(limit = 20, page = 1): Promise<Partial<IUser>[]> {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select('-password')
    .exec();

  return users
}

