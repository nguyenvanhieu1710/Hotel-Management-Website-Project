import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Bill() {
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState({
    BillId: 0,
    UserId: 0,
    CreationDate: "",
    TotalAmount: 0,
    Status: "",
    Note: "",
    Deleted: false,
  });
  const [billDialog, setBillDialog] = useState(false);
  const [deleteBillDialog, setDeleteBillDialog] = useState(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchBills();
    fetchUsers();
  }, []);

  const fetchBills = () => {
    axios
      .get(`http://localhost:3000/api/bill`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBills(res.data))
      .catch((err) => console.error(err));
  };

  const fetchUsers = () => {
    axios
      .get(`http://localhost:3000/api/user/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  // const fetchStaffs = () => {
  //   axios
  //     .get(`http://localhost:3000/api/staff/get-all`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => setStaffs(res.data))
  //     .catch((err) => console.error(err));
  // };

  const openNew = () => {
    setBill({
      BillId: 0,
      UserId: 0,
      CreationDate: "",
      TotalAmount: 0,
      Status: "",
      Note: "",
      Deleted: false,
    });
    setBillDialog(true);
  };

  const hideDialog = () => setBillDialog(false);
  const hideDeleteDialog = () => setDeleteBillDialog(false);

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const validateBill = () => {
    if (!bill.UserId || bill.UserId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User ID is required",
        life: 3000,
      });
      return false;
    }
    if (!bill.CreationDate || !bill.Status) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Creation Date and Status are required",
        life: 3000,
      });
      return false;
    }
    if (bill.TotalAmount <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Total Amount must be greater than 0",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const saveBill = () => {
    if (!validateBill()) return;

    if (bill.BillId === 0) {
      bill.CreationDate = new Date();
      bill.CreationDate = formatDateToMySQL(bill.CreationDate);
      bill.Deleted = false;
      console.log("Creating a new bill: ", bill);
      axios
        .post(`http://localhost:3000/api/bill`, bill, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchBills();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Bill Created",
            life: 3000,
          });
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error creating bill",
            life: 3000,
          });
        });
    } else {
      console.log("Updating bill: ", bill);
      bill.CreationDate = formatDateToMySQL(bill.CreationDate);
      bill.Deleted = false;
      axios
        .put(`http://localhost:3000/api/bill/${bill.BillId}`, bill, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchBills();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Bill Updated",
            life: 3000,
          });
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error updating bill",
            life: 3000,
          });
        });
    }
    setBillDialog(false);
  };

  const editBill = (rowData) => {
    setBill({ ...rowData, CreationDate: new Date(rowData.CreationDate) });
    setBillDialog(true);
  };

  const confirmDeleteBill = (rowData) => {
    setBill(rowData);
    setDeleteBillDialog(true);
  };

  const deleteBill = () => {
    axios
      .delete(`http://localhost:3000/api/bill/${bill.BillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchBills();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Bill Deleted",
          life: 3000,
        });
      });
    setDeleteBillDialog(false);
  };

  const deleteSelectedBills = () => {
    const idsToDelete = selectedBills.map((item) => item.BillId);
    axios
      .post(`http://localhost:3000/api/bill/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchBills();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Bills Deleted",
          life: 3000,
        });
      });
  };

  const onUserChange = (e) => {
    setBill({ ...bill, UserId: e.value });
  };

  const onStaffChange = (e) => {
    setBill({ ...bill, StaffId: e.value });
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
        onClick={deleteSelectedBills}
        disabled={!selectedBills || !selectedBills.length}
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
        onClick={() => editBill(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteBill(rowData)}
      />
    </div>
  );

  const billDialogFooter = (
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
        onClick={saveBill}
      />
    </div>
  );

  const deleteBillDialogFooter = (
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
        onClick={deleteBill}
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
        value={bills}
        selection={selectedBills}
        onSelectionChange={(e) => setSelectedBills(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Bill Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="BillId" header="Bill ID" sortable />
        <Column
          field="UserId"
          header="User ID"
          sortable
          body={(rowData) => {
            const user = users.find((user) => user.UserId === rowData.UserId);
            return user ? user.UserName : "Unknown User";
          }}
        />
        <Column
          field="CreationDate"
          header="Creation Date"
          sortable
          body={(rowData) => {
            const date = new Date(rowData.CreationDate);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }}
        />
        <Column
          field="TotalAmount"
          header="Total Amount"
          sortable
          body={(rowData) => {
            return `$ ${parseInt(rowData.TotalAmount)}`;
          }}
        />
        <Column field="Status" header="Status" sortable />
        <Column field="Note" header="Note" sortable />
        <Column field="Deleted" header="Deleted" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={billDialog}
        style={{ width: "450px" }}
        header="Bill Details"
        modal
        className="p-fluid"
        footer={billDialogFooter}
        onHide={hideDialog}
      >
        {/* User */}
        <div className="field">
          <label htmlFor="UserId">User</label>
          <Dropdown
            id="UserId"
            value={bill.UserId}
            options={users}
            optionLabel="UserId"
            optionValue="UserId"
            onChange={onUserChange}
            placeholder="Select User"
            className={errors.UserId ? "p-invalid" : ""}
            required
          />
          {errors.UserId && <small className="p-error">{errors.UserId}</small>}
        </div>

        <div className="field">
          <label htmlFor="TotalAmount">Total Amount</label>
          <InputNumber
            id="TotalAmount"
            value={bill.TotalAmount}
            onChange={(e) =>
              setBill({ ...bill, TotalAmount: Number(e.value) || 0 })
            }
            mode="decimal"
            required
            placeholder="Please enter total amount"
            showButtons
          />
        </div>
        <div className="field">
          <label htmlFor="CreationDate">Creation Date</label>
          <Calendar
            id="CreationDate"
            value={bill.CreationDate}
            onChange={(e) => setBill({ ...bill, CreationDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            className={errors.CreationDate ? "p-invalid" : ""}
            required
            placeholder="Please enter a creation date"
          />
        </div>
        <div className="field">
          <label htmlFor="Status">Status</label>
          <Dropdown
            id="Status"
            value={bill.Status}
            options={["Unpaid", "Paid"]}
            onChange={(e) => setBill({ ...bill, Status: e.value })}
            placeholder="Select Status"
          />
        </div>

        <div className="field">
          <label htmlFor="Note">Note</label>
          <InputText
            id="Note"
            value={bill.Note}
            onChange={(e) => setBill({ ...bill, Note: e.target.value })}
            required
            placeholder="Please enter a note"
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteBillDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteBillDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {bill && (
            <span>
              Are you sure you want to delete <b>{bill.BillId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
