import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const waitlistValidator = [
  body('email').isEmail().withMessage('Email is required'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
