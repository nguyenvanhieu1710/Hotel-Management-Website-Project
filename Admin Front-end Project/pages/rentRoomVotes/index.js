import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import axios from "axios";

export default function RentRoomVotes() {
  const [votes, setVotes] = useState([]);
  const [vote, setVote] = useState({
    RentRoomVotesId: 0,
    UserId: 0,
    ActualCheckinDate: "",
    ActualCheckoutDate: "",
    TotalAmount: "",
    Status: "",
    Note: "",
    Deleted: false,
  });
  const [voteDialog, setVoteDialog] = useState(false);
  const [deleteVoteDialog, setDeleteVoteDialog] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);

  const fetchVotes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/rent-room-votes/get-all"
      );
      setVotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const openNew = () => {
    setVote({
      RentRoomVotesId: 0,
      UserId: 0,
      ActualCheckinDate: "",
      ActualCheckoutDate: "",
      TotalAmount: "",
      Status: "",
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

  const validateRentRoomVotes = () => {
    if (isNaN(Number(vote.UserId))) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User ID is required",
        life: 3000,
      });
      return false;
    }
    if (!safeTrim(vote.ActualCheckinDate)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Actual Check-in Date is required",
        life: 3000,
      });
      return false;
    }
    if (!safeTrim(vote.ActualCheckoutDate)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Actual Check-out Date is required",
        life: 3000,
      });
      return false;
    }
    if (isNaN(Number(vote.TotalAmount)) || Number(vote.TotalAmount) <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Total Amount must be a number greater than 0",
        life: 3000,
      });
      return false;
    }
    if (!safeTrim(vote.Status)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Status is required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const saveVote = async () => {
    if (!validateRentRoomVotes()) {
      return;
    }
    try {
      if (vote.RentRoomVotesId === 0) {
        console.log("Creating new vote... ", vote);

        await axios.post(
          "http://localhost:3000/api/rent-room-votes/create",
          vote
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Vote created!",
          life: 3000,
        });
      } else {
        console.log("Updating new vote... ", vote);
        vote.ActualCheckinDate = formatDateToMySQL(vote.ActualCheckinDate);
        vote.ActualCheckoutDate = formatDateToMySQL(vote.ActualCheckoutDate);
        vote.Deleted = false;
        await axios.put(
          `http://localhost:3000/api/rent-room-votes/update`,
          vote
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Vote updated!",
          life: 3000,
        });
      }
      setVoteDialog(false);
      fetchVotes();
    } catch (err) {
      console.error(err);
    }
  };

  const editVote = (rowData) => {
    setVote({ ...rowData });
    setVoteDialog(true);
  };

  const confirmDeleteVote = (rowData) => {
    setVote(rowData);
    setDeleteVoteDialog(true);
  };

  const deleteVote = async () => {
    try {
      await axios.delete(
        `https://localhost:44302/api/rent-room-vote/delete/${vote.VoteId}`
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa đánh giá!",
        life: 3000,
      });
      setDeleteVoteDialog(false);
      fetchVotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSelectedVotes = async () => {
    try {
      const ids = selectedVotes.map((v) => v.VoteId);
      await axios.post(
        "https://localhost:44302/api/rent-room-vote/delete-multiple",
        ids
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa các đánh giá!",
        life: 3000,
      });
      setSelectedVotes(null);
      fetchVotes();
    } catch (err) {
      console.error(err);
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
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />

      <DataTable
        value={votes}
        paginator
        rows={5}
        dataKey="RentRoomVotesId"
        selection={selectedVotes}
        onSelectionChange={(e) => setSelectedVotes(e.value)}
        globalFilter={globalFilter}
        header="Rent Room Votes List"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="RentRoomVotesId" header="Rent Room Vote ID" sortable />
        <Column field="UserId" header="User ID" sortable />
        <Column
          field="ActualCheckinDate"
          header="Actual Check-in Date"
          sortable
        />
        <Column
          field="ActualCheckoutDate"
          header="Actual Check-out Date"
          sortable
        />
        <Column field="TotalAmount" header="Total Amount" sortable />
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
        <div className="field">
          <label htmlFor="UserId">User ID</label>
          <InputNumber
            id="UserId"
            value={vote.UserId}
            onChange={(e) => setVote({ ...vote, UserId: e.value })}
            placeholder="Enter User ID"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="ActualCheckinDate">Actual Check-in Date</label>
          <InputText
            id="ActualCheckinDate"
            value={vote.ActualCheckinDate}
            onChange={(e) =>
              setVote({ ...vote, ActualCheckinDate: e.target.value })
            }
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="ActualCheckoutDate">Actual Check-out Date</label>
          <InputText
            id="ActualCheckoutDate"
            value={vote.ActualCheckoutDate}
            onChange={(e) =>
              setVote({ ...vote, ActualCheckoutDate: e.target.value })
            }
            placeholder="YYYY-MM-DD"
            required
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
          />
        </div>
        <div className="field">
          <label htmlFor="Status">Status</label>
          <InputText
            id="Status"
            value={vote.Status}
            onChange={(e) => setVote({ ...vote, Status: e.target.value })}
            placeholder="Enter status"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Note">Note</label>
          <InputText
            id="Note"
            value={vote.Note}
            onChange={(e) => setVote({ ...vote, Note: e.target.value })}
            placeholder="Enter additional notes (optional)"
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
            Bạn chắc chắn muốn xóa đánh giá <b>{vote.VoteId}</b>?
          </span>
        </div>
      </Dialog>
    </div>
  );
}
