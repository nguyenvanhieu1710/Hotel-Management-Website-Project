class Service {
  constructor({
    ServiceId = 0,
    ServiceName = "",
    ServiceTypeId = 0,
    Price = 0,
    Description = "",
    Deleted = false,
  }) {
    this.ServiceId = ServiceId;
    this.ServiceName = ServiceName;
    this.ServiceTypeId = ServiceTypeId;
    this.Price = Price;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default Service;
