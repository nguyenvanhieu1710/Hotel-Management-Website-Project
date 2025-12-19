import { useState, useEffect, useRef } from "react";
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
    Status: "Unpaid",
    Note: "",
    Deleted: false,
  });
  const [billDialog, setBillDialog] = useState(false);
  const [deleteBillDialog, setDeleteBillDialog] = useState(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [token, setToken] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBills();
    }
  }, [lazyParams, token]);

  const fetchBills = () => {
    setLoading(true);
    const { page, rows } = lazyParams;

    console.log("Fetching bills with params:", { page, limit: rows });

    if (!token) {
      console.error("No authentication token available");
      toast.current.show({
        severity: "error",
        summary: "Authentication Error",
        detail: "Please login to access this page",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3000/api/bill`, {
        params: { page, limit: rows },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Bills response:", res.data);
        if (res.data.success) {
          setBills(res.data.data || []);
          setTotalRecords(res.data.pagination?.total || 0);
        } else {
          setBills([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching bills:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch bills",
          life: 3000,
        });
        setBills([]);
        setTotalRecords(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    console.log("Fetching users for bills");

    if (!token) {
      console.error("No authentication token available for users");
      return;
    }

    axios
      .get(`http://localhost:3000/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Users response:", res.data);
        if (res.data.success) {
          setUsers(res.data.data || []);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  };

  const onPage = (event) => {
    const newLazyParams = {
      ...lazyParams,
      first: event.first,
      rows: event.rows,
      page: Math.floor(event.first / event.rows) + 1,
    };
    setLazyParams(newLazyParams);
  };

  const openNew = () => {
    setBill({
      BillId: 0,
      UserId: 0,
      CreationDate: "",
      TotalAmount: 0,
      Status: "Unpaid",
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
    if (!bill.CreationDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Creation Date is required",
        life: 3000,
      });
      return false;
    }
    if (!bill.TotalAmount || bill.TotalAmount <= 0) {
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

    const billData = {
      ...bill,
      CreationDate: formatDateToMySQL(bill.CreationDate),
    };

    // Filter out fields that don't belong to Bill table
    const billFields = {
      UserId: billData.UserId,
      CreationDate: billData.CreationDate,
      TotalAmount: billData.TotalAmount,
      Status: billData.Status,
      Note: billData.Note,
    };

    if (bill.BillId === 0) {
      console.log("Creating bill:", billFields);
      axios
        .post(`http://localhost:3000/api/bill`, billFields, {
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
        .catch((err) => {
          console.error("Error creating bill:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create bill",
            life: 3000,
          });
        });
    } else {
      console.log("Updating bill:", { BillId: bill.BillId, ...billFields });
      axios
        .put(`http://localhost:3000/api/bill/${bill.BillId}`, billFields, {
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
        .catch((err) => {
          console.error("Error updating bill:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update bill",
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
      })
      .catch((err) => {
        console.error("Error deleting bill:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete bill",
          life: 3000,
        });
      });
    setDeleteBillDialog(false);
  };

  const deleteSelectedBills = () => {
    if (!selectedBills || selectedBills.length === 0) return;

    const deletePromises = selectedBills.map((item) =>
      axios.delete(`http://localhost:3000/api/bill/${item.BillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchBills();
        setSelectedBills(null);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Bills Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting selected bills:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete selected bills",
          life: 3000,
        });
      });
  };

  const onUserChange = (e) => {
    setBill({ ...bill, UserId: e.value });
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
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />

      <DataTable
        value={bills}
        selection={selectedBills}
        onSelectionChange={(e) => setSelectedBills(e.value)}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Bill Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="BillId" header="Bill ID" sortable />
        <Column
          field="UserId"
          header="User"
          sortable
          body={(rowData) => {
            const user = users.find((user) => user.UserId === rowData.UserId);
            return user
              ? `${user.UserName} (ID: ${rowData.UserId})`
              : `User ID: ${rowData.UserId}`;
          }}
        />
        <Column
          field="CreationDate"
          header="Creation Date"
          sortable
          body={(rowData) => {
            return rowData.CreationDate?.split("T")[0] || rowData.CreationDate;
          }}
        />
        <Column
          field="TotalAmount"
          header="Total Amount"
          sortable
          body={(rowData) => {
            return `$ ${parseFloat(rowData.TotalAmount || 0).toFixed(2)}`;
          }}
        />
        <Column field="Status" header="Status" sortable />
        <Column field="Note" header="Note" sortable />
        {/* <Column field="Deleted" header="Deleted" sortable /> */}
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
            options={users.map((user) => ({
              label: `${user.UserName} (ID: ${user.UserId})`,
              value: user.UserId,
            }))}
            onChange={onUserChange}
            placeholder="Select User"
            required
          />
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
            required
            placeholder="Please enter a creation date"
          />
        </div>
        <div className="field">
          <label htmlFor="Status">Status</label>
          <Dropdown
            id="Status"
            value={bill.Status}
            options={["Unpaid", "Paid", "Pending", "Cancelled"]}
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
