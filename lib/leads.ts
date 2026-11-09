// Contact-form leads, stored in MongoDB via Mongoose (collection "leads").
import mongoose, { Schema, type Model } from "mongoose";
import { connectMongo } from "./mongo";

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  brand?: string;
  website?: string;
  services: string[];
  timeline?: string;
  message?: string;
};

const LeadSchema = new Schema<Lead>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true, index: true },
    name: { type: String, required: true, maxlength: 200 },
    email: { type: String, required: true, maxlength: 320 },
    brand: { type: String, maxlength: 200 },
    website: { type: String, maxlength: 500 },
    services: { type: [String], default: [] },
    timeline: { type: String, maxlength: 100 },
    message: { type: String, maxlength: 5000 },
  },
  { versionKey: false },
);

// Recompile on dev hot reload so schema edits apply (a cached model would silently drop new fields).
if (mongoose.models.Lead) mongoose.deleteModel("Lead");
const LeadModel: Model<Lead> = mongoose.model<Lead>("Lead", LeadSchema, "leads");

export async function listLeads(): Promise<Lead[]> {
  await connectMongo();
  return LeadModel.find({}, { _id: 0 }).sort({ createdAt: -1 }).lean<Lead[]>();
}

export async function addLead(lead: Lead) {
  await connectMongo();
  await LeadModel.create(lead);
}

export async function deleteLead(id: string) {
  await connectMongo();
  await LeadModel.deleteOne({ id });
}
