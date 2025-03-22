import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
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
    Deleted: false,
  });
  const [voteDialog, setVoteDialog] = useState(false);
  const [deleteVoteDialog, setDeleteVoteDialog] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = () => {
    axios
      .get(`http://localhost:3000/api/booking-votes/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVotes(res.data))
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
    const bookingDate = safeTrim(vote.BookingDate);
    const checkinDate = safeTrim(vote.CheckinDate);
    const checkoutDate = safeTrim(vote.CheckoutDate);

    if (!bookingDate || !checkinDate || !checkoutDate) {
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
    setVote({ ...rowData });
    setVoteDialog(true);
  };

  const confirmDeleteVote = (rowData) => {
    setVote(rowData);
    setDeleteVoteDialog(true);
  };

  const deleteVote = () => {
    axios
      .delete(`http://localhost:3000/api/booking-vote/delete/${vote.VoteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        <Column field="UserId" header="User ID" sortable />
        <Column field="BookingDate" header="Booking Date" sortable />
        <Column field="CheckinDate" header="Check-in Date" sortable />
        <Column field="CheckoutDate" header="Check-out Date" sortable />
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
        visible={voteDialog}
        style={{ width: "450px" }}
        header="Vote Details"
        modal
        className="p-fluid"
        footer={voteDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="UserId">User ID</label>
          <InputNumber
            id="UserId"
            value={vote.UserId}
            onChange={(e) => setVote({ ...vote, UserId: e.value })}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="BookingDate">Booking Date</label>
          <InputText
            id="BookingDate"
            value={vote.BookingDate}
            onChange={(e) => setVote({ ...vote, BookingDate: e.target.value })}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="CheckinDate">Check-in Date</label>
          <InputText
            id="CheckinDate"
            value={vote.CheckinDate}
            onChange={(e) => setVote({ ...vote, CheckinDate: e.target.value })}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="CheckoutDate">Check-out Date</label>
          <InputText
            id="CheckoutDate"
            value={vote.CheckoutDate}
            onChange={(e) => setVote({ ...vote, CheckoutDate: e.target.value })}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Note">Note</label>
          <InputText
            id="Note"
            value={vote.Note}
            onChange={(e) => setVote({ ...vote, Note: e.target.value })}
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
              Are you sure you want to delete <b>{vote.VoteId}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
