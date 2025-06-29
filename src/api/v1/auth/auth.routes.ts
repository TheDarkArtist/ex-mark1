import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Auth route placeholder');
});

export default router;

