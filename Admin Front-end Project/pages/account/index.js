import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

const Account = () => {
  let emptyAccount = {
    AccountId: 0,
    AccountName: "",
    Password: "",
    Email: "",
    Role: "",
    Status: "",
    CreationDate: "",
    Deleted: false,
  };
  const [token, setToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(emptyAccount);
  const [selectedAccounts, setSelectedAccounts] = useState(null);
  const [accountDialog, setAccountDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [deleteAccountsDialog, setDeleteAccountsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchAccounts();
    }
  }, [token]);

  const fetchAccounts = () => {
    axios
      .get("http://localhost:3000/api/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        // Backend now returns { success: true, data: [...], pagination: {...} }
        if (response.data.success && response.data.data) {
          setAccounts(response.data.data);
        } else {
          // Fallback for old format
          setAccounts(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        setAccounts([]); // Set empty array on error
      });
  };

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Customer", value: "Customer" },
    { label: "Staff", value: "Staff" },
  ];

  const statusOptions = [
    { label: "Online", value: "Online" },
    { label: "Offline", value: "Offline" },
  ];

  const openNew = () => {
    setAccount(emptyAccount);
    setSubmitted(false);
    setAccountDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setAccountDialog(false);
  };

  const hideDeleteAccountDialog = () => {
    setDeleteAccountDialog(false);
  };

  const hideDeleteAccountsDialog = () => {
    setDeleteAccountsDialog(false);
  };

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const validateAccount = () => {
    let isValid = true;
    if (!account.AccountName || !account.AccountName.trim()) isValid = false;
    if (!account.Email || !account.Email.trim()) isValid = false;
    if (!account.Role || !account.Role.trim()) isValid = false;
    if (!account.Status || !account.Status.trim()) isValid = false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (account.Email && !emailRegex.test(account.Email)) isValid = false;

    return isValid;
  };

  const saveAccount = () => {
    setSubmitted(true);

    if (!validateAccount()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill in all required fields",
        life: 3000,
      });
      return;
    }

    if (account.AccountId !== 0) {
      console.log("Updating account: ", account);
      const updateData = {
        AccountName: account.AccountName,
        Role: account.Role,
        Status: account.Status,
      };

      // Only include email if it's provided and not empty
      if (account.Email && account.Email.trim()) {
        updateData.Email = account.Email;
      }

      console.log("Sending update data:", updateData);
      console.log("Account ID:", account.AccountId);

      axios
        .put(
          `http://localhost:3000/api/account/${account.AccountId}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("Update response:", response.data);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: response.data.message || "Account Updated",
            life: 3000,
          });
          fetchAccounts();
          setAccountDialog(false);
          setAccount(emptyAccount);
        })
        .catch((error) => {
          console.error("Update error:", error.response?.data || error.message);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error updating account",
            life: 3000,
          });
        });
    } else {
      console.log("Creating new account: ", account);
      const createData = {
        AccountName: account.AccountName,
        Password: "123456", // Default password
        Email: account.Email,
        Role: account.Role,
        Status: account.Status,
      };

      axios
        .post("http://localhost:3000/api/account", createData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Create response:", response.data);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: response.data.message || "Account Created",
            life: 3000,
          });
          fetchAccounts();
          setAccountDialog(false);
          setAccount(emptyAccount);
        })
        .catch((error) => {
          console.error("Create error:", error.response?.data || error.message);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error creating account",
            life: 3000,
          });
        });
    }
  };

  const editAccount = (accountData) => {
    console.log("Editing account:", accountData);
    setAccount({ ...accountData });
    setAccountDialog(true);
  };

  const confirmDeleteAccount = (accountData) => {
    setAccount(accountData);
    setDeleteAccountDialog(true);
  };

  const deleteAccount = () => {
    axios
      .delete(`http://localhost:3000/api/account/${account.AccountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Delete response:", response.data);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: response.data.message || "Account Deleted",
          life: 3000,
        });
        fetchAccounts(); // Refresh the list
        setDeleteAccountDialog(false);
        setAccount(emptyAccount);
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            "Error deleting account: " +
            (error.response?.data?.message || error.message),
          life: 3000,
        });
      });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].AccountId === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteAccountsDialog(true);
  };

  const deleteSelectedAccounts = () => {
    let _accounts = accounts.filter((val) => !selectedAccounts.includes(val));
    setAccounts(_accounts);
    setDeleteAccountsDialog(false);
    setSelectedAccounts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Accounts Deleted",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;
    let _account = { ...account };
    _account[name] = val;
    setAccount(_account);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="my-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          className="mr-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedAccounts || !selectedAccounts.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <></>;
  };

  const accountNameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Account Name</span>
        {rowData.AccountName}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.Email}
      </>
    );
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Role</span>
        {rowData.Role}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        {rowData.Status}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          severity="success"
          rounded
          className="mr-2"
          onClick={() => editAccount(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          onClick={() => confirmDeleteAccount(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Accounts</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const accountDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveAccount} />
    </>
  );

  const deleteAccountDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteAccountDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteAccount} />
    </>
  );

  const deleteAccountsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteAccountsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedAccounts}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={accounts}
            selection={selectedAccounts}
            onSelectionChange={(e) => setSelectedAccounts(e.value)}
            dataKey="AccountId"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} accounts"
            globalFilter={globalFilter}
            emptyMessage="No accounts found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "4rem" }} />
            <Column
              field="AccountName"
              header="Account Name"
              sortable
              body={accountNameBodyTemplate}
              headerStyle={{ minWidth: "12rem" }}
            />
            <Column
              field="Email"
              header="Email"
              sortable
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "12rem" }}
            />
            <Column
              field="Role"
              header="Role"
              sortable
              body={roleBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
            <Column
              field="Status"
              header="Status"
              sortable
              body={statusBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
            <Column
              field="Action"
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
          </DataTable>

          <Dialog
            visible={accountDialog}
            style={{ width: "450px" }}
            header="Account Details"
            modal
            className="p-fluid"
            footer={accountDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="AccountName">Account Name</label>
              <InputText
                id="AccountName"
                value={account.AccountName}
                onChange={(e) => onInputChange(e, "AccountName")}
                required
                autoFocus
                placeholder="Please enter your name"
                className={classNames({
                  "p-invalid": submitted && !account.AccountName,
                })}
              />
              {submitted && !account.AccountName && (
                <small className="p-invalid">Account Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="Email">Email</label>
              <InputText
                id="Email"
                value={account.Email}
                onChange={(e) => onInputChange(e, "Email")}
                required
                type="email"
                placeholder="Please enter your email address"
                className={classNames({
                  "p-invalid":
                    submitted &&
                    (!account.Email ||
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.Email)),
                })}
              />
              {submitted && !account.Email && (
                <small className="p-invalid">Email is required.</small>
              )}
              {submitted &&
                account.Email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.Email) && (
                  <small className="p-invalid">
                    Please enter a valid email address.
                  </small>
                )}
            </div>
            <div className="field">
              <label htmlFor="Role">Role</label>
              <Dropdown
                id="Role"
                value={account.Role}
                options={roleOptions}
                onChange={(e) => setAccount({ ...account, Role: e.value })}
                placeholder="Select a Role"
                className={classNames({
                  "p-invalid": submitted && !account.Role,
                })}
              />
              {submitted && !account.Role && (
                <small className="p-invalid">Role is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="Status">Status</label>
              <Dropdown
                id="Status"
                value={account.Status}
                options={statusOptions}
                onChange={(e) => setAccount({ ...account, Status: e.value })}
                placeholder="Select Status"
                className={classNames({
                  "p-invalid": submitted && !account.Status,
                })}
              />
              {submitted && !account.Status && (
                <small className="p-invalid">Status is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteAccountDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteAccountDialogFooter}
            onHide={hideDeleteAccountDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {account && (
                <span>
                  Are you sure you want to delete <b>{account.AccountName}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteAccountsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteAccountsDialogFooter}
            onHide={hideDeleteAccountsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              <span>
                Are you sure you want to delete the selected accounts?
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Account;
