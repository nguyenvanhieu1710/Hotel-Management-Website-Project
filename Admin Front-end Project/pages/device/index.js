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

const Device = () => {
  let emptyDevice = {
    DeviceId: 0,
    DeviceName: "",
    DeviceTypeId: "",
    RoomId: "",
    DeviceImage: "",
    Price: "",
    Status: "",
    Description: "",
    Deleted: false,
  };

  const [token, setToken] = useState(null);
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState(emptyDevice);
  const [selectedDevices, setSelectedDevices] = useState(null);
  const [deviceDialog, setDeviceDialog] = useState(false);
  const [deleteDeviceDialog, setDeleteDeviceDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchDevices();
      fetchDeviceTypes();
      fetchRooms();
    }
  }, [token, lazyParams]);

  const fetchDevices = () => {
    setLoading(true);
    const page = Math.floor(lazyParams.first / lazyParams.rows) + 1;

    axios
      .get("http://localhost:3000/api/device", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: lazyParams.rows,
        },
      })
      .then((response) => {
        console.log("Device API Response:", response.data);
        // Backend returns { success: true, data: [...], pagination: {...} }
        if (response.data.success && response.data.data) {
          setDevices(response.data.data);
          setTotalRecords(
            response.data.pagination?.total || response.data.data.length
          );
        } else {
          // Fallback for old format
          setDevices(Array.isArray(response.data) ? response.data : []);
          setTotalRecords(response.data.length || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setDevices([]);
        setTotalRecords(0);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching device data",
          life: 3000,
        });
      });
  };

  const onPage = (event) => {
    setLazyParams({
      ...lazyParams,
      first: event.first,
      rows: event.rows,
    });
  };

  const fetchDeviceTypes = () => {
    axios
      .get("http://localhost:3000/api/device-type/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Device Types Response:", response.data);
        const deviceTypesData = response.data.success
          ? response.data.data
          : response.data;
        setDeviceTypes(Array.isArray(deviceTypesData) ? deviceTypesData : []);
      })
      .catch((error) => {
        console.error("Error fetching device types:", error);
        setDeviceTypes([]);
      });
  };

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/room", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Rooms Response:", response.data);
        const roomsData = response.data.success
          ? response.data.data
          : response.data;
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        setRooms([]);
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
      !device.Description?.trim() ||
      !device.DeviceImage?.trim()
    ) {
      return false;
    }
    return true;
  };

  const saveDevice = () => {
    setSubmitted(true);

    if (validateDevice()) {
      // Only include fields that belong to Device table
      const deviceData = {
        DeviceName: device.DeviceName,
        DeviceTypeId: device.DeviceTypeId,
        RoomId: device.RoomId,
        DeviceImage: device.DeviceImage,
        Price: device.Price,
        Status: device.Status,
        Description: device.Description,
      };

      if (device.DeviceId !== 0) {
        // Update existing device (PUT request)
        console.log("Updating device:", deviceData);
        axios
          .put(
            `http://localhost:3000/api/device/${device.DeviceId}`,
            deviceData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            console.log("Update response:", response.data);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.data.message || "Device Updated",
              life: 3000,
            });
            fetchDevices();
            setDeviceDialog(false);
            setDevice(emptyDevice);
          })
          .catch((error) => {
            console.error(
              "Update error:",
              error.response?.data || error.message
            );
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: error.response?.data?.message || "Error updating device",
              life: 3000,
            });
          });
      } else {
        // Add new device (POST request)
        console.log("Creating device:", deviceData);
        axios
          .post("http://localhost:3000/api/device", deviceData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log("Create response:", response.data);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.data.message || "Device Created",
              life: 3000,
            });
            fetchDevices();
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
    console.log("Deleting device:", device);

    axios
      .delete(`http://localhost:3000/api/device/${device.DeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Delete response:", response.data);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message || "Device Deleted",
          life: 3000,
        });
        fetchDevices();
        setDeleteDeviceDialog(false);
        setDevice(emptyDevice);
      })
      .catch((error) => {
        console.error("Delete error:", error.response?.data || error.message);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Error deleting device",
          life: 3000,
        });
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

  const onDeviceTypesChange = (e) => {
    let _device = { ...device };
    _device.DeviceTypeId = e.value;
    setDevice(_device);
  };

  const onRoomsChange = (e) => {
    let _device = { ...device };
    _device.RoomId = e.value;
    setDevice(_device);
  };

  const deleteSelectedDeviceTypes = () => {
    const idsToDelete = selectedDeviceTypes.map((item) => item.DeviceTypeId);
    axios
      .post(`http://localhost:3000/api/device/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        setDevice((prev) => ({ ...prev, DeviceImage: data.link }));
      } else {
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
        onClick={deleteSelectedDeviceTypes}
        disabled={!selectedDevices || !selectedDevices.length}
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
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          />

          <DataTable
            value={devices}
            selection={selectedDevices}
            onSelectionChange={(e) => setSelectedDevices(e.value)}
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            header="Device Management"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="DeviceId" header="Device ID" sortable />
            <Column field="DeviceName" header="Device Name" sortable />
            <Column
              field="DeviceTypeId"
              header="Device Type"
              sortable
              body={(rowData) => {
                const deviceType = deviceTypes.find(
                  (type) => type.DeviceTypeId === rowData.DeviceTypeId
                );
                return deviceType ? deviceType.DeviceTypeName : "Unknown";
              }}
            />

            <Column
              field="RoomId"
              header="Room"
              sortable
              body={(rowData) => {
                const room = rooms.find(
                  (room) => room.RoomId === rowData.RoomId
                );
                return room ? `Room ${room.RoomId} - ${room.Price}` : "Unknown";
              }}
            />

            <Column
              field="DeviceImage"
              header="Image"
              body={(rowData) => (
                <img
                  src={rowData.DeviceImage}
                  alt="Device"
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  referrerPolicy="no-referrer"
                />
              )}
              sortable
            />
            <Column
              field="Price"
              header="Price"
              sortable
              body={(rowData) => `$${parseInt(rowData.Price)}`}
            />
            <Column field="Description" header="Description" sortable />
            <Column field="Status" header="Status" sortable />
            {/* <Column field="Deleted" header="Deleted" sortable /> */}
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: "10rem" }}
            />
          </DataTable>

          {/* Dialog Add/Edit */}
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
                placeholder="Please enter a device name"
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="DeviceTypeId">Device Type</label>
              <Dropdown
                id="DeviceTypeId"
                value={device.DeviceTypeId}
                options={deviceTypes}
                onChange={onDeviceTypesChange}
                optionLabel="DeviceTypeName"
                optionValue="DeviceTypeId"
                placeholder="Select Device Type"
                className={classNames({
                  "p-invalid": submitted && !device.DeviceTypeId,
                })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="RoomId">Room</label>
              <Dropdown
                id="RoomId"
                value={device.RoomId}
                options={rooms}
                onChange={onRoomsChange}
                optionLabel={(option) =>
                  `Room ${option.RoomId} - ${option.Price}`
                }
                optionValue="RoomId"
                placeholder="Select Room"
                className={classNames({
                  "p-invalid": submitted && !device.RoomId,
                })}
                required
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
                required
                placeholder="Please enter price"
                showButtons
              />
            </div>
            <div className="field">
              <label htmlFor="Status">Status</label>
              <Dropdown
                id="Status"
                value={device.Status}
                options={["Working", "Broken"]}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Select Status"
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
                required
                placeholder="Please enter a description"
              />
            </div>
            <div className="p-field">
              <label htmlFor="DeviceImage">Device Image</label>
              <img
                src={
                  device.DeviceImage && device.DeviceImage !== "null"
                    ? device.DeviceImage
                    : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
                }
                alt="Device"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
                referrerPolicy="no-referrer"
              />

              <FileUpload
                mode="basic"
                name="DeviceImage"
                accept="image/*"
                customUpload
                auto
                chooseLabel="Upload Image"
                uploadHandler={(e) => onImageUpload(e)}
                className="p-mt-2"
              />
            </div>
          </Dialog>

          {/* Delete Confirmation Dialog */}
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
