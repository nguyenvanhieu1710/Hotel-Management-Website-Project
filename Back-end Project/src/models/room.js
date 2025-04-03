class Room {
  constructor({
    RoomId = 0,
    RoomTypeId = 0,
    RoomImage = "",
    Price = 0,
    NumberOfFloor = 0,
    MaximumNumberOfGuests = 0,
    Status = "",
    Description = "",
    RoomArea = 0,
    Amenities = "",
    RoomDetail = "",
    Deleted = false,
  }) {
    this.RoomId = RoomId;
    this.RoomTypeId = RoomTypeId;
    this.RoomImage = RoomImage;
    this.Price = Price;
    this.NumberOfFloor = NumberOfFloor;
    this.MaximumNumberOfGuests = MaximumNumberOfGuests;
    this.Status = Status;
    this.Description = Description;
    this.RoomArea = RoomArea;
    this.Amenities = Amenities;
    this.RoomDetail = RoomDetail;
    this.Deleted = Deleted;
  }
}

export default Room;
