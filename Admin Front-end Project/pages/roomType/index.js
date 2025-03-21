import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function RoomType() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomType, setRoomType] = useState({
    RoomTypeId: 0,
    RoomTypeName: "",
    MaximumNumberOfGuests: 0,
    Description: "",
    Deleted: false,
  });
  const [roomTypeDialog, setRoomTypeDialog] = useState(false);
  const [deleteRoomTypeDialog, setDeleteRoomTypeDialog] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = () => {
    axios
      .get(`http://localhost:3000/api/room-type/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRoomTypes(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setRoomType({
      RoomTypeId: 0,
      RoomTypeName: "",
      MaximumNumberOfGuests: 0,
      Description: "",
      Deleted: false,
    });
    setRoomTypeDialog(true);
  };

  const hideDialog = () => setRoomTypeDialog(false);
  const hideDeleteDialog = () => setDeleteRoomTypeDialog(false);

  const saveRoomType = () => {
    if (roomType.RoomTypeId === 0) {
      console.log("Creating room type");
      console.log(roomType);
      roomType.Deleted = false;
      axios
        .post(`http://localhost:3000/api/room-type/create`, roomType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchRoomTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Room Type Created",
            life: 3000,
          });
          setRoomTypeDialog(false);
        });
    } else {
      console.log("Updating room type");
      console.log(roomType);
      roomType.Deleted = false;
      axios
        .put(`http://localhost:3000/api/room-type/update`, roomType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchRoomTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Room Type Updated",
            life: 3000,
          });
          setRoomTypeDialog(false);
        });
    }
  };

  const editRoomType = (rowData) => {
    setRoomType({ ...rowData });
    setRoomTypeDialog(true);
  };

  const confirmDeleteRoomType = (rowData) => {
    setRoomType(rowData);
    setDeleteRoomTypeDialog(true);
  };

  const deleteRoomType = () => {
    axios
      .delete(
        `http://localhost:3000/api/room-type/delete/${roomType.RoomTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchRoomTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Room Type Deleted",
          life: 3000,
        });
        setDeleteRoomTypeDialog(false);
      });
  };

  const deleteSelectedRoomTypes = () => {
    const idsToDelete = selectedRoomTypes.map((item) => item.RoomTypeId);
    axios
      .post(`http://localhost:3000/api/roomtype/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchRoomTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Room Types Deleted",
          life: 3000,
        });
        setSelectedRoomTypes([]);
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
        onClick={deleteSelectedRoomTypes}
        disabled={!selectedRoomTypes.length}
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
        onClick={() => editRoomType(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteRoomType(rowData)}
      />
    </div>
  );

  const roomTypeDialogFooter = (
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
        onClick={saveRoomType}
      />
    </div>
  );

  const deleteRoomTypeDialogFooter = (
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
        onClick={deleteRoomType}
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
        value={roomTypes}
        selection={selectedRoomTypes}
        onSelectionChange={(e) => setSelectedRoomTypes(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Room Type Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="RoomTypeId" header="ID" sortable />
        <Column field="RoomTypeName" header="Room Type Name" sortable />
        <Column field="MaximumNumberOfGuests" header="Max Guests" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          field="Deleted"
          header="Deleted"
          body={(rowData) => (rowData.Deleted ? "Yes" : "No")}
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
        visible={roomTypeDialog}
        style={{ width: "450px" }}
        header="Room Type Details"
        modal
        className="p-fluid"
        footer={roomTypeDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label>Room Type Name</label>
          <InputText
            value={roomType.RoomTypeName}
            onChange={(e) =>
              setRoomType({ ...roomType, RoomTypeName: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label>Maximum Guests</label>
          <InputNumber
            value={roomType.MaximumNumberOfGuests}
            onChange={(e) =>
              setRoomType({
                ...roomType,
                MaximumNumberOfGuests: e.value,
              })
            }
          />
        </div>
        <div className="field">
          <label>Description</label>
          <InputText
            value={roomType.Description}
            onChange={(e) =>
              setRoomType({ ...roomType, Description: e.target.value })
            }
          />
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteRoomTypeDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteRoomTypeDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          Bạn chắc chắn muốn xoá <b>{roomType.RoomTypeName}</b>?
        </div>
      </Dialog>
    </div>
  );
}
