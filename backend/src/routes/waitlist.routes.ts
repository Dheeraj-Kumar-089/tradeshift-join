import { Router, Request, Response } from 'express';
import Waitlist from '../models/waitlist.model.js';
import { waitlistValidator, validate } from '../validators/auth.validator.js';

const router = Router();

router.post('/', waitlistValidator, validate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: 'you are already joined. Thanks for giving your valuable time' });
       return;
    }

    await Waitlist.create({ name, email, phone });
    
    res.status(201).json({ message: 'Successfully joined waitlist' });
  } catch (error: any) {
    console.error('Waitlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
