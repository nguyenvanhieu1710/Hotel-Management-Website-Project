class Service {
  constructor({
    ServiceId = 0,
    ServiceName = "",
    ServiceTypeId = 0,
    ServiceImage = "",
    Price = 0,
    Description = "",
    Deleted = false,
  }) {
    this.ServiceId = ServiceId;
    this.ServiceName = ServiceName;
    this.ServiceTypeId = ServiceTypeId;
    this.ServiceImage = ServiceImage;
    this.Price = Price;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Service;
