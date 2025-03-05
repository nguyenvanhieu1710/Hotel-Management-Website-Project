class RoomType {
  constructor({
    RoomTypeId = 0,
    RoomTypeName = "",
    MaximumNumberOfGuests = 0,
    Description = "",
    Deleted = false,
  }) {
    this.RoomTypeId = RoomTypeId;
    this.RoomTypeName = RoomTypeName;
    this.MaximumNumberOfGuests = MaximumNumberOfGuests;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default RoomType;
