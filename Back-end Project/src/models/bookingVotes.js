class BookingVotes {
  constructor({
    BookingVotesId,
    UserId,
    BookingDate,
    CheckinDate,
    CheckoutDate,
    Note,
    TotalAmount,
    Status,
    Deleted,
    listBookingVotesDetails,
  }) {
    this.BookingVotesId = BookingVotesId;
    this.UserId = UserId;
    this.BookingDate = BookingDate;
    this.CheckinDate = CheckinDate;
    this.CheckoutDate = CheckoutDate;
    this.Note = Note;
    this.TotalAmount = TotalAmount;
    this.Status = Status;
    this.Deleted = Deleted;
    this.listBookingVotesDetails = listBookingVotesDetails;
  }
}

export default BookingVotes;
