import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function Room() {
  let emptyRoom = {
    RoomId: 0,
    RoomTypeId: 0,
    RoomImage: "",
    Price: "",
    NumberOfFloor: 0,
    MaximumNumberOfGuests: 0,
    Status: "",
    Description: "",
    RoomArea: 0,
    Amenities: "",
    RoomDetail: "",
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
  const [roomTypes, setRoomTypes] = useState([]);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/rooms/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  const fetchRoomTypes = () => {
    axios
      .get("http://localhost:3000/api/room-type/get-all")
      .then((response) => {
        setRoomTypes(response.data);
      })
      .catch((error) => {
        console.error("Error when get room types:", error);
      });
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
    if (!room.Description) return false;
    if (!room.RoomImage) return false;
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

  const onRoomTypeChange = (e) => {
    onInputChange({ value: e.value }, "RoomTypeId");
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
        setRoom((prev) => ({ ...prev, RoomImage: data.link }));
      } else {
        alert("Upload failed! No image link returned.");
      }
    } catch (error) {
      alert("Please try again");
    }
  }

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
            <Column field="RoomTypeId" header="Room Type Id" sortable />
            <Column
              field="RoomImage"
              header="Image"
              body={(rowData) => (
                <img
                  src={rowData.RoomImage}
                  alt="Room"
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  referrerpolicy="no-referrer"
                />
              )}
              sortable
            />
            <Column
              field="Price"
              header="Price"
              body={(rowData) => `$${rowData.Price}`}
              sortable
            />
            <Column field="NumberOfFloor" header="Floor" sortable />
            <Column
              field="MaximumNumberOfGuests"
              header="MaximumNumberOfGuests"
              sortable
            />
            <Column
              field="Status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
            <Column field="Description" header="Description" sortable />
            <Column field="RoomArea" header="RoomArea" sortable />
            <Column field="Amenities" header="Amenities" sortable />
            <Column field="RoomDetail" header="RoomDetail" sortable />
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
              <label htmlFor="RoomTypeId">Room Type Id</label>
              <Dropdown
                id="RoomTypeId"
                value={room.RoomTypeId}
                options={roomTypes}
                onChange={onRoomTypeChange}
                optionLabel="RoomTypeId"
                optionValue="RoomTypeId"
                placeholder="Select Room Type"
                className={classNames({
                  "p-invalid": submitted && !room.RoomTypeId,
                })}
                required
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
                placeholder="Please enter price"
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
                placeholder="Please enter a number of floor"
                className={classNames({
                  "p-invalid": submitted && !room.NumberOfFloor,
                })}
                required
              />
            </div>
            <div className="field">
              <label>Maximum Guests</label>
              <InputNumber
                value={room.MaximumNumberOfGuests}
                onChange={(e) => onInputChange(e, "MaximumNumberOfGuests")}
                placeholder="Please enter a number of maximum guests"
                className={classNames({
                  "p-invalid": submitted && !room.MaximumNumberOfGuests,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Status">Status</label>
              <Dropdown
                inputId="Status"
                value={room.Status}
                options={[
                  { label: "Available", value: "Available" },
                  { label: "Occupied", value: "Occupied" },
                  { label: "Maintenance", value: "Maintenance" },
                ]}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Select a Status"
                className={classNames({
                  "p-invalid": submitted && !room.Status,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Description">Description</label>
              <InputText
                id="Description"
                value={room.Description}
                onChange={(e) => onInputChange(e, "Description")}
                placeholder="Please enter a description"
                rows={3}
                className={classNames({
                  "p-invalid": submitted && !room.Description,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="RoomArea">Room Area</label>
              <InputNumber
                id="RoomArea"
                value={room.RoomArea}
                onChange={(e) => onInputChange(e, "RoomArea")}
                placeholder="Please enter Room Area"
                className={classNames({
                  "p-invalid": submitted && !room.RoomArea,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Amenities">Amenities</label>
              <InputText
                id="Amenities"
                value={room.Amenities}
                onChange={(e) => onInputChange(e, "Amenities")}
                placeholder="Please enter amenities"
                required
                rows={3}
                className={classNames({
                  "p-invalid": submitted && !room.Amenities,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="RoomDetail">Room Detail</label>
              <InputText
                id="RoomDetail"
                value={room.RoomDetail}
                onChange={(e) => onInputChange(e, "RoomDetail")}
                placeholder="Please enter room details"
                required
                rows={3}
                className={classNames({
                  "p-invalid": submitted && !room.RoomDetail,
                })}
              />
            </div>
            <div className="p-field">
              <label htmlFor="RoomImage">Room Image</label>
              <img
                src={
                  room.RoomImage && room.RoomImage !== "null"
                    ? room.RoomImage
                    : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
                }
                alt="Room"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
                referrerpolicy="no-referrer"
              />

              <FileUpload
                mode="basic"
                name="RoomImage"
                accept="image/*"
                customUpload
                auto
                chooseLabel="Upload Image"
                uploadHandler={(e) => onImageUpload(e)}
                className="p-mt-2"
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
