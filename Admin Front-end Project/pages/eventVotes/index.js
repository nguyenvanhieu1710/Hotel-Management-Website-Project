import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function EventVotes() {
  const [eventVotes, setEventVotes] = useState([]);
  const [eventVote, setEventVote] = useState({
    EventVotesId: 0,
    EventId: 0,
    UserId: 0,
    TotalAmount: 0,
    Deleted: false,
  });
  const [selectedEventVotes, setSelectedEventVotes] = useState(null);
  const [eventVoteDialog, setEventVoteDialog] = useState(false);
  const [deleteEventVoteDialog, setDeleteEventVoteDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchEventVotes();
      fetchUsers();
      fetchEvents();
    }
  }, [lazyParams, token]);

  const fetchEventVotes = () => {
    setLoading(true);
    const { page, rows } = lazyParams;

    console.log("Fetching event votes with params:", { page, limit: rows });

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
      .get(`http://localhost:3000/api/event-votes`, {
        params: { page, limit: rows },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Event votes response:", res.data);
        if (res.data.success) {
          setEventVotes(res.data.data || []);
          setTotalRecords(res.data.pagination?.total || 0);
        } else {
          setEventVotes([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching event votes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch event votes",
          life: 3000,
        });
        setEventVotes([]);
        setTotalRecords(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    if (!token) return;

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
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch users",
          life: 3000,
        });
        setUsers([]);
      });
  };

  const fetchEvents = () => {
    if (!token) return;

    axios
      .get(`http://localhost:3000/api/event`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Events response:", res.data);
        if (res.data.success) {
          setEvents(res.data.data || []);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch events",
          life: 3000,
        });
        setEvents([]);
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
    setEventVote({
      EventVotesId: 0,
      EventId: 0,
      UserId: 0,
      TotalAmount: 0,
      Deleted: false,
    });
    setEventVoteDialog(true);
  };

  const hideDialog = () => setEventVoteDialog(false);
  const hideDeleteDialog = () => setDeleteEventVoteDialog(false);

  const validateEventVote = () => {
    if (!eventVote.EventId || eventVote.EventId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Event is required",
        life: 3000,
      });
      return false;
    }

    if (!eventVote.UserId || eventVote.UserId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User is required",
        life: 3000,
      });
      return false;
    }

    if (!eventVote.TotalAmount || eventVote.TotalAmount <= 0) {
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

  const saveEventVote = () => {
    if (!validateEventVote()) return;

    // Filter out fields that don't belong to EventVotes table
    const eventVoteFields = {
      EventId: eventVote.EventId,
      UserId: eventVote.UserId,
      TotalAmount: eventVote.TotalAmount,
    };

    if (eventVote.EventVotesId === 0) {
      console.log("Creating event vote:", eventVoteFields);
      axios
        .post(`http://localhost:3000/api/event-votes`, eventVoteFields, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEventVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Vote Created",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error creating event vote:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              err.response?.data?.message || "Failed to create event vote",
            life: 3000,
          });
        });
    } else {
      console.log("Updating event vote:", {
        EventVotesId: eventVote.EventVotesId,
        ...eventVoteFields,
      });
      axios
        .put(
          `http://localhost:3000/api/event-votes/${eventVote.EventVotesId}`,
          eventVoteFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchEventVotes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Event Vote Updated",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error updating event vote:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              err.response?.data?.message || "Failed to update event vote",
            life: 3000,
          });
        });
    }
    setEventVoteDialog(false);
  };

  const editEventVote = (rowData) => {
    setEventVote({ ...rowData });
    setEventVoteDialog(true);
  };

  const confirmDeleteEventVote = (rowData) => {
    setEventVote(rowData);
    setDeleteEventVoteDialog(true);
  };

  const deleteEventVote = () => {
    axios
      .delete(
        `http://localhost:3000/api/event-votes/${eventVote.EventVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchEventVotes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event Vote Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting event vote:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response?.data?.message || "Failed to delete event vote",
          life: 3000,
        });
      });
    setDeleteEventVoteDialog(false);
  };

  const deleteSelectedEventVotes = () => {
    if (!selectedEventVotes || selectedEventVotes.length === 0) return;

    const deletePromises = selectedEventVotes.map((item) =>
      axios.delete(
        `http://localhost:3000/api/event-votes/${item.EventVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchEventVotes();
        setSelectedEventVotes(null);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Event Votes Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting selected event votes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete selected event votes",
          life: 3000,
        });
      });
  };

  const onInputChange = (e, name) => {
    const val = e.target ? e.target.value : e.value;
    setEventVote({ ...eventVote, [name]: val });
  };

  const onUserChange = (e) => {
    setEventVote({ ...eventVote, UserId: e.value });
  };

  const onEventChange = (e) => {
    setEventVote({ ...eventVote, EventId: e.value });
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
        onClick={deleteSelectedEventVotes}
        disabled={!selectedEventVotes || !selectedEventVotes.length}
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
        onClick={() => editEventVote(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteEventVote(rowData)}
      />
    </div>
  );

  const eventVoteDialogFooter = (
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
        onClick={saveEventVote}
      />
    </div>
  );

  const deleteEventVoteDialogFooter = (
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
        onClick={deleteEventVote}
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
        value={eventVotes}
        selection={selectedEventVotes}
        onSelectionChange={(e) => setSelectedEventVotes(e.value)}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Event Votes Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="EventVotesId" header="Event Vote ID" sortable />
        <Column
          field="EventName"
          header="Event"
          sortable
          body={(rowData) => rowData.EventName || `ID: ${rowData.EventId}`}
        />
        <Column
          field="UserName"
          header="User"
          sortable
          body={(rowData) => rowData.UserName || `ID: ${rowData.UserId}`}
        />
        <Column
          field="TotalAmount"
          header="Total Amount"
          sortable
          body={(rowData) => `$${rowData.TotalAmount}`}
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}
      <Dialog
        visible={eventVoteDialog}
        style={{ width: "450px" }}
        header="Event Vote Details"
        modal
        className="p-fluid"
        footer={eventVoteDialogFooter}
        onHide={hideDialog}
      >
        {/* Event */}
        <div className="field">
          <label htmlFor="EventId">Event</label>
          <Dropdown
            id="EventId"
            value={eventVote.EventId}
            options={events}
            optionLabel="EventName"
            optionValue="EventId"
            onChange={onEventChange}
            placeholder="Select Event"
            required
          />
        </div>

        {/* User */}
        <div className="field">
          <label htmlFor="UserId">User</label>
          <Dropdown
            id="UserId"
            value={eventVote.UserId}
            options={users}
            optionLabel="UserName"
            optionValue="UserId"
            onChange={onUserChange}
            placeholder="Select User"
            required
          />
        </div>

        {/* Total Amount */}
        <div className="field">
          <label htmlFor="TotalAmount">Total Amount</label>
          <InputNumber
            id="TotalAmount"
            value={eventVote.TotalAmount}
            onValueChange={(e) => onInputChange(e, "TotalAmount")}
            mode="currency"
            currency="USD"
            locale="en-US"
            placeholder="Please enter total amount"
            required
            showButtons
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteEventVoteDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteEventVoteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {eventVote && (
            <span>Are you sure you want to delete this event vote?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
