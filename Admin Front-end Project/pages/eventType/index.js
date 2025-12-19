import { useState, useEffect, useRef } from "react";
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
      fetchEventTypes();
    }
  }, [lazyParams, token]);

  const fetchEventTypes = () => {
    setLoading(true);
    const { page, rows } = lazyParams;

    console.log("Fetching event types with params:", { page, limit: rows });

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
      .get(`http://localhost:3000/api/event-type`, {
        params: { page, limit: rows },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Event types response:", res.data);
        if (res.data.success) {
          setEventTypes(res.data.data || []);
          setTotalRecords(res.data.pagination?.total || 0);
        } else {
          setEventTypes([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching event types:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch event types",
          life: 3000,
        });
        setEventTypes([]);
        setTotalRecords(0);
      })
      .finally(() => {
        setLoading(false);
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
    setEventType({
      EventTypeId: 0,
      EventTypeName: "",
      Description: "",
      Deleted: false,
    });
    setEventTypeDialog(true);
  };

  const hideDialog = () => setEventTypeDialog(false);
  const hideDeleteDialog = () => setDeleteEventTypeDialog(false);

  const validateEventType = () => {
    if (!eventType.EventTypeName || eventType.EventTypeName.trim() === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Event Type Name is required",
        life: 3000,
      });
      return false;
    }

    if (!eventType.Description || eventType.Description.trim() === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Description is required",
        life: 3000,
      });
      return false;
    }

    return true;
  };

  const saveEventType = () => {
    if (!validateEventType()) return;

    // Filter out fields that don't belong to EventType table
    const eventTypeFields = {
      EventTypeName: eventType.EventTypeName.trim(),
      Description: eventType.Description.trim(),
    };

    if (eventType.EventTypeId === 0) {
      console.log("Creating event type:", eventTypeFields);
      axios
        .post(`http://localhost:3000/api/event-type`, eventTypeFields, {
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
        })
        .catch((err) => {
          console.error("Error creating event type:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create event type",
            life: 3000,
          });
        });
    } else {
      console.log("Updating event type:", {
        EventTypeId: eventType.EventTypeId,
        ...eventTypeFields,
      });
      axios
        .put(
          `http://localhost:3000/api/event-type/${eventType.EventTypeId}`,
          eventTypeFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchEventTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Type Updated",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error updating event type:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update event type",
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
      .delete(`http://localhost:3000/api/event-type/${eventType.EventTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchEventTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event Type Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting event type:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete event type",
          life: 3000,
        });
      });
    setDeleteEventTypeDialog(false);
  };

  const deleteSelectedEventTypes = () => {
    if (!selectedEventTypes || selectedEventTypes.length === 0) return;

    const deletePromises = selectedEventTypes.map((item) =>
      axios.delete(`http://localhost:3000/api/event-type/${item.EventTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchEventTypes();
        setSelectedEventTypes(null);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Event Types Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting selected event types:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete selected event types",
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
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />
      <DataTable
        value={eventTypes}
        selection={selectedEventTypes}
        onSelectionChange={(e) => setSelectedEventTypes(e.value)}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Event Type Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="EventTypeId" header="Event Type ID" sortable />
        <Column field="EventTypeName" header="Event Type Name" sortable />
        <Column
          field="Description"
          header="Description"
          sortable
          body={(rowData) => {
            return rowData.Description?.length > 50
              ? `${rowData.Description.substring(0, 50)}...`
              : rowData.Description;
          }}
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
            placeholder="Please enter a event type name"
          />
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
            placeholder="Please enter a description"
            rows={3}
          />
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
