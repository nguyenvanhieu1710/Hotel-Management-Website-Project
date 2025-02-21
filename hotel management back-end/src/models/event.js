class Event {
  constructor({
    EventId,
    EventName,
    EventTypeId,
    UserId,
    OrganizationDay,
    StartTime,
    EndTime,
    OrganizationLocation,
    TotalCost,
    Status,
    Description,
    Deleted,
  }) {
    this.EventId = EventId;
    this.EventName = EventName;
    this.EventTypeId = EventTypeId;
    this.UserId = UserId;
    this.OrganizationDay = OrganizationDay;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.OrganizationLocation = OrganizationLocation;
    this.TotalCost = TotalCost;
    this.Status = Status;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Event;
