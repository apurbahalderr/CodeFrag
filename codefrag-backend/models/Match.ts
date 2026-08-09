import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMatch extends Document {
  roomCode: string;
  problem: Types.ObjectId;
  player1: Types.ObjectId;
  player2: Types.ObjectId | null;
  winner: Types.ObjectId | null;
  status: "waiting" | "active" | "finished";
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  roomCode: { type: String, required: true, unique: true },
  problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  player1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  player2: { type: Schema.Types.ObjectId, ref: "User", default: null },
  winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
  startedAt: { type: Date, default: null },
  finishedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMatch>("Match", MatchSchema);
