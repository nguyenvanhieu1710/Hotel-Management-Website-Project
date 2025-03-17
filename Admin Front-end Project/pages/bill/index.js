import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Bill() {
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState({
    BillId: 0,
    UserId: 0,
    TotalAmount: 0,
    DateCreated: "",
    Description: "",
    Deleted: false,
  });
  const [billDialog, setBillDialog] = useState(false);
  const [deleteBillDialog, setDeleteBillDialog] = useState(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = () => {
    axios
      .get(`http://localhost:3000/api/bill/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBills(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setBill({
      BillId: 0,
      UserId: 0,
      TotalAmount: 0,
      DateCreated: "",
      Description: "",
      Deleted: false,
    });
    setBillDialog(true);
  };

  const hideDialog = () => setBillDialog(false);
  const hideDeleteDialog = () => setDeleteBillDialog(false);

  const saveBill = () => {
    if (!bill.UserId || !bill.TotalAmount || !bill.DateCreated) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill out all required fields",
        life: 3000,
      });
      return;
    }

    if (bill.BillId === 0) {
      axios
        .post(`http://localhost:3000/api/bill/create`, bill, {
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
        });
    } else {
      axios
        .put(`http://localhost:3000/api/bill/update/${bill.BillId}`, bill, {
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
        });
    }
    setBillDialog(false);
  };

  const editBill = (rowData) => {
    setBill({ ...rowData });
    setBillDialog(true);
  };

  const confirmDeleteBill = (rowData) => {
    setBill(rowData);
    setDeleteBillDialog(true);
  };

  const deleteBill = () => {
    axios
      .delete(`http://localhost:3000/api/bill/delete/${bill.BillId}`, {
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
        <Column field="BillId" header="ID" sortable />
        <Column field="UserId" header="User ID" sortable />
        <Column field="TotalAmount" header="Total Amount" sortable />
        <Column field="DateCreated" header="Date Created" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Thêm/Sửa */}
      <Dialog
        visible={billDialog}
        style={{ width: "450px" }}
        header="Bill Details"
        modal
        className="p-fluid"
        footer={billDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="UserId">User ID</label>
          <InputText
            id="UserId"
            value={bill.UserId}
            onChange={(e) => setBill({ ...bill, UserId: e.target.value })}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="TotalAmount">Total Amount</label>
          <InputText
            id="TotalAmount"
            value={bill.TotalAmount}
            onChange={(e) => setBill({ ...bill, TotalAmount: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="DateCreated">Date Created</label>
          <InputText
            id="DateCreated"
            value={bill.DateCreated}
            onChange={(e) => setBill({ ...bill, DateCreated: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputText
            id="Description"
            value={bill.Description}
            onChange={(e) => setBill({ ...bill, Description: e.target.value })}
          />
        </div>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
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
