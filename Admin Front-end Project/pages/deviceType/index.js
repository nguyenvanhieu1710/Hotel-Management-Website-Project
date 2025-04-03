import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function DeviceType() {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceType, setDeviceType] = useState({
    DeviceTypeId: 0,
    DeviceTypeName: "",
    Description: "",
    Deleted: false,
  });
  const [deviceTypeDialog, setDeviceTypeDialog] = useState(false);
  const [deleteDeviceTypeDialog, setDeleteDeviceTypeDialog] = useState(false);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = "";

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = () => {
    axios
      .get(`http://localhost:3000/api/device-type/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDeviceTypes(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setDeviceType({
      DeviceTypeId: 0,
      DeviceTypeName: "",
      Description: "",
      Deleted: false,
    });
    setDeviceTypeDialog(true);
  };

  const hideDialog = () => setDeviceTypeDialog(false);
  const hideDeleteDialog = () => setDeleteDeviceTypeDialog(false);

  const validateDeviceType = () => {
    let errors = [];

    if (!deviceType.DeviceTypeName.trim()) {
      errors.push("Device Type Name is required.");
    }

    if (!deviceType.Description.trim()) {
      errors.push("Description is required.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: error,
          life: 3000,
        });
      });
      return false;
    }

    return true;
  };

  const saveDeviceType = () => {
    if (!validateDeviceType()) {
      return;
    }

    if (deviceType.DeviceTypeId === 0) {
      console.log("Creating Device Type: ", deviceType);
      deviceType.Deleted = false;
      axios
        .post(`http://localhost:3000/api/device-type/create`, deviceType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchDeviceTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Device Type Created",
            life: 3000,
          });
        });
    } else {
      console.log("Updating Device Type: ", deviceType);
      deviceType.Deleted = false;
      axios
        .put(`http://localhost:3000/api/device-type/update`, deviceType, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchDeviceTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Device Type Updated",
            life: 3000,
          });
        });
    }
    setDeviceTypeDialog(false);
  };

  const editDeviceType = (rowData) => {
    setDeviceType({ ...rowData });
    setDeviceTypeDialog(true);
  };

  const confirmDeleteDeviceType = (rowData) => {
    setDeviceType(rowData);
    setDeleteDeviceTypeDialog(true);
  };

  const deleteDeviceType = () => {
    axios
      .delete(
        `http://localhost:3000/api/devicetype/delete/${deviceType.DeviceTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchDeviceTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Device Type Deleted",
          life: 3000,
        });
      });
    setDeleteDeviceTypeDialog(false);
  };

  const deleteSelectedDeviceTypes = () => {
    const idsToDelete = selectedDeviceTypes.map((item) => item.DeviceTypeId);
    axios
      .post(
        `http://localhost:3000/api/devicetype/delete-multiple`,
        idsToDelete,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchDeviceTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Device Types Deleted",
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
        onClick={deleteSelectedDeviceTypes}
        disabled={!selectedDeviceTypes || !selectedDeviceTypes.length}
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
        onClick={() => editDeviceType(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteDeviceType(rowData)}
      />
    </div>
  );

  const deviceTypeDialogFooter = (
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
        onClick={saveDeviceType}
      />
    </div>
  );

  const deleteDeviceTypeDialogFooter = (
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
        onClick={deleteDeviceType}
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
        value={deviceTypes}
        selection={selectedDeviceTypes}
        onSelectionChange={(e) => setSelectedDeviceTypes(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Device Type Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="DeviceTypeId" header="Device Type ID" sortable />
        <Column field="DeviceTypeName" header="Device Type Name" sortable />
        <Column field="Description" header="Description" sortable />
        <Column field="Deleted" header="Deleted" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      {/* Dialog Add/Edit */}

      <Dialog
        visible={deviceTypeDialog}
        style={{ width: "450px" }}
        header="Device Type Details"
        modal
        className="p-fluid"
        footer={deviceTypeDialogFooter}
        onHide={hideDialog}
      >
        {/* Device Type Name */}
        <div className="field">
          <label htmlFor="DeviceTypeName">Device Type Name</label>
          <InputText
            id="DeviceTypeName"
            value={deviceType.DeviceTypeName}
            onChange={(e) =>
              setDeviceType({ ...deviceType, DeviceTypeName: e.target.value })
            }
            required
            autoFocus
            placeholder="Please enter a device name"
            className={deviceType.DeviceTypeName ? "" : "p-invalid"}
          />
          {!deviceType.DeviceTypeName && (
            <small className="p-error">Device Type Name is required.</small>
          )}
        </div>

        {/* Description */}
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputText
            id="Description"
            value={deviceType.Description}
            onChange={(e) =>
              setDeviceType({ ...deviceType, Description: e.target.value })
            }
            placeholder="Please enter description"
            required
            className={deviceType.Description ? "" : "p-invalid"}
          />
          {!deviceType.Description && (
            <small className="p-error">Description is required.</small>
          )}
        </div>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog
        visible={deleteDeviceTypeDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteDeviceTypeDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {deviceType && (
            <span>
              Are you sure you want to delete <b>{deviceType.DeviceTypeName}</b>
              ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
