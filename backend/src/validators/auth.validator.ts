import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const waitlistValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .custom((value) => {
      if (typeof value === 'string' && !value.endsWith('@gmail.com')) {
        throw new Error('Please provide a valid email address');
      }
      return true;
    }),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
