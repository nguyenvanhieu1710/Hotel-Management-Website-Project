import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import axios from "axios";

export default function RentRoomVotes() {
  const [votes, setVotes] = useState([]);
  const [vote, setVote] = useState({
    RentRoomVotesId: 0,
    UserId: 0,
    ActualCheckinDate: "",
    ActualCheckoutDate: "",
    TotalAmount: 0,
    Status: "Pending",
    Note: "",
    Deleted: false,
  });
  const [voteDialog, setVoteDialog] = useState(false);
  const [deleteVoteDialog, setDeleteVoteDialog] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState(null);
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
      fetchVotes();
    }
  }, [lazyParams, token]);

  const fetchVotes = () => {
    setLoading(true);
    const { page, rows } = lazyParams;

    console.log("Fetching rent room votes with params:", { page, limit: rows });

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
      .get(`http://localhost:3000/api/rent-room-votes`, {
        params: { page, limit: rows },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Rent room votes response:", res.data);
        if (res.data.success) {
          setVotes(res.data.data || []);
          setTotalRecords(res.data.pagination?.total || 0);
        } else {
          setVotes([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching rent room votes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch rent room votes",
          life: 3000,
        });
        setVotes([]);
        setTotalRecords(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    console.log("Fetching users for rent room votes");

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
    setVote({
      RentRoomVotesId: 0,
      UserId: 0,
      ActualCheckinDate: "",
      ActualCheckoutDate: "",
      TotalAmount: 0,
      Status: "Pending",
      Note: "",
      Deleted: false,
    });
    setVoteDialog(true);
  };

  const hideDialog = () => setVoteDialog(false);
  const hideDeleteDialog = () => setDeleteVoteDialog(false);

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const validateRentRoomVotes = () => {
    if (!vote.UserId || vote.UserId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User ID is required",
        life: 3000,
      });
      return false;
    }
    if (!vote.ActualCheckinDate || !vote.ActualCheckoutDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill out all required date fields",
        life: 3000,
      });
      return false;
    }

    // Validate dates
    const checkinDate = new Date(vote.ActualCheckinDate);
    const checkoutDate = new Date(vote.ActualCheckoutDate);

    if (checkoutDate < checkinDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Check-out date must be on or after check-in date",
        life: 3000,
      });
      return false;
    }

    if (!vote.TotalAmount || vote.TotalAmount <= 0) {
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

  const saveVote = () => {
    if (!validateRentRoomVotes()) {
      return;
    }

    const voteData = {
      ...vote,
      ActualCheckinDate: formatDateToMySQL(vote.ActualCheckinDate),
      ActualCheckoutDate: formatDateToMySQL(vote.ActualCheckoutDate),
    };

    // Filter out fields that don't belong to RentRoomVotes table
    const rentRoomVotesFields = {
      UserId: voteData.UserId,
      ActualCheckinDate: voteData.ActualCheckinDate,
      ActualCheckoutDate: voteData.ActualCheckoutDate,
      TotalAmount: voteData.TotalAmount,
      Status: voteData.Status,
      Note: voteData.Note,
    };

    if (vote.RentRoomVotesId === 0) {
      console.log("Creating rent room vote:", rentRoomVotesFields);
      axios
        .post(
          `http://localhost:3000/api/rent-room-votes`,
          rentRoomVotesFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Rent Room Vote Created",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error creating rent room vote:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create rent room vote",
            life: 3000,
          });
        });
    } else {
      console.log("Updating rent room vote:", {
        RentRoomVotesId: vote.RentRoomVotesId,
        ...rentRoomVotesFields,
      });
      axios
        .put(
          `http://localhost:3000/api/rent-room-votes/${vote.RentRoomVotesId}`,
          rentRoomVotesFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Rent Room Vote Updated",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error updating rent room vote:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update rent room vote",
            life: 3000,
          });
        });
    }
    setVoteDialog(false);
  };

  const editVote = (rowData) => {
    setVote({
      ...rowData,
      ActualCheckinDate: new Date(rowData.ActualCheckinDate),
      ActualCheckoutDate: new Date(rowData.ActualCheckoutDate),
    });
    setVoteDialog(true);
  };

  const confirmDeleteVote = (rowData) => {
    setVote(rowData);
    setDeleteVoteDialog(true);
  };

  const deleteVote = () => {
    axios
      .delete(
        `http://localhost:3000/api/rent-room-votes/${vote.RentRoomVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchVotes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Rent Room Vote Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting rent room vote:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete rent room vote",
          life: 3000,
        });
      });
    setDeleteVoteDialog(false);
  };

  const deleteSelectedVotes = () => {
    if (!selectedVotes || selectedVotes.length === 0) return;

    const deletePromises = selectedVotes.map((item) =>
      axios.delete(
        `http://localhost:3000/api/rent-room-votes/${item.RentRoomVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchVotes();
        setSelectedVotes(null);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Rent Room Votes Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting selected rent room votes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete selected rent room votes",
          life: 3000,
        });
      });
  };

  const onUserChange = (e) => {
    setVote({ ...vote, UserId: e.value });
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
        onClick={deleteSelectedVotes}
        disabled={!selectedVotes || !selectedVotes.length}
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

  // Action buttons
  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
        onClick={() => editVote(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteVote(rowData)}
      />
    </>
  );

  return (
    <div className="container">
      <Toast ref={toast} />

      <Toolbar
        className="mb-4"
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />

      <DataTable
        value={votes}
        selection={selectedVotes}
        onSelectionChange={(e) => setSelectedVotes(e.value)}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Rent Room Votes Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="RentRoomVotesId" header="Rent Room Vote ID" sortable />
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
          field="ActualCheckinDate"
          header="Actual Check-in Date"
          sortable
          body={(rowData) => {
            return (
              rowData.ActualCheckinDate?.split("T")[0] ||
              rowData.ActualCheckinDate
            );
          }}
        />
        <Column
          field="ActualCheckoutDate"
          header="Actual Check-out Date"
          sortable
          body={(rowData) => {
            return (
              rowData.ActualCheckoutDate?.split("T")[0] ||
              rowData.ActualCheckoutDate
            );
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

        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={voteDialog}
        style={{ width: "450px" }}
        header="Vote Details"
        modal
        className="p-fluid"
        footer={
          <>
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
              onClick={saveVote}
            />
          </>
        }
        onHide={hideDialog}
      >
        {/* User */}
        <div className="field">
          <label htmlFor="UserId">User</label>
          <Dropdown
            id="UserId"
            value={vote.UserId}
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
          <label htmlFor="ActualCheckinDate">Actual Check-in Date</label>
          <Calendar
            id="ActualCheckinDate"
            value={vote.ActualCheckinDate}
            onChange={(e) => setVote({ ...vote, ActualCheckinDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Please select a checkin date"
          />
        </div>
        <div className="field">
          <label htmlFor="ActualCheckoutDate">Actual Check-out Date</label>
          <Calendar
            id="ActualCheckoutDate"
            value={vote.ActualCheckoutDate}
            onChange={(e) => setVote({ ...vote, ActualCheckoutDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Please choose a checkout date"
          />
        </div>
        <div className="field">
          <label htmlFor="TotalAmount">Total Amount</label>
          <InputNumber
            id="TotalAmount"
            value={vote.TotalAmount}
            onChange={(e) => setVote({ ...vote, TotalAmount: e.value })}
            placeholder="Enter total amount"
            required
            showButtons
          />
        </div>
        <div className="field">
          <label htmlFor="Status">Status</label>
          <Dropdown
            id="Status"
            value={vote.Status}
            options={[
              "Pending",
              "Confirmed",
              "Checked-in",
              "In-house",
              "Checked-out",
              "Cancelled",
              "Paid",
              "Unpaid",
            ]}
            onChange={(e) => setVote({ ...vote, Status: e.value })}
            placeholder="Select Status"
          />
        </div>
        <div className="field">
          <label htmlFor="Note">Note</label>
          <InputText
            id="Note"
            value={vote.Note}
            onChange={(e) => setVote({ ...vote, Note: e.target.value })}
            placeholder="Enter additional notes"
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteVoteDialog}
        style={{ width: "450px" }}
        header="Xác Nhận"
        modal
        footer={
          <>
            <Button
              label="Không"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideDeleteDialog}
            />
            <Button
              label="Có"
              icon="pi pi-check"
              className="p-button-text"
              onClick={deleteVote}
            />
          </>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            Are you sure you want to delete <b>{vote.RentRoomVotesId}</b>?
          </span>
        </div>
      </Dialog>
    </div>
  );
}
