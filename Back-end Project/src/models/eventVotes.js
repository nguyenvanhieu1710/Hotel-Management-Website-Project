class EventVotes {
  constructor({
    EventVotesId = 0,
    EventId = 0,
    UserId = 0,
    TotalAmount = 0,
    Deleted = false,
  }) {
    this.EventVotesId = EventVotesId;
    this.EventId = EventId;
    this.UserId = UserId;
    this.TotalAmount = TotalAmount;
    this.Deleted = Deleted;
  }
}

export default EventVotes;
