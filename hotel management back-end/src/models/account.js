class Account {
  constructor({
    AccountId,
    AccountName,
    Password,
    Role,
    Status,
    CreationDate,
    Deleted,
  }) {
    this.AccountId = AccountId;
    this.AccountName = AccountName;
    this.Password = Password;
    this.Role = Role;
    this.Status = Status;
    this.CreationDate = CreationDate;
    this.Deleted = Deleted;
  }
}

export default Account;
