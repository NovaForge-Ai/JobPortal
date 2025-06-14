import mongoose, { Document, Schema } from "mongoose";

export interface IJobApplication extends Document {
  job_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_date: Date;
  resume_url?: string;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
    applied_date: {
      type: Date,
      default: Date.now,
    },
    resume_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
JobApplicationSchema.index({ job_id: 1, user_id: 1 }, { unique: true });
JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ applied_date: -1 });

export default mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema); 