class RoomType {
  constructor({
    RoomTypeId = 0,
    RoomTypeName = "",
    Description = "",
    Deleted = false,
  }) {
    this.RoomTypeId = RoomTypeId;
    this.RoomTypeName = RoomTypeName;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default RoomType;
