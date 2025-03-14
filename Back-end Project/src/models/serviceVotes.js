class ServiceVotes {
  constructor({
    ServiceVotesId = 0,
    ServiceId = 0,
    Quantity = 0,
    TotalAmount = 0,
    Deleted = false,
  }) {
    this.ServiceVotesId = ServiceVotesId;
    this.ServiceId = ServiceId;
    this.Quantity = Quantity;
    this.TotalAmount = TotalAmount;
    this.Deleted = Deleted;
  }
}

export default ServiceVotes;
