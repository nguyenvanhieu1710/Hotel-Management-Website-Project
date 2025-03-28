class Staff {
  constructor({
    StaffId = 0,
    StaffName = "",
    StaffImage = "",
    DateOfBirth = "",
    Gender = "",
    PhoneNumber = "",
    Address = "",
    Position = "",
    Salary = 0,
    Status = "",
    WorkStartDate = "",
    Description = "",
    Deleted = false,
  }) {
    this.StaffId = StaffId;
    this.StaffName = StaffName;
    this.StaffImage = StaffImage;
    this.DateOfBirth = DateOfBirth;
    this.Gender = Gender;
    this.PhoneNumber = PhoneNumber;
    this.Address = Address;
    this.Position = Position;
    this.Salary = Salary;
    this.Status = Status;
    this.WorkStartDate = WorkStartDate;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Staff;
