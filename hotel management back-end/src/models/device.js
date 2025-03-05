class Device {
  constructor({
    deviceTypeId = "",
    deviceName = "",
    roomId = "",
    price = "",
    status = "",
    description = "",
    deleted = false,
  }) {
    this.deviceTypeId = deviceTypeId;
    this.deviceName = deviceName;
    this.roomId = roomId;
    this.price = price;
    this.status = status;
    this.description = description;
    this.deleted = deleted;
  }
}

export default Device;
