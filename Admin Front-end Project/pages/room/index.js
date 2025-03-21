import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function Room() {
  let emptyRoom = {
    RoomId: 0,
    RoomTypeId: 0,
    Price: "",
    NumberOfFloor: 0,
    Status: "",
    Description: "",
    Deleted: false,
  };

  const token = "YOUR_API_TOKEN_HERE";
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(emptyRoom);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [roomDialog, setRoomDialog] = useState(false);
  const [deleteRoomDialog, setDeleteRoomDialog] = useState(false);
  const [deleteRoomsDialog, setDeleteRoomsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/rooms/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  const openNew = () => {
    setRoom(emptyRoom);
    setSubmitted(false);
    setRoomDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRoomDialog(false);
  };

  const hideDeleteRoomDialog = () => setDeleteRoomDialog(false);
  const hideDeleteRoomsDialog = () => setDeleteRoomsDialog(false);

  const validateRoom = () => {
    if (!room.RoomTypeId) return false;
    if (!room.Price) return false;
    if (!room.NumberOfFloor) return false;
    if (!room.Status) return false;
    return true;
  };

  const saveRoom = () => {
    setSubmitted(true);
    let _rooms = [...rooms];
    let _room = { ...room };

    if (validateRoom()) {
      if (room.RoomId !== 0) {
        // Update existing room (PUT request)
        console.log("Updating room:", room);
        room.Deleted = false;
        axios
          .put("http://localhost:3000/api/rooms/update", room, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchRooms();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Room has been updated",
              life: 3000,
            });
            setRoomDialog(false);
            setRoom(emptyRoom);
          })
          .catch((error) => console.error("Error updating room:", error));
      } else {
        // Add new room (POST request)
        console.log("Creating room:", room);
        room.Deleted = false;
        axios
          .post("http://localhost:3000/api/rooms/create", room, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchRooms();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Room has been created",
              life: 3000,
            });
            setRoomDialog(false);
            setRoom(emptyRoom);
          })
          .catch((error) => console.error("Error creating room:", error));
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

  const editRoom = (roomData) => {
    setRoom({ ...roomData });
    setRoomDialog(true);
  };

  const confirmDeleteRoom = (roomData) => {
    setRoom(roomData);
    setDeleteRoomDialog(true);
  };

  const deleteRoom = () => {
    console.log("Room:", room);

    axios
      .delete(`http://localhost:3000/api/rooms/delete/${room.RoomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        fetchRooms();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Room Deleted",
          life: 3000,
        });
        setDeleteRoomDialog(false);
        setRoom(emptyRoom);
      })
      .catch((error) => console.error("Error deleting room:", error));
  };

  const confirmDeleteSelected = () => setDeleteRoomsDialog(true);

  const deleteSelectedRooms = () => {
    let _rooms = rooms.filter((val) => !selectedRooms.includes(val));
    setRooms(_rooms);
    setDeleteRoomsDialog(false);
    setSelectedRooms(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Rooms Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => rooms.findIndex((r) => r.RoomId === id);
  const createId = () => Math.floor(Math.random() * 100000);

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    let _room = { ...room };
    _room[name] = val;
    setRoom(_room);
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
        disabled={!selectedRooms || !selectedRooms.length}
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
        onClick={() => editRoom(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteRoom(rowData)}
      />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Rooms</h5>
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

  const roomDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveRoom} />
    </>
  );

  const deleteRoomDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteRoomDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteRoom} />
    </>
  );

  const deleteRoomsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteRoomsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedRooms}
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
            value={rooms}
            selection={selectedRooms}
            onSelectionChange={(e) => setSelectedRooms(e.value)}
            dataKey="RoomId"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="RoomId" header="Room ID" sortable />
            <Column field="RoomTypeId" header="Room Type" sortable />
            <Column
              field="Price"
              header="Price"
              body={(rowData) => `$${rowData.Price}`}
              sortable
            />
            <Column field="NumberOfFloor" header="Floor" sortable />
            <Column
              field="Status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
            <Column field="Description" header="Description" sortable />
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
            visible={roomDialog}
            style={{ width: "450px" }}
            header="Room Details"
            modal
            className="p-fluid"
            footer={roomDialogFooter}
            onHide={hideDialog}
          >
            <div className="p-field">
              <label htmlFor="RoomId">Room ID</label>
              <InputNumber
                id="RoomId"
                value={room.RoomId}
                onChange={(e) => onInputChange(e, "RoomId")}
                placeholder="Room ID"
                disabled
              />
            </div>
            <div className="p-field">
              <label htmlFor="RoomTypeId">Room Type ID</label>
              <InputNumber
                id="RoomTypeId"
                value={room.RoomTypeId}
                onChange={(e) => onInputChange(e, "RoomTypeId")}
                placeholder="Room Type ID"
                className={classNames({
                  "p-invalid": submitted && !room.RoomTypeId,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="Price">Price</label>
              <InputNumber
                id="Price"
                value={room.Price}
                onChange={(e) => onInputChange(e, "Price")}
                mode="currency"
                currency="USD"
                locale="en-US"
                placeholder="Price"
                className={classNames({
                  "p-invalid": submitted && !room.Price,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="NumberOfFloor">Number Of Floor</label>
              <InputNumber
                id="NumberOfFloor"
                value={room.NumberOfFloor}
                onChange={(e) => onInputChange(e, "NumberOfFloor")}
                placeholder="Number Of Floor"
                className={classNames({
                  "p-invalid": submitted && !room.NumberOfFloor,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="Status">Status</label>
              <InputText
                id="Status"
                value={room.Status}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Status"
                className={classNames({
                  "p-invalid": submitted && !room.Status,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="Description">Description</label>
              <InputText
                id="Description"
                value={room.Description}
                onChange={(e) => onInputChange(e, "Description")}
                placeholder="Description"
                rows={3}
                className={classNames({
                  "p-invalid": submitted && !room.Description,
                })}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteRoomDialog}
            header="Confirm"
            modal
            footer={deleteRoomDialogFooter}
            onHide={hideDeleteRoomDialog}
          ></Dialog>

          <Dialog
            visible={deleteRoomsDialog}
            header="Confirm"
            modal
            footer={deleteRoomsDialogFooter}
            onHide={hideDeleteRoomsDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {room && (
                <span>Are you sure you want to delete the selected rooms?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
