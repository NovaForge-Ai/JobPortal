import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema(
  {
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job_name: {
      type: String,
      required: true,
      trim: true,
    },
    job_description: {
      type: String,
      required: true,
    },
    job_location: {
      type: String,
      required: true,
      trim: true,
    },
    job_type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
    },
    salary: {
      type: Number,
      required: true,
    },
    experience_level: {
      type: String,
      required: true,
      enum: ["Entry Level", "Junior", "Mid Level", "Senior", "Lead", "Manager"],
    },
    work_mode: {
      type: String,
      required: true,
      enum: ["Remote", "On-site", "Hybrid"],
    },
    benefits: [{
      type: String,
      enum: [
        "Visa Sponsorship",
        "Health Insurance",
        "Dental Insurance",
        "Vision Insurance",
        "401(k)",
        "Paid Time Off",
        "Flexible Hours",
        "Professional Development",
      ],
    }],
    requirements: {
      type: String,
      required: true,
    },
    required_qualifications: {
      type: String,
      required: true,
    },
    is_company_name_hidden: {
      type: Boolean,
      required: true,
      default: false,
    },
    created_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: "job_post",
    timestamps: true,
  }
);

// Create indexes for better query performance
JobPostSchema.index({ job_name: 'text', job_description: 'text', job_location: 'text' });
JobPostSchema.index({ job_type: 1 });
JobPostSchema.index({ experience_level: 1 });
JobPostSchema.index({ work_mode: 1 });
JobPostSchema.index({ salary: 1 });
JobPostSchema.index({ created_date: -1 });
JobPostSchema.index({ company_id: 1 });
JobPostSchema.index({ posted_by: 1 });

const JobPost = mongoose.model("JobPost", JobPostSchema);

export default JobPost;
