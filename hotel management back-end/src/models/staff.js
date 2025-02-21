class Staff {
  constructor({
    id = 0,
    name = "",
    email = "",
    phone = "",
    address = "",
    position = "",
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.position = position;
  }
}

export default Staff;
