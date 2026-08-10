import { Request, Response } from 'express';
import {hashPassword, comparePassword} from '../utils/hash';
import {SignupSchema} from '../schemas/authSchemas';
import User from '../models/User';
export const signup = async (req: Request, res: Response) => {
  try{
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.issues,
    });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashedPassword = await hashPassword(req.body.password);
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    passwordHash: hashedPassword,
  });
  return res.status(201).json({ message: "User created successfully", user: newUser });
  }catch(err){
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

}