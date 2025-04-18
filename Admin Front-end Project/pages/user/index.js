import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    UserId: 0,
    IdentificationNumber: "0",
    UserName: "",
    UserImage: "",
    DateOfBirth: "",
    Gender: "",
    PhoneNumber: "",
    Address: "",
    Deleted: false,
  });
  const [token, setToken] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

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
      IdentificationNumber: "0",
      UserName: "",
      UserImage: "",
      DateOfBirth: "",
      Gender: "",
      PhoneNumber: "",
      Address: "",
      Deleted: false,
    });
    setUserDialog(true);
  };

  const hideDialog = () => setUserDialog(false);
  const hideDeleteDialog = () => setDeleteUserDialog(false);

  const validateUser = () => {
    if (
      user.UserName.trim() === "" ||
      user.PhoneNumber.trim() === "" ||
      user.Gender.trim() === "" ||
      user.Address.trim() === "" ||
      !user.DateOfBirth
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Name, Phone, Gender, Address, and Date of Birth are required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const saveUser = () => {
    if (!validateUser()) return;
    if (user.UserId === 0) {
      console.log("Creating a new user: ", user);
      user.DateOfBirth = formatDateToMySQL(user.DateOfBirth);
      user.Deleted = false;
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
      console.log("Updating a new user: ", user);
      user.DateOfBirth = formatDateToMySQL(user.DateOfBirth);
      user.Deleted = false;
      axios
        .put(`http://localhost:3000/api/user/update`, user, {
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
    setUser({ ...rowData, DateOfBirth: new Date(rowData.DateOfBirth) });
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

  const onImageUpload = async (event) => {
    const file = event.files[0];
    if (!file) {
      alert("Please choose file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const data = reader.result.split(",")[1];
      const postData = {
        name: file.name,
        type: file.type,
        data: data,
      };
      await postFile(postData);
    };
  };

  async function postFile(postData) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyz_D55hBv_H6AqQqwmLKQeYIRbBAw6n-zkxf_J92QV7F8V9dTUF5NJi2533S7nnoBL/exec",
        {
          method: "POST",
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      console.log("API Response When Upload Image:", data);
      if (data.link) {
        setUser((prev) => ({ ...prev, UserImage: data.link }));
      } else {
        alert("Upload failed! No image link returned.");
      }
    } catch (error) {
      alert("Please try again");
    }
  }

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
        <Column
          field="IdentificationNumber"
          header="Identification No."
          sortable
        />
        <Column field="UserName" header="User Name" sortable />
        <Column
          field="UserImage"
          header="Image"
          body={(rowData) => (
            <img
              src={rowData.UserImage}
              alt="User"
              style={{ width: "50px", height: "50px", borderRadius: "5px" }}
              referrerpolicy="no-referrer"
            />
          )}
          sortable
        />
        <Column
          field="DateOfBirth"
          header="Date of Birth"
          sortable
          body={(rowData) => new Date(rowData.DateOfBirth).toLocaleDateString()}
        />
        <Column field="Gender" header="Gender" sortable />
        <Column field="PhoneNumber" header="Phone" sortable />
        <Column field="Address" header="Address" sortable />
        <Column
          field="Deleted"
          header="Status"
          sortable
          body={(rowData) => (rowData.Deleted ? "Deleted" : "Active")}
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Fix */}
      <Dialog
        visible={userDialog}
        style={{ width: "500px" }}
        header="User Details"
        modal
        className="p-fluid"
        footer={userDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="UserName">User Name</label>
          <InputText
            id="UserName"
            value={user.UserName}
            onChange={(e) => setUser({ ...user, UserName: e.target.value })}
            required
            autoFocus
            placeholder="Please enter your user name"
          />
        </div>
        <div className="field">
          <label htmlFor="IdentificationNumber">Identification Number</label>
          <InputText
            id="IdentificationNumber"
            value={user.IdentificationNumber}
            onChange={(e) =>
              setUser({ ...user, IdentificationNumber: e.target.value })
            }
            required
            placeholder="Please enter your identification number"
          />
        </div>
        <div className="field">
          <label htmlFor="DateOfBirth">Date of Birth</label>
          <Calendar
            id="DateOfBirth"
            value={user.DateOfBirth}
            onChange={(e) =>
              setUser({ ...user, DateOfBirth: formatDateToMySQL(e.value) })
            }
            showIcon
            placeholder="Please enter your date of birth"
          />
        </div>
        <div className="field">
          <label htmlFor="Gender">Gender</label>
          <Dropdown
            id="Gender"
            value={user.Gender}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            onChange={(e) => setUser({ ...user, Gender: e.value })}
            placeholder="Select Gender"
          />
        </div>
        <div className="field">
          <label htmlFor="PhoneNumber">Phone Number</label>
          <InputText
            id="PhoneNumber"
            value={user.PhoneNumber}
            onChange={(e) => setUser({ ...user, PhoneNumber: e.target.value })}
            required
            placeholder="Please enter your phone number"
          />
        </div>
        <div className="field">
          <label htmlFor="Address">Address</label>
          <InputText
            id="Address"
            value={user.Address}
            onChange={(e) => setUser({ ...user, Address: e.target.value })}
            required
            placeholder="Please enter your address"
          />
        </div>
        <div className="p-field">
          <label htmlFor="UserImage">User Image</label>
          <img
            src={
              user.UserImage && user.UserImage !== "null"
                ? user.UserImage
                : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
            }
            alt="User"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
            referrerpolicy="no-referrer"
          />

          <FileUpload
            mode="basic"
            name="UserImage"
            accept="image/*"
            customUpload
            auto
            chooseLabel="Upload Image"
            uploadHandler={(e) => onImageUpload(e)}
            className="p-mt-2"
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
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
