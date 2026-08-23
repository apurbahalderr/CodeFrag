import { Request, Response } from 'express';
import { SubmitSchema } from '../schemas/submissionSchemas';
import Problem from '../models/Problem';
import Submission from '../models/Submission';
import { evaluateSubmission } from '../judge/evaluateSubmission';

export const submit = async (req: Request, res: Response) => {
  try {
    const result = SubmitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues,
      });
    }

    const { code, language, problemId } = result.data;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};