class Account {
  constructor({
    AccountId = 0,
    AccountName = "",
    Password = "",
    Role = "",
    Email = "",
    Status = "",
    CreationDate = "",
    Deleted = false,
  }) {
    this.AccountId = AccountId;
    this.AccountName = AccountName;
    this.Password = Password;
    this.Role = Role;
    this.Email = Email;
    this.Status = Status;
    this.CreationDate = CreationDate;
    this.Deleted = Deleted;
  }
}

export default Account;
