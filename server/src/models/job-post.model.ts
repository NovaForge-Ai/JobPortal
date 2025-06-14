import mongoose, { Document, Schema } from "mongoose";

export interface IJobPost extends Document {
  job_name: string;
  job_description: string;
  job_location: string;
  job_type: string;
  salary: number;
  experience_level: string;
  work_mode: string;
  benefits: string[];
  requirements: string;
  required_qualifications: string;
  visa_sponsorship: boolean;
  travel_benefits: boolean;
  is_active: boolean;
  created_date: Date;
  updated_date: Date;
  company_id: mongoose.Types.ObjectId;
  posted_by: mongoose.Types.ObjectId;
}

const JobPostSchema = new Schema<IJobPost>(
  {
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
    visa_sponsorship: {
      type: Boolean,
      default: false,
    },
    travel_benefits: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
  },
  {
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

export default mongoose.model<IJobPost>("JobPost", JobPostSchema); 