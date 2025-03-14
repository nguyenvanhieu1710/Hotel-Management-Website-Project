class DeviceType {
  constructor({
    DeviceTypeId = 0,
    DeviceTypeName = "",
    Description = "",
    Deleted = false,
  }) {
    this.DeviceTypeId = DeviceTypeId;
    this.DeviceTypeName = DeviceTypeName;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default DeviceType;
