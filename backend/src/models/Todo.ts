import mongoose, { Document, Schema, Types } from "mongoose";

export type TodoPriority = "low" | "medium" | "high";

export interface ITodo extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: TodoPriority;
  tags: string[];
  position: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1000 },
    completed: { type: Boolean, default: false, index: true },
    dueDate: { type: Date, index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium", index: true },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    position: { type: Number, required: true, index: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

todoSchema.index({ user: 1, deletedAt: 1, position: 1 });

todoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const output = ret as unknown as Record<string, unknown>;
    output.id = output._id;
    delete output._id;
    delete output.__v;
    return output;
  }
});

export const Todo = mongoose.model<ITodo>("Todo", todoSchema);
