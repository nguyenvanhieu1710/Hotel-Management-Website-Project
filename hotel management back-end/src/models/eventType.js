class EventType {
  constructor({ EventTypeId, EventTypeName, Description, Deleted }) {
    this.EventTypeId = EventTypeId;
    this.EventTypeName = EventTypeName;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default EventType;
