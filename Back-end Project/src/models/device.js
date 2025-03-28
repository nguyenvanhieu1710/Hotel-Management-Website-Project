class Device {
  constructor({
    DeviceId = "",
    DeviceName = "",
    DeviceTypeId = "",
    RoomId = "",
    DeviceImage = "",
    Price = "",
    Status = "",
    Description = "",
    Deleted = false,
  }) {
    this.DeviceId = DeviceId;
    this.DeviceTypeId = DeviceTypeId;
    this.DeviceName = DeviceName;
    this.RoomId = RoomId;
    this.DeviceImage = DeviceImage;
    this.Price = Price;
    this.Status = Status;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Device;
