import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function EventVotes() {
  let emptyEventVotes = {
    EventVotesId: 0,
    EventId: 0,
    UserId: 0,
    TotalAmount: 0,
    Deleted: false,
  };

  const token = "YOUR_API_TOKEN_HERE";
  const [eventVotess, setEventVotess] = useState([]);
  const [eventVotes, setEventVotes] = useState(emptyEventVotes);
  const [selectedEventVotess, setSelectedEventVotess] = useState(null);
  const [eventVotesDialog, setEventVotesDialog] = useState(false);
  const [deleteEventVotesDialog, setDeleteEventVotesDialog] = useState(false);
  const [deleteEventVotessDialog, setDeleteEventVotessDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchEventVotess();
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchEventVotess = () => {
    axios
      .get("http://localhost:3000/api/eventVotes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEventVotess(response.data))
      .catch((error) => console.error("Error fetching eventVotess:", error));
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/user/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/rooms/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  const openNew = () => {
    setEventVotes(emptyEventVotes);
    setSubmitted(false);
    setEventVotesDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEventVotesDialog(false);
  };

  const hideDeleteEventVotesDialog = () => setDeleteEventVotesDialog(false);
  const hideDeleteEventVotessDialog = () => setDeleteEventVotessDialog(false);

  const validateEventVotes = () => {
    if (!eventVotes.UserId) return false;
    if (!eventVotes.EventId) return false;
    if (eventVotes.Rating <= 0) return false;
    if (!eventVotes.TotalAmount) return false;
    if (!eventVotes.Status) return false;
    return true;
  };

  const saveEventVotes = () => {
    setSubmitted(true);
    let _eventVotess = [...eventVotess];
    let _eventVotes = { ...eventVotes };

    if (validateEventVotes()) {
      if (eventVotes.EventVotesId !== 0) {
        // Update existing eventVotes (PUT request)
        eventVotes.Deleted = false;
        // copy and delete eventVotes because must delete CreatedAt, UpdatedAt field
        let copyEventVotes = { ...eventVotes };
        delete copyEventVotes.CreatedAt;
        delete copyEventVotes.UpdatedAt;
        console.log("Updating eventVotes:", copyEventVotes);
        axios
          .put(
            `http://localhost:3000/api/eventVotes/${eventVotes.EventVotesId}`,
            copyEventVotes,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            fetchEventVotess();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "EventVotes has been updated",
              life: 3000,
            });
            setEventVotesDialog(false);
            setEventVotes(emptyEventVotes);
          })
          .catch((error) => console.error("Error updating eventVotes:", error));
      } else {
        // Add new eventVotes (POST request)
        console.log("Creating eventVotes:", eventVotes);
        eventVotes.Deleted = false;
        axios
          .post("http://localhost:3000/api/eventVotes", eventVotes, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchEventVotess();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "EventVotes has been created",
              life: 3000,
            });
            setEventVotesDialog(false);
            setEventVotes(emptyEventVotes);
          })
          .catch((error) => console.error("Error creating eventVotes:", error));
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields",
        life: 3000,
      });
    }
  };

  const editEventVotes = (eventVotesData) => {
    setEventVotes({ ...eventVotesData });
    setEventVotesDialog(true);
  };

  const confirmDeleteEventVotes = (eventVotesData) => {
    setEventVotes(eventVotesData);
    setDeleteEventVotesDialog(true);
  };

  const deleteEventVotes = () => {
    console.log("EventVotes:", eventVotes);

    axios
      .delete(
        `http://localhost:3000/api/eventVotes/${eventVotes.EventVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        fetchEventVotess();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "EventVotes Deleted",
          life: 3000,
        });
        setDeleteEventVotesDialog(false);
        setEventVotes(emptyEventVotes);
      })
      .catch((error) => console.error("Error deleting eventVotes:", error));
  };

  const confirmDeleteSelected = () => setDeleteEventVotessDialog(true);

  const deleteSelectedEventVotess = () => {
    let _eventVotess = eventVotess.filter(
      (val) => !selectedEventVotess.includes(val)
    );
    setEventVotess(_eventVotess);
    setDeleteEventVotessDialog(false);
    setSelectedEventVotess(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "EventVotess Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) =>
    eventVotess.findIndex((r) => r.EventVotesId === id);
  const createId = () => Math.floor(Math.random() * 100000);

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    let _eventVotes = { ...eventVotes };
    _eventVotes[name] = val;
    setEventVotes(_eventVotes);
  };

  const onEventVotesTypeChange = (e) => {
    onInputChange({ value: e.value }, "EventVotesTypeId");
  };

  const onUserChange = (e) => {
    setEventVotes({ ...eventVotes, UserId: e.value });
  };

  const onRoomChange = (e) => {
    setEventVotes({ ...eventVotes, EventId: e.value });
  };

  const leftToolbarTemplate = () => (
    <div className="my-2">
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        className="mr-2"
        onClick={openNew}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={confirmDeleteSelected}
        disabled={!selectedEventVotess || !selectedEventVotess.length}
      />
    </div>
  );

  const rightToolbarTemplate = () => <></>;

  const statusBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Status</span>
      {rowData.Status}
    </>
  );

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => editEventVotes(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteEventVotes(rowData)}
      />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage EventVotess</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const eventVotesDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveEventVotes} />
    </>
  );

  const deleteEventVotesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEventVotesDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteEventVotes} />
    </>
  );

  const deleteEventVotessDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEventVotessDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedEventVotess}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />

          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={eventVotess}
            selection={selectedEventVotess}
            onSelectionChange={(e) => setSelectedEventVotess(e.value)}
            dataKey="EventVotesId"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="EventVotesId" header="EventVotes ID" sortable />
            <Column field="EventId" header="Event Id" sortable />
            <Column field="UserId" header="User ID" sortable />
            <Column field="TotalAmount" header="Total Amount" sortable />
            <Column
              field="Deleted"
              header="Deleted"
              body={(rowData) => (rowData.Deleted ? "Yes" : "No")}
              sortable
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>

          <Dialog
            visible={eventVotesDialog}
            style={{ width: "450px" }}
            header="EventVotes Details"
            modal
            className="p-fluid"
            footer={eventVotesDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="EventId">Event Id</label>
              <Dropdown
                id="EventId"
                value={eventVotes.EventId}
                options={rooms}
                onChange={onRoomChange}
                optionLabel="EventId"
                optionValue="EventId"
                placeholder="Select Event"
                className={classNames({
                  "p-invalid": submitted && !eventVotes.EventId,
                })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="UserId">User Id</label>
              <Dropdown
                id="UserId"
                value={eventVotes.UserId}
                options={users}
                optionLabel="UserId"
                optionValue="UserId"
                onChange={onUserChange}
                placeholder="Select User"
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Rating">Rating</label>
              <Rating
                className="mb-2 mt-2"
                value={eventVotes.Rating}
                onChange={(e) => {
                  setEventVotes({ ...eventVotes, Rating: e.value });
                }}
              />
            </div>
            <div className="p-field">
              <label htmlFor="TotalAmount">Total Amount</label>
              <InputNumber
                id="TotalAmount"
                value={eventVotes.TotalAmount}
                onChange={(e) => onInputChange(e, "TotalAmount")}
                placeholder="Please enter a TotalAmount"
                showButtons
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteEventVotesDialog}
            header="Confirm"
            modal
            footer={deleteEventVotesDialogFooter}
            onHide={hideDeleteEventVotesDialog}
          ></Dialog>

          <Dialog
            visible={deleteEventVotessDialog}
            header="Confirm"
            modal
            footer={deleteEventVotessDialogFooter}
            onHide={hideDeleteEventVotessDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {eventVotes && (
                <span>
                  Are you sure you want to delete the selected eventVotess?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
