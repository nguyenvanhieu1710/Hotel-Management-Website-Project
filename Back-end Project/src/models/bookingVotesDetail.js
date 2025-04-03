class BookingVotesDetail {
  constructor({
    BookingVotesDetailId = 0,
    BookingVotesId = 0,
    RoomId = 0,
    RoomPrice = 0,
    Note = "",
    Deleted = false,
  }) {
    this.BookingVotesDetailId = BookingVotesDetailId;
    this.BookingVotesId = BookingVotesId;
    this.RoomId = RoomId;
    this.RoomPrice = RoomPrice;
    this.Note = Note;
    this.Deleted = Deleted;
  }
}

export default BookingVotesDetail;
