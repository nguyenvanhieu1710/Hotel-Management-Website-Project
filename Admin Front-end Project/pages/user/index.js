import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    UserId: 0,
    Name: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    Address: "",
    Deleted: false,
  });
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`http://localhost:3000/api/user/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setUser({
      UserId: 0,
      Name: "",
      Email: "",
      PhoneNumber: "",
      Gender: "",
      Address: "",
      Deleted: false,
    });
    setUserDialog(true);
  };

  const hideDialog = () => setUserDialog(false);
  const hideDeleteDialog = () => setDeleteUserDialog(false);

  const saveUser = () => {
    if (
      user.Name.trim() === "" ||
      user.Email.trim() === "" ||
      user.PhoneNumber.trim() === ""
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Name, Email, and Phone are required",
        life: 3000,
      });
      return;
    }

    if (user.UserId === 0) {
      axios
        .post(`http://localhost:3000/api/user/create`, user, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchUsers();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "User Created",
            life: 3000,
          });
        });
    } else {
      axios
        .put(`http://localhost:3000/api/user/update/${user.UserId}`, user, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchUsers();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "User Updated",
            life: 3000,
          });
        });
    }
    setUserDialog(false);
  };

  const editUser = (rowData) => {
    setUser({ ...rowData });
    setUserDialog(true);
  };

  const confirmDeleteUser = (rowData) => {
    setUser(rowData);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    axios
      .delete(`http://localhost:3000/api/user/delete/${user.UserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User Deleted",
          life: 3000,
        });
      });
    setDeleteUserDialog(false);
  };

  const deleteSelectedUsers = () => {
    const idsToDelete = selectedUsers.map((item) => item.UserId);
    axios
      .post(`http://localhost:3000/api/user/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Users Deleted",
          life: 3000,
        });
      });
  };

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        label="New"
        icon="pi pi-plus"
        className="p-button-success"
        onClick={openNew}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={deleteSelectedUsers}
        disabled={!selectedUsers || !selectedUsers.length}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <InputText
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search..."
    />
  );

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success"
        onClick={() => editUser(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteUser(rowData)}
      />
    </div>
  );

  const userDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </div>
  );

  const deleteUserDialogFooter = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteUser}
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      <DataTable
        value={users}
        selection={selectedUsers}
        onSelectionChange={(e) => setSelectedUsers(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="User Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="UserId" header="ID" sortable />
        <Column field="Name" header="Name" sortable />
        <Column field="Email" header="Email" sortable />
        <Column field="PhoneNumber" header="Phone" sortable />
        <Column field="Gender" header="Gender" sortable />
        <Column field="Address" header="Address" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Thêm/Sửa */}
      <Dialog
        visible={userDialog}
        style={{ width: "450px" }}
        header="User Details"
        modal
        className="p-fluid"
        footer={userDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="Name">Name</label>
          <InputText
            id="Name"
            value={user.Name}
            onChange={(e) => setUser({ ...user, Name: e.target.value })}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="Email">Email</label>
          <InputText
            id="Email"
            value={user.Email}
            onChange={(e) => setUser({ ...user, Email: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="PhoneNumber">Phone Number</label>
          <InputText
            id="PhoneNumber"
            value={user.PhoneNumber}
            onChange={(e) => setUser({ ...user, PhoneNumber: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Gender">Gender</label>
          <InputText
            id="Gender"
            value={user.Gender}
            onChange={(e) => setUser({ ...user, Gender: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="Address">Address</label>
          <InputText
            id="Address"
            value={user.Address}
            onChange={(e) => setUser({ ...user, Address: e.target.value })}
          />
        </div>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog
        visible={deleteUserDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {user && (
            <span>
              Are you sure you want to delete <b>{user.Name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
