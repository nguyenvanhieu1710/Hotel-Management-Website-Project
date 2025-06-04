import User from "../../models/user.js";

describe("User Model", () => {
  it("should create a user with default values", () => {
    const user = new User({});

    expect(user).toEqual({
      UserId: 0,
      IdentificationNumber: "",
      UserName: "",
      UserImage: "",
      DateOfBirth: "",
      Gender: "",
      PhoneNumber: "",
      Address: "",
      Deleted: false,
    });
  });

  it("should create a user with provided values", () => {
    const userData = {
      UserId: 1,
      IdentificationNumber: "123456789",
      UserName: "Test User",
      UserImage: "image.jpg",
      DateOfBirth: "1990-01-01",
      Gender: "Male",
      PhoneNumber: "1234567890",
      Address: "Test Address",
      Deleted: false,
    };

    const user = new User(userData);

    expect(user).toEqual(userData);
  });

  it("should handle partial user data", () => {
    const userData = {
      UserId: 1,
      UserName: "Test User",
    };

    const user = new User(userData);

    expect(user).toEqual({
      UserId: 1,
      IdentificationNumber: "",
      UserName: "Test User",
      UserImage: "",
      DateOfBirth: "",
      Gender: "",
      PhoneNumber: "",
      Address: "",
      Deleted: false,
    });
  });
});
