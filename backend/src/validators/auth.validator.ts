import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const waitlistValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\d{10}$/).withMessage('Enter 10 digit Phone Number'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
