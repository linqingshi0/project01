import { Request } from 'express';

export function getPagination(req: Request) {
  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt((req.query.limit as string) || '10', 10), 1), 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
