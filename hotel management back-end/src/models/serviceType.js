class ServiceType {
  constructor({
    ServiceTypeId = 0,
    ServiceTypeName = "",
    Description = "",
    Deleted = false,
  }) {
    this.ServiceTypeId = ServiceTypeId;
    this.ServiceTypeName = ServiceTypeName;
    this.Description = Description;
    this.Deleted = Deleted;
  }
}

export default ServiceType;
