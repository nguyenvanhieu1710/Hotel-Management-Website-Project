class Bill {
  constructor({
    BillId = 0,
    UserId = 0,
    StaffId = 0,
    CreationDate = "",
    TotalAmount = 0,
    Status = "",
    Note = "",
    Deleted = false,
  }) {
    this.BillId = BillId;
    this.UserId = UserId;
    this.StaffId = StaffId;
    this.CreationDate = CreationDate;
    this.TotalAmount = TotalAmount;
    this.Status = Status;
    this.Note = Note;
    this.Deleted = Deleted;
  }
}

export default Bill;
