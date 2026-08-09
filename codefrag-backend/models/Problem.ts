import mongoose, { Schema, Document } from "mongoose";

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  constraints: string;
  testCases: ITestCase[];
  starterCode: {
    cpp: string;
    java: string;
  };
  createdAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  constraints: { type: String, default: "" },
  testCases: { type: [TestCaseSchema], required: true },
  starterCode: {
    cpp: { type: String, default: "" },
    java: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProblem>("Problem", ProblemSchema);
