import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect';
import Problem from '../models/Problem';

async function seed() {
  await connectDB();

  const problem = await Problem.create({
    title: 'Sum of Two Numbers',
    description: 'Given two integers, print their sum.',
    difficulty: 'easy',
    constraints: '1 <= a, b <= 1000',
    testCases: [
      { input: '3 5', expectedOutput: '8' },
      { input: '10 20', expectedOutput: '30' },
      { input: '100 200', expectedOutput: '300' },
    ],
    starterCode: {
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  // your code here\n}',
      java: 'public class Solution {\n  public static void main(String[] args) {\n    // your code here\n  }\n}',
    },
  });

  console.log('Problem created with ID:', problem._id.toString());
  process.exit(0);
}

seed();