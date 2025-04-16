import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
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
    EventImage: "",
    OrganizationDay: "",
    StartTime: "",
    EndTime: "",
    OrganizationLocation: "",
    Price: 0,
    Status: "",
    Description: "",
    Deleted: false,
  });
  const [eventDialog, setEventDialog] = useState(false);
  const [deleteEventDialog, setDeleteEventDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchEvents();
    fetchEventTypes();
  }, []);

  const fetchEvents = () => {
    axios
      .get(`http://localhost:3000/api/event/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  };

  const fetchEventTypes = () => {
    axios
      .get(`http://localhost:3000/api/event-type/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEventTypes(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setEvent({ EventId: 0, EventName: "", Deleted: false });
    setEventDialog(true);
  };

  const hideDialog = () => setEventDialog(false);
  const hideDeleteDialog = () => setDeleteEventDialog(false);

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

    if (!event.EventImage || event.EventImage.trim() === "") {
      newErrors.EventImage = "Event Image is required.";
      isValid = false;
    }

    if (
      !event.OrganizationLocation ||
      event.OrganizationLocation.trim() === ""
    ) {
      newErrors.OrganizationLocation = "Organization Location is required.";
      isValid = false;
    }

    if (!event.Price || event.Price <= 0) {
      newErrors.Price = "Price must be greater than 0.";
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
    setEvent({
      ...rowData,
      OrganizationDay: rowData.OrganizationDay
        ? new Date(rowData.OrganizationDay)
        : null,
      StartTime: rowData.StartTime ? new Date(rowData.StartTime) : null,
      EndTime: rowData.EndTime ? new Date(rowData.EndTime) : null,
    });
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

  const onEventTypeChange = (e) => {
    setEvent({ ...event, EventTypeId: e.value });
  };

  const onImageUpload = async (event) => {
    const file = event.files[0];
    if (!file) {
      alert("Please choose file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const data = reader.result.split(",")[1];
      const postData = {
        name: file.name,
        type: file.type,
        data: data,
      };
      await postFile(postData);
    };
  };

  async function postFile(postData) {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzYlB7UiHskVI1KTDP3LlomXXG548qwdVdVyoUXgW_j8_RmW_7xAV_5u-_hjUox1bYA/exec",
        {
          method: "POST",
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      console.log("API Response When Upload Image:", data);
      if (data.link) {
        // console.log("Upload Image:", data.link);
        setEvent((prev) => ({ ...prev, EventImage: data.link }));
      } else {
        // console.log("Not found data.link");
        alert("Upload failed! No image link returned.");
      }
    } catch (error) {
      alert("Please try again");
    }
  }

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
        <Column
          field="EventImage"
          header="Image"
          body={(rowData) => (
            <img
              src={rowData.EventImage}
              alt="Event"
              style={{ width: "50px", height: "50px", borderRadius: "5px" }}
            />
          )}
          sortable
        />
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
          field="Price"
          header="Price"
          sortable
          body={(rowData) => `$${rowData.Price}`}
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
            required
            placeholder="Please enter a event name"
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
            optionLabel="EventTypeId"
            optionValue="EventTypeId"
            onChange={onEventTypeChange}
            placeholder="Select Event Type"
            className={errors.EventTypeId ? "p-invalid" : ""}
            required
          />
          {errors.EventTypeId && (
            <small className="p-error">{errors.EventTypeId}</small>
          )}
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
            placeholder="Please choose a organization day"
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
            placeholder="Please select start time"
            className={errors.StartTime ? "p-invalid" : ""}
            required
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
            placeholder="Please select end time"
            hourFormat="24"
            dateFormat="yy-mm-dd"
            className={errors.EndTime ? "p-invalid" : ""}
            required
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
            placeholder="Please enter location"
            className={errors.OrganizationLocation ? "p-invalid" : ""}
            required
          />
          {errors.OrganizationLocation && (
            <small className="p-error">{errors.OrganizationLocation}</small>
          )}
        </div>

        {/* Price */}
        <div className="field">
          <label htmlFor="Price">Price</label>
          <InputNumber
            id="Price"
            value={event.Price}
            onValueChange={(e) => setEvent({ ...event, Price: e.value })}
            mode="currency"
            currency="USD"
            locale="en-US"
            placeholder="Please enter price"
            className={errors.Price ? "p-invalid" : ""}
            required
            showButtons
          />
          {errors.Price && <small className="p-error">{errors.Price}</small>}
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
            required
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
            placeholder="Please enter a description"
            className={errors.Description ? "p-invalid" : ""}
            required
          />
          {errors.Description && (
            <small className="p-error">{errors.Description}</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="EventImage">Event Image</label>
          <img
            src={
              event.EventImage && event.EventImage !== "null"
                ? event.EventImage
                : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
            }
            alt="Event"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />

          <FileUpload
            mode="basic"
            name="EventImage"
            accept="image/*"
            customUpload
            auto
            chooseLabel="Upload Image"
            uploadHandler={(e) => onImageUpload(e)}
            className="p-mt-2"
          />
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
