class BookingVotes {
  constructor({
    BookingVotesId,
    UserId,
    BookingDate,
    CheckinDate,
    CheckoutDate,
    Note,
    Deleted,
  }) {
    this.BookingVotesId = BookingVotesId;
    this.UserId = UserId;
    this.BookingDate = BookingDate;
    this.CheckinDate = CheckinDate;
    this.CheckoutDate = CheckoutDate;
    this.Note = Note;
    this.Deleted = Deleted;
  }
}

export default BookingVotes;
