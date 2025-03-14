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
    UserId = 0,
    IdentificationNumber = "",
    UserName = "",
    DateOfBirth = "",
    Gender = "",
    PhoneNumber = "",
    Address = "",
    Deleted = false,
  }) {
    this.UserId = UserId;
    this.IdentificationNumber = IdentificationNumber;
    this.UserName = UserName;
    this.DateOfBirth = DateOfBirth;
    this.Gender = Gender;
    this.PhoneNumber = PhoneNumber;
    this.Address = Address;
    this.Deleted = Deleted;
  }
}

export default User;
