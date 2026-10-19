import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const commentSchema = new Schema({
  userId: { type: String, required: true },
  authorName: { type: String, required: true, maxlength: 80 },
  body: { type: String, required: true, maxlength: 1200 },
}, { timestamps: true });

const postSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 130 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, trim: true, maxlength: 260 },
  content: { type: String, required: true, maxlength: 50000 },
  imageUrl: { type: String, trim: true, maxlength: 240 },
  imageData: { type: String, select: false },
  imageMimeType: { type: String, select: false, enum: ["image/jpeg", "image/png", "image/webp", "image/avif"] },
  tags: { type: [String], default: [], index: true },
  category: { type: String, default: "Field notes", maxlength: 60 },
  authorId: { type: String, required: true, index: true },
  authorName: { type: String, required: true, maxlength: 80 },
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  publishedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
postSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });
export type PostShape = InferSchemaType<typeof postSchema>;
export const Post: Model<PostShape> = (mongoose.models.Post as Model<PostShape>) || mongoose.model<PostShape>("Post", postSchema);
