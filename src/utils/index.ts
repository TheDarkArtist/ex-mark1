import type { IUser } from '@/api/v1/users/users.model'

export function sanitizeUser(user: IUser) {
  const { password, __v, _id, ...rest } = user.toObject()
  return { ...rest, id: _id.toString() }
}
