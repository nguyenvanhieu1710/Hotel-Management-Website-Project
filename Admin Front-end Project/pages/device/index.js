import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

const Device = () => {
  let emptyDevice = {
    DeviceId: 0,
    DeviceName: "",
    DeviceType: "",
    Status: "",
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

  const saveDevice = () => {
    setSubmitted(true);

    if (device.DeviceName.trim() !== "" && device.DeviceType.trim() !== "") {
      let _devices = [...devices];
      let _device = { ...device };

      if (_device.DeviceId !== 0) {
        const index = findIndexById(_device.DeviceId);
        _devices[index] = _device;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Device Updated",
          life: 3000,
        });
      } else {
        _device.DeviceId = createId();
        _devices.push(_device);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Device Created",
          life: 3000,
        });
      }

      setDevices(_devices);
      setDeviceDialog(false);
      setDevice(emptyDevice);
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
    const val = e.target.value;
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
            ref={dt}
            value={devices}
            selection={selectedDevices}
            onSelectionChange={(e) => setSelectedDevices(e.value)}
            dataKey="DeviceId"
            paginator
            rows={10}
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="DeviceName"
              header="Device Name"
              body={deviceNameBodyTemplate}
              sortable
            ></Column>
            <Column
              field="DeviceType"
              header="Device Type"
              body={deviceTypeBodyTemplate}
              sortable
            ></Column>
            <Column
              field="Status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
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
              <label htmlFor="DeviceType">Device Type</label>
              <InputText
                id="DeviceType"
                value={device.DeviceType}
                onChange={(e) => onInputChange(e, "DeviceType")}
                required
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
