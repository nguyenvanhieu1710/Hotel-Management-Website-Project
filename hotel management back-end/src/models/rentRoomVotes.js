class RentRoomVotes {
  constructor({
    RentRoomVotesId = 0,
    UserId = 0,
    ActualCheckinDate = "",
    ActualCheckoutDate = "",
    TotalAmount = 0,
    Status = "",
    Note = "",
    Deleted = false,
  }) {
    this.RentRoomVotesId = RentRoomVotesId;
    this.UserId = UserId;
    this.ActualCheckinDate = ActualCheckinDate;
    this.ActualCheckoutDate = ActualCheckoutDate;
    this.TotalAmount = TotalAmount;
    this.Status = Status;
    this.Note = Note;
    this.Deleted = Deleted;
  }
}

export default RentRoomVotes;
