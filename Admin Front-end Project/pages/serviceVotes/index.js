import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function ServiceVotes() {
  let emptyServiceVotes = {
    ServiceVotesId: 0,
    UserId: 0,
    RoomId: 0,
    Rating: 0,
    Comment: "",
    Status: "",
    Deleted: false,
  };

  const token = "YOUR_API_TOKEN_HERE";
  const [serviceVotess, setServiceVotess] = useState([]);
  const [serviceVotes, setServiceVotes] = useState(emptyServiceVotes);
  const [selectedServiceVotess, setSelectedServiceVotess] = useState(null);
  const [serviceVotesDialog, setServiceVotesDialog] = useState(false);
  const [deleteServiceVotesDialog, setDeleteServiceVotesDialog] =
    useState(false);
  const [deleteServiceVotessDialog, setDeleteServiceVotessDialog] =
    useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchServiceVotess();
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchServiceVotess = () => {
    axios
      .get("http://localhost:3000/api/serviceVotes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setServiceVotess(response.data))
      .catch((error) => console.error("Error fetching serviceVotess:", error));
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
    setServiceVotes(emptyServiceVotes);
    setSubmitted(false);
    setServiceVotesDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setServiceVotesDialog(false);
  };

  const hideDeleteServiceVotesDialog = () => setDeleteServiceVotesDialog(false);
  const hideDeleteServiceVotessDialog = () =>
    setDeleteServiceVotessDialog(false);

  const validateServiceVotes = () => {
    if (!serviceVotes.UserId) return false;
    if (!serviceVotes.RoomId) return false;
    if (serviceVotes.Rating <= 0) return false;
    if (!serviceVotes.Comment) return false;
    if (!serviceVotes.Status) return false;
    return true;
  };

  const saveServiceVotes = () => {
    setSubmitted(true);
    let _serviceVotess = [...serviceVotess];
    let _serviceVotes = { ...serviceVotes };

    if (validateServiceVotes()) {
      if (serviceVotes.ServiceVotesId !== 0) {
        // Update existing serviceVotes (PUT request)
        serviceVotes.Deleted = false;
        // copy and delete serviceVotes because must delete CreatedAt, UpdatedAt field
        let copyServiceVotes = { ...serviceVotes };
        delete copyServiceVotes.CreatedAt;
        delete copyServiceVotes.UpdatedAt;
        console.log("Updating serviceVotes:", copyServiceVotes);
        axios
          .put(
            `http://localhost:3000/api/serviceVotes/${serviceVotes.ServiceVotesId}`,
            copyServiceVotes,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            fetchServiceVotess();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "ServiceVotes has been updated",
              life: 3000,
            });
            setServiceVotesDialog(false);
            setServiceVotes(emptyServiceVotes);
          })
          .catch((error) =>
            console.error("Error updating serviceVotes:", error)
          );
      } else {
        // Add new serviceVotes (POST request)
        console.log("Creating serviceVotes:", serviceVotes);
        serviceVotes.Deleted = false;
        axios
          .post("http://localhost:3000/api/serviceVotes", serviceVotes, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchServiceVotess();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "ServiceVotes has been created",
              life: 3000,
            });
            setServiceVotesDialog(false);
            setServiceVotes(emptyServiceVotes);
          })
          .catch((error) =>
            console.error("Error creating serviceVotes:", error)
          );
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

  const editServiceVotes = (serviceVotesData) => {
    setServiceVotes({ ...serviceVotesData });
    setServiceVotesDialog(true);
  };

  const confirmDeleteServiceVotes = (serviceVotesData) => {
    setServiceVotes(serviceVotesData);
    setDeleteServiceVotesDialog(true);
  };

  const deleteServiceVotes = () => {
    console.log("ServiceVotes:", serviceVotes);

    axios
      .delete(
        `http://localhost:3000/api/serviceVotes/${serviceVotes.ServiceVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        fetchServiceVotess();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "ServiceVotes Deleted",
          life: 3000,
        });
        setDeleteServiceVotesDialog(false);
        setServiceVotes(emptyServiceVotes);
      })
      .catch((error) => console.error("Error deleting serviceVotes:", error));
  };

  const confirmDeleteSelected = () => setDeleteServiceVotessDialog(true);

  const deleteSelectedServiceVotess = () => {
    let _serviceVotess = serviceVotess.filter(
      (val) => !selectedServiceVotess.includes(val)
    );
    setServiceVotess(_serviceVotess);
    setDeleteServiceVotessDialog(false);
    setSelectedServiceVotess(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "ServiceVotess Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) =>
    serviceVotess.findIndex((r) => r.ServiceVotesId === id);
  const createId = () => Math.floor(Math.random() * 100000);

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    let _serviceVotes = { ...serviceVotes };
    _serviceVotes[name] = val;
    setServiceVotes(_serviceVotes);
  };

  const onServiceVotesTypeChange = (e) => {
    onInputChange({ value: e.value }, "ServiceVotesTypeId");
  };

  const onUserChange = (e) => {
    setServiceVotes({ ...serviceVotes, UserId: e.value });
  };

  const onRoomChange = (e) => {
    setServiceVotes({ ...serviceVotes, RoomId: e.value });
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
        disabled={!selectedServiceVotess || !selectedServiceVotess.length}
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
        onClick={() => editServiceVotes(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteServiceVotes(rowData)}
      />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage ServiceVotess</h5>
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

  const serviceVotesDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveServiceVotes} />
    </>
  );

  const deleteServiceVotesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteServiceVotesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteServiceVotes}
      />
    </>
  );

  const deleteServiceVotessDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteServiceVotessDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedServiceVotess}
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
            value={serviceVotess}
            selection={selectedServiceVotess}
            onSelectionChange={(e) => setSelectedServiceVotess(e.value)}
            dataKey="ServiceVotesId"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="ServiceVotesId" header="ServiceVotes ID" sortable />
            <Column field="UserId" header="User ID" sortable />
            <Column field="RoomId" header="Room ID" sortable />
            <Column field="Rating" header="Rating" sortable />
            <Column field="Comment" header="Comment" sortable />
            <Column field="Status" header="Status" sortable />
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
            visible={serviceVotesDialog}
            style={{ width: "450px" }}
            header="ServiceVotes Details"
            modal
            className="p-fluid"
            footer={serviceVotesDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="UserId">User Id</label>
              <Dropdown
                id="UserId"
                value={serviceVotes.UserId}
                options={users}
                optionLabel="UserId"
                optionValue="UserId"
                onChange={onUserChange}
                placeholder="Select User"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="RoomId">Room Id</label>
              <Dropdown
                id="RoomId"
                value={serviceVotes.RoomId}
                options={rooms}
                onChange={onRoomChange}
                optionLabel="RoomId"
                optionValue="RoomId"
                placeholder="Select Room"
                className={classNames({
                  "p-invalid": submitted && !serviceVotes.RoomId,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Rating">Rating</label>
              <Dropdown
                id="Rating"
                value={serviceVotes.Rating}
                options={["1", "2", "3", "4", "5"]}
                onChange={(e) => onInputChange(e, "Rating")}
                placeholder="Please select a rating"
              />
            </div>
            <div className="p-field">
              <label htmlFor="Comment">Comment</label>
              <InputText
                id="Comment"
                value={serviceVotes.Comment}
                onChange={(e) => onInputChange(e, "Comment")}
                placeholder="Please enter a comment"
              />
            </div>
            <div className="p-field">
              <label htmlFor="Status">Status</label>
              <Dropdown
                id="Status"
                value={serviceVotes.Status}
                options={["Unpaid", "Paid"]}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Select Status"
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteServiceVotesDialog}
            header="Confirm"
            modal
            footer={deleteServiceVotesDialogFooter}
            onHide={hideDeleteServiceVotesDialog}
          ></Dialog>

          <Dialog
            visible={deleteServiceVotessDialog}
            header="Confirm"
            modal
            footer={deleteServiceVotessDialogFooter}
            onHide={hideDeleteServiceVotessDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {serviceVotes && (
                <span>
                  Are you sure you want to delete the selected serviceVotess?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
