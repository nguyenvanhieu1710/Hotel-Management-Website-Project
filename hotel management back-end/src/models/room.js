class Room {
  constructor({
    roomId = 0,
    roomTypeId = 0,
    price = 0,
    numberOfFloor = 0,
    status = "",
    description = "",
    deleted = false,
  }) {
    this.roomId = roomId;
    this.roomTypeId = roomTypeId;
    this.price = price;
    this.numberOfFloor = numberOfFloor;
    this.status = status;
    this.description = description;
    this.deleted = deleted;
  }
}

export default Room;
