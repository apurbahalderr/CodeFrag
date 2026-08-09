import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  match: Types.ObjectId;
  user: Types.ObjectId;
  language: "cpp" | "java";
  code: string;
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  match: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  language: { type: String, enum: ["cpp", "java"], required: true },
  code: { type: String, required: true },
  passed: { type: Boolean, default: false },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
