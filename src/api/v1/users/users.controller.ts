import type { Request, Response, NextFunction } from 'express';
import * as userService from './users.service';
import type { RegisterUserInput, UpdateUserInput } from './users.schema';
import { BadRequestError, NotFoundError } from '../../../utils/app-error';

interface UserIdParams {
  userId: string;
}

interface UserEmailBody {
  email: string;
}

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userInput: RegisterUserInput = req.body;

    const user = await userService.createUser(userInput);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      message: 'User deleted successfully',
      id: deletedUser._id,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

    if (!user) throw new NotFoundError('User not found');

    res.status(200).json({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserByEmail(
  req: Request<{}, {}, UserEmailBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const page = parseInt(req.query.page as string, 10) || 1;

    const users = await userService.listUsers(limit, page);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
