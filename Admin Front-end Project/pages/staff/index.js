import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState({
    StaffId: 0,
    StaffName: "",
    Email: "",
    PhoneNumber: "",
    Deleted: false,
  });
  const [staffDialog, setStaffDialog] = useState(false);
  const [deleteStaffDialog, setDeleteStaffDialog] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    axios
      .get(`http://localhost:3000/api/staff/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStaffs(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setStaff({
      StaffId: 0,
      StaffName: "",
      Email: "",
      PhoneNumber: "",
      Deleted: false,
    });
    setStaffDialog(true);
  };

  const hideDialog = () => setStaffDialog(false);
  const hideDeleteDialog = () => setDeleteStaffDialog(false);

  const saveStaff = () => {
    if (
      staff.StaffName.trim() === "" ||
      staff.Email.trim() === "" ||
      staff.PhoneNumber.trim() === ""
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All fields are required",
        life: 3000,
      });
      return;
    }

    if (staff.StaffId === 0) {
      axios
        .post(`http://localhost:3000/api/staff/create`, staff, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchStaffs();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Staff Created",
            life: 3000,
          });
        });
    } else {
      axios
        .put(`http://localhost:3000/api/staff/update/${staff.StaffId}`, staff, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchStaffs();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Staff Updated",
            life: 3000,
          });
        });
    }
    setStaffDialog(false);
  };

  const editStaff = (rowData) => {
    setStaff({ ...rowData });
    setStaffDialog(true);
  };

  const confirmDeleteStaff = (rowData) => {
    setStaff(rowData);
    setDeleteStaffDialog(true);
  };

  const deleteStaff = () => {
    axios
      .delete(`http://localhost:3000/api/staff/delete/${staff.StaffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchStaffs();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Staff Deleted",
          life: 3000,
        });
      });
    setDeleteStaffDialog(false);
  };

  const deleteSelectedStaffs = () => {
    const idsToDelete = selectedStaffs.map((item) => item.StaffId);
    axios
      .post(`http://localhost:3000/api/staff/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchStaffs();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Staff Deleted",
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
        onClick={deleteSelectedStaffs}
        disabled={!selectedStaffs || !selectedStaffs.length}
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
        onClick={() => editStaff(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteStaff(rowData)}
      />
    </div>
  );

  const staffDialogFooter = (
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
        onClick={saveStaff}
      />
    </div>
  );

  const deleteStaffDialogFooter = (
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
        onClick={deleteStaff}
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
        value={staffs}
        selection={selectedStaffs}
        onSelectionChange={(e) => setSelectedStaffs(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Staff Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="StaffId" header="ID" sortable />
        <Column field="StaffName" header="Name" sortable />
        <Column field="Email" header="Email" sortable />
        <Column field="PhoneNumber" header="Phone Number" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={staffDialog}
        style={{ width: "450px" }}
        header="Staff Details"
        modal
        className="p-fluid"
        footer={staffDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="StaffName">Name</label>
          <InputText
            id="StaffName"
            value={staff.StaffName}
            onChange={(e) => setStaff({ ...staff, StaffName: e.target.value })}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="Email">Email</label>
          <InputText
            id="Email"
            value={staff.Email}
            onChange={(e) => setStaff({ ...staff, Email: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="PhoneNumber">Phone Number</label>
          <InputText
            id="PhoneNumber"
            value={staff.PhoneNumber}
            onChange={(e) =>
              setStaff({ ...staff, PhoneNumber: e.target.value })
            }
            required
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteStaffDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteStaffDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {staff && (
            <span>
              Are you sure you want to delete <b>{staff.StaffName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
