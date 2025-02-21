import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userId: Number,
    identificationNumber: String,
    userName: String,
    dateOfBirth: Date,
    gender: String,
    phoneNumber: String,
    address: String,
    deleted: Boolean,
  },
  { timestamps: true, versionKey: false }
);

// tăng tốc độ tìm kiếm
userSchema.index({ userName: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
