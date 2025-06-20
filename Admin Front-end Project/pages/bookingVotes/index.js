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

export default function BookingVotes() {
  const [votes, setVotes] = useState([]);
  const [vote, setVote] = useState({
    BookingVotesId: 0,
    UserId: 0,
    BookingDate: "",
    CheckinDate: "",
    CheckoutDate: "",
    Note: "",
    TotalAmount: 0,
    Status: "",
    Deleted: false,
    listBookingVotesDetails: [],
  });
  const [voteDialog, setVoteDialog] = useState(false);
  const [deleteVoteDialog, setDeleteVoteDialog] = useState(false);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState([]);
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchVotes();
    fetchUsers();
  }, []);

  const fetchVotes = () => {
    axios
      .get(`http://localhost:3000/api/booking-votes/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVotes(res.data))
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

  const openNew = () => {
    setVote({
      BookingVotesId: 0,
      UserId: 0,
      BookingDate: "",
      CheckinDate: "",
      CheckoutDate: "",
      Note: "",
      TotalAmount: 0,
      Status: "",
      Deleted: false,
      listBookingVotesDetails: [],
    });
    setVoteDialog(true);
  };

  const hideDialog = () => setVoteDialog(false);
  const hideDeleteDialog = () => setDeleteVoteDialog(false);
  const hideViewDetailsDialog = () => setViewDetailsDialog(false);

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const safeTrim = (value) => (typeof value === "string" ? value.trim() : "");

  const validateBookingVotes = () => {
    if (!vote.UserId || vote.UserId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User ID is required",
        life: 3000,
      });
      return false;
    }
    if (!vote.BookingDate || !vote.CheckinDate || !vote.CheckoutDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill out all required date fields",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const saveVote = () => {
    if (!validateBookingVotes()) {
      return;
    }

    if (vote.BookingVotesId === 0) {
      console.log("Creating a new vote... ", vote);
      vote.BookingDate = formatDateToMySQL(vote.BookingDate);
      vote.CheckinDate = formatDateToMySQL(vote.CheckinDate);
      vote.CheckoutDate = formatDateToMySQL(vote.CheckoutDate);
      axios
        .post(`http://localhost:3000/api/booking-votes/create`, vote, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Vote Created",
            life: 3000,
          });
        });
    } else {
      console.log("Updating a new vote... ", vote);
      vote.BookingDate = formatDateToMySQL(vote.BookingDate);
      vote.CheckinDate = formatDateToMySQL(vote.CheckinDate);
      vote.CheckoutDate = formatDateToMySQL(vote.CheckoutDate);
      vote.Deleted = false;
      vote.listBookingVotesDetails = [];
      axios
        .put(`http://localhost:3000/api/booking-votes/update`, vote, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Vote Updated",
            life: 3000,
          });
        });
    }
    setVoteDialog(false);
  };

  const editVote = (rowData) => {
    setVote({
      ...rowData,
      BookingDate: new Date(rowData.BookingDate),
      CheckinDate: new Date(rowData.CheckinDate),
      CheckoutDate: new Date(rowData.CheckoutDate),
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
        `http://localhost:3000/api/booking-votes/delete/${vote.BookingVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchVotes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Vote Deleted",
          life: 3000,
        });
      });
    setDeleteVoteDialog(false);
  };

  const deleteSelectedVotes = () => {
    const idsToDelete = selectedVotes.map((item) => item.VoteId);
    axios
      .post(
        `http://localhost:3000/api/booking-vote/delete-multiple`,
        idsToDelete,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchVotes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Votes Deleted",
          life: 3000,
        });
      });
  };

  const onUserChange = (e) => {
    setVote({ ...vote, UserId: e.value });
  };

  const onStatusChange = (e) => {
    setVote({ ...vote, Status: e.value });
  };

  const viewVoteDetails = async (rowData) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/booking-votes-detail/get-data-by-id/${rowData.BookingVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVote({
        ...res.data,
        BookingDate: new Date(res.data.BookingDate),
        CheckinDate: new Date(res.data.CheckinDate),
        CheckoutDate: new Date(res.data.CheckoutDate),
        listBookingVotesDetails: res.data,
      });
      setViewDetailsDialog(true);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Cannot fetch booking vote details",
        life: 3000,
      });
    }
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

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info"
        onClick={() => viewVoteDetails(rowData)}
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success"
        onClick={() => editVote(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteVote(rowData)}
      />
    </div>
  );

  const voteDialogFooter = (
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
        onClick={saveVote}
      />
    </div>
  );

  const deleteVoteDialogFooter = (
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
        onClick={deleteVote}
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
        value={votes}
        selection={selectedVotes}
        onSelectionChange={(e) => setSelectedVotes(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Booking Votes Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="BookingVotesId" header="Booking Votes ID" sortable />
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
          field="BookingDate"
          header="Booking Date"
          sortable
          body={(rowData) => {
            return rowData.BookingDate.split("T")[0];
          }}
        />
        <Column
          field="CheckinDate"
          header="Check-in Date"
          sortable
          body={(rowData) => {
            return rowData.CheckinDate.split("T")[0];
          }}
        />
        <Column
          field="CheckoutDate"
          header="Check-out Date"
          sortable
          body={(rowData) => {
            return rowData.CheckoutDate.split("T")[0];
          }}
        />
        <Column field="Note" header="Note" sortable />
        <Column
          field="TotalAmount"
          header="TotalAmount"
          sortable
          body={(rowData) => {
            return `$ ${parseInt(rowData.TotalAmount)}`;
          }}
        />
        <Column field="Status" header="Status" sortable />
        <Column field="Deleted" header="Deleted" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* View Details Dialog */}
      <Dialog
        visible={viewDetailsDialog}
        style={{ width: "600px" }}
        header="Booking Vote Details"
        modal
        className="p-fluid"
        onHide={hideViewDetailsDialog}
      >
        <div className="grid">
          {vote.listBookingVotesDetails &&
            vote.listBookingVotesDetails.length > 0 && (
              <div className="col-12">
                <DataTable
                  value={vote.listBookingVotesDetails}
                  className="mt-2"
                >
                  <Column
                    field="BookingVotesDetailId"
                    header="Booking Votes Detail Id"
                  />
                  <Column field="BookingVotesId" header="Booking Votes Id" />
                  <Column field="RoomId" header="Room ID" />
                  <Column
                    field="RoomPrice"
                    header="Room Price"
                    body={(rowData) => `$ ${rowData.RoomPrice}`}
                  />
                  <Column field="Note" header="Note" />
                </DataTable>
              </div>
            )}
        </div>
      </Dialog>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={voteDialog}
        style={{ width: "450px" }}
        header="Vote Details"
        modal
        className="p-fluid"
        footer={voteDialogFooter}
        onHide={hideDialog}
      >
        {/* User */}
        <div className="field">
          <label htmlFor="UserId">User</label>
          <Dropdown
            id="UserId"
            value={vote.UserId}
            options={users}
            optionLabel="UserId"
            optionValue="UserId"
            onChange={onUserChange}
            placeholder="Select User"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="BookingDate">Booking Date</label>
          <Calendar
            id="BookingDate"
            value={vote.BookingDate}
            onChange={(e) => setVote({ ...vote, BookingDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Please choose a booking date"
          />
        </div>
        <div className="field">
          <label htmlFor="CheckinDate">Check-in Date</label>
          <Calendar
            id="CheckinDate"
            value={vote.CheckinDate}
            onChange={(e) => setVote({ ...vote, CheckinDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Please choose a checkin date"
          />
        </div>
        <div className="field">
          <label htmlFor="CheckoutDate">Check-out Date</label>
          <Calendar
            id="CheckoutDate"
            value={vote.CheckoutDate}
            onChange={(e) => setVote({ ...vote, CheckoutDate: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            required
            placeholder="Please choose a checkout date"
          />
        </div>
        <div className="field">
          <label htmlFor="Note">Note</label>
          <InputText
            id="Note"
            value={vote.Note}
            onChange={(e) => setVote({ ...vote, Note: e.target.value })}
            required
            placeholder="Please enter a note"
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
            options={["Unpaid", "Paid"]}
            onChange={onStatusChange}
            placeholder="Select Status"
            required
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteVoteDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteVoteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {vote && (
            <span>
              Are you sure you want to delete <b>{vote.BookingVotesId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
