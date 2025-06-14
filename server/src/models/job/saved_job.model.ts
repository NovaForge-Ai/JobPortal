import mongoose from "mongoose";

const SavedJobSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    saved_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "saved_jobs",
    timestamps: true,
  }
);

// Create a compound index to ensure a user can't save the same job twice
SavedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

const SavedJob = mongoose.model("SavedJob", SavedJobSchema);

export default SavedJob; 