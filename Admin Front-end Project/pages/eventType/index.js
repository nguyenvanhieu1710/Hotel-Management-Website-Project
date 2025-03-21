import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function EventType() {
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState({
    EventTypeId: 0,
    EventTypeName: "",
    Description: "",
    Deleted: false,
  });
  const [eventTypeDialog, setEventTypeDialog] = useState(false);
  const [deleteEventTypeDialog, setDeleteEventTypeDialog] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = () => {
    axios
      .get(`http://localhost:3000/api/event-type/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEventTypes(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setEventType({ EventTypeId: 0, EventTypeName: "", Deleted: false });
    setEventTypeDialog(true);
  };

  const hideDialog = () => setEventTypeDialog(false);
  const hideDeleteDialog = () => setDeleteEventTypeDialog(false);

  const [errors, setErrors] = useState({ EventTypeName: "", Description: "" });

  const validateEventType = () => {
    let isValid = true;
    let newErrors = { EventTypeName: "", Description: "" };

    if (eventType.EventTypeName.trim() === "") {
      newErrors.EventTypeName = "Event Type Name is required.";
      isValid = false;
    }

    if (eventType.Description.trim() === "") {
      newErrors.Description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveEventType = () => {
    if (!validateEventType()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
      return;
    }

    if (eventType.EventTypeId === 0) {
      console.log("Creating event type: ", eventType);
      eventType.Deleted = false;
      axios
        .post(`http://localhost:3000/api/event-type/create`, eventType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEventTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Type Created",
            life: 3000,
          });
        });
    } else {
      console.log("Updating event type: ", eventType);
      eventType.Deleted = false;
      axios
        .put(`http://localhost:3000/api/event-type/update`, eventType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEventTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Type Updated",
            life: 3000,
          });
        });
    }
    setEventTypeDialog(false);
  };

  const editEventType = (rowData) => {
    setEventType({ ...rowData });
    setEventTypeDialog(true);
  };

  const confirmDeleteEventType = (rowData) => {
    setEventType(rowData);
    setDeleteEventTypeDialog(true);
  };

  const deleteEventType = () => {
    axios
      .delete(
        `http://localhost:3000/api/event-type/delete/${eventType.EventTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchEventTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event Type Deleted",
          life: 3000,
        });
      });
    setDeleteEventTypeDialog(false);
  };

  const deleteSelectedEventTypes = () => {
    const idsToDelete = selectedEventTypes.map((item) => item.EventTypeId);
    axios
      .post(
        `http://localhost:3000/api/event-type/delete-multiple`,
        idsToDelete,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchEventTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Event Types Deleted",
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
        onClick={deleteSelectedEventTypes}
        disabled={!selectedEventTypes || !selectedEventTypes.length}
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
        onClick={() => editEventType(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteEventType(rowData)}
      />
    </div>
  );

  const eventTypeDialogFooter = (
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
        onClick={saveEventType}
      />
    </div>
  );

  const deleteEventTypeDialogFooter = (
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
        onClick={deleteEventType}
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
        value={eventTypes}
        selection={selectedEventTypes}
        onSelectionChange={(e) => setSelectedEventTypes(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Event Type Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="EventTypeId" header="Event Type ID" sortable />
        <Column field="EventTypeName" header="Event Type Name" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          field="Deleted"
          header="Deleted"
          body={(rowData) => (rowData.Deleted ? "true" : "false")}
          sortable
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={eventTypeDialog}
        style={{ width: "450px" }}
        header="Event Type Details"
        modal
        className="p-fluid"
        footer={eventTypeDialogFooter}
        onHide={hideDialog}
      >
        {/* Event Type Name */}
        <div className="field">
          <label htmlFor="EventTypeName">Event Type Name</label>
          <InputText
            id="EventTypeName"
            value={eventType.EventTypeName}
            onChange={(e) =>
              setEventType({ ...eventType, EventTypeName: e.target.value })
            }
            required
            autoFocus
            className={errors.EventTypeName ? "p-invalid" : ""}
          />
          {errors.EventTypeName && (
            <small className="p-error">{errors.EventTypeName}</small>
          )}
        </div>

        {/* Description */}
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputTextarea
            id="Description"
            value={eventType.Description}
            onChange={(e) =>
              setEventType({ ...eventType, Description: e.target.value })
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
        visible={deleteEventTypeDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteEventTypeDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {eventType && (
            <span>
              Are you sure you want to delete <b>{eventType.EventTypeName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
