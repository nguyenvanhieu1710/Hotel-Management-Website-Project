import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function Room() {
  let emptyRoom = {
    RoomId: 0,
    RoomName: "",
    Status: "",
  };

  const token = "YOUR_API_TOKEN_HERE"; // Thay token thật của bạn vào đây
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

  const saveRoom = () => {
    setSubmitted(true);
    if (room.RoomName.trim()) {
      let _rooms = [...rooms];
      let _room = { ...room };

      if (_room.RoomId !== 0) {
        const index = findIndexById(_room.RoomId);
        _rooms[index] = _room;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Room Updated",
          life: 3000,
        });
      } else {
        _room.RoomId = createId();
        _rooms.push(_room);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Room Created",
          life: 3000,
        });
      }

      setRooms(_rooms);
      setRoomDialog(false);
      setRoom(emptyRoom);
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
    let _rooms = rooms.filter((val) => val.RoomId !== room.RoomId);
    setRooms(_rooms);
    setDeleteRoomDialog(false);
    setRoom(emptyRoom);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Room Deleted",
      life: 3000,
    });
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
    const val = e.target.value;
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

  const roomNameBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Room Name</span>
      {rowData.RoomName}
    </>
  );

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
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="RoomName"
              header="Room Name"
              body={roomNameBodyTemplate}
            ></Column>
            <Column
              field="Status"
              header="Status"
              body={statusBodyTemplate}
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
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
            <InputText
              id="RoomName"
              value={room.RoomName}
              onChange={(e) => onInputChange(e, "RoomName")}
              placeholder="Room Name"
              className={classNames({
                "p-invalid": submitted && !room.RoomName,
              })}
            />
            <InputText
              id="Status"
              value={room.Status}
              onChange={(e) => onInputChange(e, "Status")}
              placeholder="Status"
            />
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
