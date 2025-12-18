import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState({
    StaffId: 0,
    StaffName: "",
    StaffImage: "",
    DateOfBirth: "",
    Gender: "",
    PhoneNumber: "",
    Address: "",
    Position: "",
    Salary: 0,
    Status: "",
    WorkStartDate: "",
    Description: "",
    Deleted: false,
  });
  const [staffDialog, setStaffDialog] = useState(false);
  const [deleteStaffDialog, setDeleteStaffDialog] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const toast = useRef(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchStaffs();
    }
  }, [token, lazyParams]);

  const fetchStaffs = () => {
    setLoading(true);
    const page = Math.floor(lazyParams.first / lazyParams.rows) + 1;

    axios
      .get("http://localhost:3000/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: lazyParams.rows,
        },
      })
      .then((response) => {
        console.log("Staff API Response:", response.data);
        // Backend returns { success: true, data: [...], pagination: {...} }
        if (response.data.success && response.data.data) {
          setStaffs(response.data.data);
          setTotalRecords(
            response.data.pagination?.total || response.data.data.length
          );
        } else {
          // Fallback for old format
          setStaffs(Array.isArray(response.data) ? response.data : []);
          setTotalRecords(response.data.length || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
        setStaffs([]); // Set empty array on error
        setTotalRecords(0);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching staff data",
          life: 3000,
        });
      });
  };

  const onPage = (event) => {
    setLazyParams({
      ...lazyParams,
      first: event.first,
      rows: event.rows,
    });
  };

  const openNew = () => {
    setStaff({
      StaffId: 0,
      StaffName: "",
      StaffImage: "",
      DateOfBirth: "",
      Gender: "",
      PhoneNumber: "",
      Address: "",
      Position: "",
      Salary: 0,
      Status: "",
      WorkStartDate: "",
      Description: "",
      Deleted: false,
    });
    setStaffDialog(true);
  };

  const hideDialog = () => setStaffDialog(false);
  const hideDeleteDialog = () => setDeleteStaffDialog(false);

  const validateStaff = () => {
    if (!staff.StaffName.trim() || !staff.PhoneNumber.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All fields are required",
        life: 3000,
      });
      return false;
    }
    if (!staff.DateOfBirth) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Date of Birth is required",
        life: 3000,
      });
      return false;
    }
    if (!staff.Gender) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Gender is required",
        life: 3000,
      });
      return false;
    }
    if (staff.Salary < 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Salary must be a positive number",
        life: 3000,
      });
      return false;
    }
    if (!staff.Address || !staff.Position) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Address and Position are required",
        life: 3000,
      });
      return false;
    }
    if (!staff.Status) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Status is required",
        life: 3000,
      });
      return false;
    }
    if (!staff.WorkStartDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Work Start Date is required",
        life: 3000,
      });
      return false;
    }
    if (!staff.Description) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Description is required",
        life: 3000,
      });
      return false;
    }
    if (!staff.StaffImage) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Staff Image is required",
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

  const saveStaff = () => {
    if (!validateStaff()) return;

    const staffData = {
      StaffName: staff.StaffName,
      StaffImage: staff.StaffImage,
      DateOfBirth: formatDateToMySQL(staff.DateOfBirth),
      Gender: staff.Gender,
      PhoneNumber: staff.PhoneNumber,
      Address: staff.Address,
      Position: staff.Position,
      Salary: staff.Salary,
      Status: staff.Status,
      WorkStartDate: formatDateToMySQL(staff.WorkStartDate),
      Description: staff.Description,
    };

    if (staff.StaffId === 0) {
      console.log("Creating new staff: ", staffData);
      axios
        .post("http://localhost:3000/api/staff", staffData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Create response:", response.data);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: response.data.message || "Staff Created",
            life: 3000,
          });
          fetchStaffs();
          setStaffDialog(false);
        })
        .catch((error) => {
          console.error("Create error:", error.response?.data || error.message);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error creating staff",
            life: 3000,
          });
        });
    } else {
      console.log("Updating staff: ", staffData);
      axios
        .put(`http://localhost:3000/api/staff/${staff.StaffId}`, staffData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Update response:", response.data);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: response.data.message || "Staff Updated",
            life: 3000,
          });
          fetchStaffs();
          setStaffDialog(false);
        })
        .catch((error) => {
          console.error("Update error:", error.response?.data || error.message);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error updating staff",
            life: 3000,
          });
        });
    }
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
      .delete(`http://localhost:3000/api/staff/${staff.StaffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Delete response:", response.data);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message || "Staff Deleted",
          life: 3000,
        });
        fetchStaffs();
        setDeleteStaffDialog(false);
      })
      .catch((error) => {
        console.error("Delete error:", error.response?.data || error.message);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Error deleting staff",
          life: 3000,
        });
      });
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
        "https://script.google.com/macros/s/AKfycbzYlB7UiHskVI1KTDP3LlomXXG548qwdVdVyoUXgW_j8_RmW_7xAV_5u-_hjUox1bYA/exec",
        {
          method: "POST",
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      console.log("API Response When Upload Image:", data);
      if (data.link) {
        setStaff((prev) => ({ ...prev, StaffImage: data.link }));
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
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Staff Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="StaffId" header="ID" sortable />
        <Column field="StaffName" header="Name" sortable />
        <Column
          field="StaffImage"
          header="Image"
          body={(rowData) => (
            <img
              src={rowData.StaffImage}
              alt="Staff"
              style={{ width: "50px", height: "50px", borderRadius: "5px" }}
              referrerpolicy="no-referrer"
            />
          )}
          sortable
        />
        <Column field="PhoneNumber" header="Phone Number" sortable />
        <Column
          field="DateOfBirth"
          header="Date of Birth"
          sortable
          body={(rowData) => new Date(rowData.DateOfBirth).toLocaleDateString()}
        />
        <Column field="Gender" header="Gender" sortable />
        <Column field="Address" header="Address" sortable />
        <Column field="Position" header="Position" sortable />
        <Column
          field="Salary"
          header="Salary"
          sortable
          body={(rowData) => `$${parseInt(rowData.Salary)}`}
        />
        <Column
          field="WorkStartDate"
          header="Work Start Date"
          sortable
          body={(rowData) =>
            new Date(rowData.WorkStartDate).toLocaleDateString()
          }
        />
        <Column field="Description" header="Description" sortable />
        <Column field="Status" header="Status" sortable />
        {/* <Column
          field="Deleted"
          header="Deleted"
          sortable
          body={(rowData) => (rowData.Deleted ? "Deleted" : "Active")}
        /> */}
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
            placeholder="Please enter a staff name"
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
            placeholder="Please enter a phone number"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="DateOfBirth">Date of Birth</label>
          <Calendar
            id="DateOfBirth"
            dateFormat="yy-mm-dd"
            value={staff.DateOfBirth ? new Date(staff.DateOfBirth) : null}
            onChange={(e) => setStaff({ ...staff, DateOfBirth: e.value })}
            required
            placeholder="Please select a date of birth"
          />
        </div>
        <div className="field">
          <label htmlFor="Gender">Gender</label>
          <Dropdown
            id="Gender"
            value={staff.Gender}
            options={["Male", "Female", "Other"]}
            onChange={(e) => setStaff({ ...staff, Gender: e.value })}
            placeholder="Select Gender"
          />
        </div>
        <div className="field">
          <label htmlFor="Address">Address</label>
          <InputText
            id="Address"
            value={staff.Address}
            onChange={(e) => setStaff({ ...staff, Address: e.target.value })}
            placeholder="Please enter an address"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Position">Position</label>
          <Dropdown
            id="Position"
            value={staff.Position}
            options={["Receptionist", "Waiter", "Bartender"]}
            onChange={(e) => setStaff({ ...staff, Position: e.value })}
            placeholder="Select Position"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Salary">Salary</label>
          <InputNumber
            id="Salary"
            value={staff.Salary}
            onValueChange={(e) => setStaff({ ...staff, Salary: e.value })}
            placeholder="Please enter a salary"
            showButtons
          />
        </div>
        <div className="field">
          <label htmlFor="Status">Status</label>
          <Dropdown
            id="Status"
            value={staff.Status}
            options={["Online", "Offline"]}
            onChange={(e) => setStaff({ ...staff, Status: e.value })}
            placeholder="Select Status"
          />
        </div>
        <div className="field">
          <label htmlFor="WorkStartDate">Work Start Date</label>
          <Calendar
            id="WorkStartDate"
            dateFormat="yy-mm-dd"
            value={staff.WorkStartDate ? new Date(staff.WorkStartDate) : null}
            onChange={(e) => setStaff({ ...staff, WorkStartDate: e.value })}
            required
            placeholder="Please select a work start date"
          />
        </div>
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputTextarea
            id="Description"
            value={staff.Description}
            onChange={(e) =>
              setStaff({ ...staff, Description: e.target.value })
            }
            rows={3}
            placeholder="Please enter a description"
          />
        </div>
        <div className="p-field">
          <label htmlFor="StaffImage">Staff Image</label>
          <img
            src={
              staff.StaffImage && staff.StaffImage !== "null"
                ? staff.StaffImage
                : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
            }
            alt="Staff"
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
            name="StaffImage"
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
