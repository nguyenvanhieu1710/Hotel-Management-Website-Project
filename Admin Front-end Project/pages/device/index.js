import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

const Device = () => {
  let emptyDevice = {
    DeviceId: 0,
    DeviceName: "",
    DeviceTypeId: "",
    RoomId: "",
    Price: "",
    Status: "",
    Description: "",
    Deleted: false,
  };

  const token = "YOUR_TOKEN_HERE";

  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState(emptyDevice);
  const [selectedDevices, setSelectedDevices] = useState(null);
  const [deviceDialog, setDeviceDialog] = useState(false);
  const [deleteDeviceDialog, setDeleteDeviceDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = () => {
    axios
      .get("http://localhost:3000/api/device/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });
  };

  const openNew = () => {
    setDevice(emptyDevice);
    setSubmitted(false);
    setDeviceDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDeviceDialog(false);
  };

  const hideDeleteDeviceDialog = () => {
    setDeleteDeviceDialog(false);
  };

  const validateDevice = () => {
    if (
      !device.DeviceName?.trim() ||
      !String(device.DeviceTypeId).trim() ||
      !String(device.RoomId).trim() ||
      device.Price === "" ||
      device.Price === null ||
      !device.Status?.trim() ||
      !device.Description?.trim()
    ) {
      return false;
    }
    return true;
  };

  const saveDevice = () => {
    setSubmitted(true);

    if (validateDevice()) {
      if (device.DeviceId !== 0) {
        // Update existing device (PUT request)
        console.log("Updating device: ", device);
        device.Deleted = false;
        axios
          .put("http://localhost:3000/api/device/update", device, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchDevices();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Device has been updated",
              life: 3000,
            });
            setDeviceDialog(false);
            setDevice(emptyDevice);
          })
          .catch((error) => console.error("Error updating device:", error));
      } else {
        // Add new device (POST request)
        console.log("Creating device: ", device);
        device.Deleted = false;
        axios
          .post("http://localhost:3000/api/device/create", device, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchDevices();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Device has been created",
              life: 3000,
            });
            setDeviceDialog(false);
            setDevice(emptyDevice);
          })
          .catch((error) => console.error("Error creating device:", error));
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

  const editDevice = (deviceData) => {
    setDevice({ ...deviceData });
    setDeviceDialog(true);
  };

  const confirmDeleteDevice = (deviceData) => {
    setDevice(deviceData);
    setDeleteDeviceDialog(true);
  };

  const deleteDevice = () => {
    let _devices = devices.filter((val) => val.DeviceId !== device.DeviceId);
    setDevices(_devices);
    setDeleteDeviceDialog(false);
    setDevice(emptyDevice);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Device Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    return devices.findIndex((d) => d.DeviceId === id);
  };

  const createId = () => {
    return Math.floor(Math.random() * 100000);
  };

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    if (name === "Price") {
    }
    let _device = { ...device };
    _device[name] = val;
    setDevice(_device);
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
    </div>
  );

  const deviceNameBodyTemplate = (rowData) => <>{rowData.DeviceName}</>;
  const deviceTypeBodyTemplate = (rowData) => <>{rowData.DeviceType}</>;
  const statusBodyTemplate = (rowData) => <>{rowData.Status}</>;

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => editDevice(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteDevice(rowData)}
      />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Devices</h5>
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

  const deviceDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveDevice} />
    </>
  );

  const deleteDeviceDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteDeviceDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteDevice} />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate} />

          <DataTable
            value={devices}
            selection={selectedDevices}
            onSelectionChange={(e) => setSelectedDevices(e.value)}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            header="Device Management"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="DeviceId" header="Device ID" sortable />
            <Column field="DeviceName" header="Device Name" sortable />
            <Column field="DeviceTypeId" header="Device Type ID" sortable />
            <Column field="RoomId" header="Room ID" sortable />
            <Column field="Price" header="Price" sortable />
            <Column field="Status" header="Status" sortable />
            <Column field="Description" header="Description" sortable />
            <Column field="Deleted" header="Deleted" sortable />
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: "10rem" }}
            />
          </DataTable>

          <Dialog
            visible={deviceDialog}
            style={{ width: "450px" }}
            header="Device Details"
            modal
            className="p-fluid"
            footer={deviceDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="DeviceName">Device Name</label>
              <InputText
                id="DeviceName"
                value={device.DeviceName}
                onChange={(e) => onInputChange(e, "DeviceName")}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="DeviceTypeId">Device Type Id</label>
              <InputNumber
                id="DeviceTypeId"
                value={device.DeviceTypeId}
                onChange={(e) => onInputChange(e, "DeviceTypeId")}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="RoomId">Room Id</label>
              <InputNumber
                id="RoomId"
                value={device.RoomId}
                onChange={(e) => onInputChange(e, "RoomId")}
              />
            </div>
            <div className="field">
              <label htmlFor="Price">Price</label>
              <InputNumber
                id="Price"
                value={device.Price}
                onValueChange={(e) => onInputChange(e, "Price")}
                mode="currency"
                currency="USD"
                locale="en-US"
              />
            </div>
            <div className="field">
              <label htmlFor="Status">Status</label>
              <InputText
                id="Status"
                value={device.Status}
                onChange={(e) => onInputChange(e, "Status")}
              />
            </div>
            <div className="field">
              <label htmlFor="Description">Description</label>
              <InputText
                id="Description"
                value={device.Description}
                onChange={(e) => onInputChange(e, "Description")}
                rows={3}
                cols={20}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteDeviceDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteDeviceDialogFooter}
            onHide={hideDeleteDeviceDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {device && (
                <span>
                  Are you sure you want to delete <b>{device.DeviceName}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Device;
