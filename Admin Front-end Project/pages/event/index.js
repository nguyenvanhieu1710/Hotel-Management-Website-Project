import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    EventId: 0,
    EventName: "",
    EventTypeId: 0,
    UserId: 0,
    OrganizationDay: "",
    StartTime: "",
    EndTime: "",
    OrganizationLocation: "",
    TotalCost: 0,
    Status: "",
    Description: "",
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

  const eventTypes = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
  ];

  const users = [
    { label: "1", value: 101 },
    { label: "3", value: 102 },
    { label: "4", value: 103 },
  ];

  const [errors, setErrors] = useState({});

  const validateEvent = () => {
    let newErrors = {};
    let isValid = true;

    if (!event.EventName || event.EventName.trim() === "") {
      newErrors.EventName = "Event Name is required.";
      isValid = false;
    }

    if (!event.EventTypeId || event.EventTypeId === 0) {
      newErrors.EventTypeId = "Event Type is required.";
      isValid = false;
    }

    if (!event.UserId || event.UserId === 0) {
      newErrors.UserId = "User is required.";
      isValid = false;
    }

    if (
      !event.OrganizationLocation ||
      event.OrganizationLocation.trim() === ""
    ) {
      newErrors.OrganizationLocation = "Organization Location is required.";
      isValid = false;
    }

    if (!event.TotalCost || event.TotalCost <= 0) {
      newErrors.TotalCost = "Total Cost must be greater than 0.";
      isValid = false;
    }

    if (!event.Status || event.Status.trim() === "") {
      newErrors.Status = "Status is required.";
      isValid = false;
    }

    if (!event.Description || event.Description.trim() === "") {
      newErrors.Description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatDateToMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // 'yyyy-mm-dd'
  };

  const saveEvent = () => {
    if (!validateEvent()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
      return;
    }

    if (event.EventId === 0) {
      console.log("Creating Event: ", event);
      event.OrganizationDay = formatDateToMySQL(event.OrganizationDay);
      event.StartTime = formatDateToMySQL(event.StartTime);
      event.EndTime = formatDateToMySQL(event.EndTime);
      event.EventTypeId = 2;
      event.UserId = 4;
      event.Deleted = false;
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
      console.log("Updating Event: ", event);
      event.OrganizationDay = formatDateToMySQL(event.OrganizationDay);
      event.StartTime = formatDateToMySQL(event.StartTime);
      event.EndTime = formatDateToMySQL(event.EndTime);
      event.EventTypeId = 2;
      event.UserId = 4;
      event.Deleted = false;
      axios
        .put(`http://localhost:3000/api/event/update`, event, {
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
        <Column field="EventId" header="Event ID" sortable />
        <Column field="EventName" header="Event Name" sortable />
        <Column field="EventTypeId" header="Event Type ID" sortable />
        <Column field="UserId" header="User ID" sortable />
        <Column
          field="OrganizationDay"
          header="Organization Day"
          sortable
          body={(rowData) =>
            new Date(rowData.OrganizationDay).toLocaleDateString()
          }
        />
        <Column
          field="StartTime"
          header="Start Time"
          sortable
          body={(rowData) => new Date(rowData.StartTime).toLocaleString()}
        />
        <Column
          field="EndTime"
          header="End Time"
          sortable
          body={(rowData) => new Date(rowData.EndTime).toLocaleString()}
        />
        <Column field="OrganizationLocation" header="Location" sortable />
        <Column
          field="TotalCost"
          header="Total Cost"
          sortable
          body={(rowData) => `$${rowData.TotalCost}`}
        />
        <Column field="Status" header="Status" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          field="Deleted"
          header="Deleted"
          sortable
          body={(rowData) => (rowData.Deleted ? "Deleted" : "Active")}
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={eventDialog}
        style={{ width: "500px" }}
        header="Event Details"
        modal
        className="p-fluid"
        footer={eventDialogFooter}
        onHide={hideDialog}
      >
        {/* Event Name */}
        <div className="field">
          <label htmlFor="EventName">Event Name</label>
          <InputText
            id="EventName"
            value={event.EventName}
            onChange={(e) => setEvent({ ...event, EventName: e.target.value })}
            className={errors.EventName ? "p-invalid" : ""}
          />
          {errors.EventName && (
            <small className="p-error">{errors.EventName}</small>
          )}
        </div>

        {/* Event Type */}
        <div className="field">
          <label htmlFor="EventTypeId">Event Type Id</label>
          <Dropdown
            id="EventTypeId"
            value={event.EventTypeId}
            options={eventTypes}
            onChange={(e) => setEvent({ ...event, EventTypeId: e.value })}
            placeholder="Select Event Type"
            className={errors.EventTypeId ? "p-invalid" : ""}
          />
          {errors.EventTypeId && (
            <small className="p-error">{errors.EventTypeId}</small>
          )}
        </div>

        {/* User */}
        <div className="field">
          <label htmlFor="UserId">User</label>
          <Dropdown
            id="UserId"
            value={event.UserId}
            options={users}
            onChange={(e) => setEvent({ ...event, UserId: e.value })}
            placeholder="Select User"
            className={errors.UserId ? "p-invalid" : ""}
          />
          {errors.UserId && <small className="p-error">{errors.UserId}</small>}
        </div>

        {/* Organization Day */}
        <div className="field">
          <label htmlFor="OrganizationDay">Organization Day</label>
          <Calendar
            id="OrganizationDay"
            value={event.OrganizationDay}
            onChange={(e) => setEvent({ ...event, OrganizationDay: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
            className={errors.OrganizationDay ? "p-invalid" : ""}
          />
          {errors.OrganizationDay && (
            <small className="p-error">{errors.OrganizationDay}</small>
          )}
        </div>

        {/* Start Time */}
        <div className="field">
          <label htmlFor="StartTime">Start Time</label>
          <Calendar
            id="StartTime"
            value={event.StartTime}
            onChange={(e) => setEvent({ ...event, StartTime: e.value })}
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            className={errors.StartTime ? "p-invalid" : ""}
          />
          {errors.StartTime && (
            <small className="p-error">{errors.StartTime}</small>
          )}
        </div>

        {/* End Time */}
        <div className="field">
          <label htmlFor="EndTime">End Time</label>
          <Calendar
            id="EndTime"
            value={event.EndTime}
            onChange={(e) => setEvent({ ...event, EndTime: e.value })}
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            className={errors.EndTime ? "p-invalid" : ""}
          />
          {errors.EndTime && (
            <small className="p-error">{errors.EndTime}</small>
          )}
        </div>

        {/* Organization Location */}
        <div className="field">
          <label htmlFor="OrganizationLocation">Location</label>
          <InputText
            id="OrganizationLocation"
            value={event.OrganizationLocation}
            onChange={(e) =>
              setEvent({ ...event, OrganizationLocation: e.target.value })
            }
            className={errors.OrganizationLocation ? "p-invalid" : ""}
          />
          {errors.OrganizationLocation && (
            <small className="p-error">{errors.OrganizationLocation}</small>
          )}
        </div>

        {/* Total Cost */}
        <div className="field">
          <label htmlFor="TotalCost">Total Cost</label>
          <InputNumber
            id="TotalCost"
            value={event.TotalCost}
            onValueChange={(e) => setEvent({ ...event, TotalCost: e.value })}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={errors.TotalCost ? "p-invalid" : ""}
          />
          {errors.TotalCost && (
            <small className="p-error">{errors.TotalCost}</small>
          )}
        </div>

        {/* Status */}
        <div className="field">
          <label htmlFor="Status">Status</label>
          <Dropdown
            id="Status"
            value={event.Status}
            options={["Pending", "Confirmed", "Cancelled"]}
            onChange={(e) => setEvent({ ...event, Status: e.value })}
            placeholder="Select Status"
            className={errors.Status ? "p-invalid" : ""}
          />
          {errors.Status && <small className="p-error">{errors.Status}</small>}
        </div>

        {/* Description */}
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputTextarea
            id="Description"
            value={event.Description}
            onChange={(e) =>
              setEvent({ ...event, Description: e.target.value })
            }
            rows={3}
            className={errors.Description ? "p-invalid" : ""}
          />
          {errors.Description && (
            <small className="p-error">{errors.Description}</small>
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
