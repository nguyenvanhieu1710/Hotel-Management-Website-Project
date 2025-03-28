class Event {
  constructor({
    EventId,
    EventName,
    EventTypeId,
    EventImage,
    OrganizationDay,
    StartTime,
    EndTime,
    OrganizationLocation,
    Price,
    Status,
    Description,
    Deleted,
  }) {
    this.EventId = EventId;
    this.EventName = EventName;
    this.EventTypeId = EventTypeId;
    this.EventImage = EventImage;
    this.OrganizationDay = OrganizationDay;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.OrganizationLocation = OrganizationLocation;
    this.Price = Price;
    this.Status = Status;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Event;
