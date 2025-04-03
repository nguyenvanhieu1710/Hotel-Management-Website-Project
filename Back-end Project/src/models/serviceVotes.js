class ServiceVotes {
  constructor({
    ServiceVotesId = 0,
    ServiceId = 0,
    UserId = 0,
    Quantity = 0,
    TotalAmount = 0,
    Deleted = false,
  }) {
    this.ServiceVotesId = ServiceVotesId;
    this.ServiceId = ServiceId;
    this.UserId = UserId;
    this.Quantity = Quantity;
    this.TotalAmount = TotalAmount;
    this.Deleted = Deleted;
  }
}

export default ServiceVotes;
