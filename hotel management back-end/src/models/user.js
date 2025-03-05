// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     userId: Number,
//     identificationNumber: String,
//     userName: String,
//     dateOfBirth: Date,
//     gender: String,
//     phoneNumber: String,
//     address: String,
//     deleted: Boolean,
//   },
//   { timestamps: true, versionKey: false }
// );

// // tăng tốc độ tìm kiếm
// userSchema.index({ userName: 1 }, { unique: true });

// export const User = mongoose.model("User", userSchema);

class User {
  constructor({
    userId = 0,
    identificationNumber = "",
    userName = "",
    dateOfBirth = "",
    gender = "",
    phoneNumber = "",
    address = "",
    deleted = false,
  }) {
    this.userId = userId;
    this.identificationNumber = identificationNumber;
    this.userName = userName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.deleted = deleted;
  }
}

export default User;
