class Room {
  constructor({
    RoomId = 0,
    RoomTypeId = 0,
    RoomImage = "",
    Price = 0,
    NumberOfFloor = 0,
    Status = "",
    Description = "",
    Deleted = false,
  }) {
    this.RoomId = RoomId;
    this.RoomTypeId = RoomTypeId;
    this.RoomImage = RoomImage;
    this.Price = Price;
    this.NumberOfFloor = NumberOfFloor;
    this.Status = Status;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Room;
