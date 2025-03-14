class Device {
  constructor({
    DeviceId = "",
    DeviceName = "",
    DeviceTypeId = "",
    RoomId = "",
    Price = "",
    Status = "",
    Description = "",
    Deleted = false,
  }) {
    this.DeviceId = DeviceId;
    this.DeviceTypeId = DeviceTypeId;
    this.DeviceName = DeviceName;
    this.RoomId = RoomId;
    this.Price = Price;
    this.Status = Status;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Device;
