import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    EventId: 0,
    EventName: "",
    Deleted: false,
  });
  const [eventDialog, setEventDialog] = useState(false);
  const [deleteEventDialog, setDeleteEventDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get(`http://localhost:3000/api/event/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setEvent({ EventId: 0, EventName: "", Deleted: false });
    setEventDialog(true);
  };

  const hideDialog = () => setEventDialog(false);
  const hideDeleteDialog = () => setDeleteEventDialog(false);

  const saveEvent = () => {
    if (event.EventName.trim() === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Event Name is required",
        life: 3000,
      });
      return;
    }

    if (event.EventId === 0) {
      axios
        .post(`http://localhost:3000/api/event/create`, event, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEvents();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Created",
            life: 3000,
          });
        });
    } else {
      axios
        .put(`http://localhost:3000/api/event/update/${event.EventId}`, event, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEvents();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Updated",
            life: 3000,
          });
        });
    }
    setEventDialog(false);
  };

  const editEvent = (rowData) => {
    setEvent({ ...rowData });
    setEventDialog(true);
  };

  const confirmDeleteEvent = (rowData) => {
    setEvent(rowData);
    setDeleteEventDialog(true);
  };

  const deleteEvent = () => {
    axios
      .delete(`http://localhost:3000/api/event/delete/${event.EventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchEvents();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event Deleted",
          life: 3000,
        });
      });
    setDeleteEventDialog(false);
  };

  const deleteSelectedEvents = () => {
    const idsToDelete = selectedEvents.map((item) => item.EventId);
    axios
      .post(`http://localhost:3000/api/event/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchEvents();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Events Deleted",
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
        onClick={deleteSelectedEvents}
        disabled={!selectedEvents || !selectedEvents.length}
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
        onClick={() => editEvent(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteEvent(rowData)}
      />
    </div>
  );

  const eventDialogFooter = (
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
        onClick={saveEvent}
      />
    </div>
  );

  const deleteEventDialogFooter = (
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
        onClick={deleteEvent}
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
        value={events}
        selection={selectedEvents}
        onSelectionChange={(e) => setSelectedEvents(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Event Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="EventId" header="ID" sortable />
        <Column field="EventName" header="Event Name" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={eventDialog}
        style={{ width: "450px" }}
        header="Event Details"
        modal
        className="p-fluid"
        footer={eventDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="EventName">Event Name</label>
          <InputText
            id="EventName"
            value={event.EventName}
            onChange={(e) => setEvent({ ...event, EventName: e.target.value })}
            required
            autoFocus
            className={event.EventName ? "" : "p-invalid"}
          />
          {!event.EventName && (
            <small className="p-error">Event Name is required.</small>
          )}
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteEventDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteEventDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {event && (
            <span>
              Are you sure you want to delete <b>{event.EventName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
