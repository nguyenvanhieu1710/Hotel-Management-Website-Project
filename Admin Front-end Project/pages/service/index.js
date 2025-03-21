import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Service() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    ServiceId: 0,
    ServiceName: "",
    ServiceTypeId: 0,
    Price: 0,
    Description: "",
    Deleted: false,
  });
  const [serviceDialog, setServiceDialog] = useState(false);
  const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axios
      .get(`http://localhost:3000/api/service/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  };

  const openNew = () => {
    setService({
      ServiceId: 0,
      ServiceName: "",
      Description: "",
      Price: 0,
      Deleted: false,
    });
    setServiceDialog(true);
  };

  const hideDialog = () => setServiceDialog(false);
  const hideDeleteDialog = () => setDeleteServiceDialog(false);

  const validateService = () => {
    if (service.ServiceName.trim() === "" || service.Price === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Service name and price are required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const saveService = () => {
    if (!validateService()) return;

    if (service.ServiceId === 0) {
      console.log("Creating new service: ", service);
      service.Deleted = false;
      axios
        .post(`http://localhost:3000/api/service/create`, service, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchServices();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Service Created",
            life: 3000,
          });
        });
    } else {
      console.log("Updating new service: ", service);
      service.Deleted = false;
      axios
        .put(`http://localhost:3000/api/service/update`, service, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchServices();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Service Updated",
            life: 3000,
          });
        });
    }
    setServiceDialog(false);
  };

  const editService = (rowData) => {
    setService({ ...rowData });
    setServiceDialog(true);
  };

  const confirmDeleteService = (rowData) => {
    setService(rowData);
    setDeleteServiceDialog(true);
  };

  const deleteService = () => {
    axios
      .delete(`http://localhost:3000/api/service/delete/${service.ServiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchServices();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Service Deleted",
          life: 3000,
        });
      });
    setDeleteServiceDialog(false);
  };

  const deleteSelectedServices = () => {
    const idsToDelete = selectedServices.map((item) => item.ServiceId);
    axios
      .post(`http://localhost:3000/api/service/delete-multiple`, idsToDelete, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchServices();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Services Deleted",
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
        onClick={deleteSelectedServices}
        disabled={!selectedServices || !selectedServices.length}
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
        onClick={() => editService(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteService(rowData)}
      />
    </div>
  );

  const serviceDialogFooter = (
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
        onClick={saveService}
      />
    </div>
  );

  const deleteServiceDialogFooter = (
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
        onClick={deleteService}
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
        value={services}
        selection={selectedServices}
        onSelectionChange={(e) => setSelectedServices(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Service Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="ServiceId" header="Service ID" sortable />
        <Column field="ServiceName" header="Service Name" sortable />
        <Column field="ServiceTypeId" header="Service Type Id" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          field="Price"
          header="Price"
          sortable
          body={(rowData) => Number(rowData.Price).toLocaleString() + " USD"}
        />
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
        visible={serviceDialog}
        style={{ width: "450px" }}
        header="Service Details"
        modal
        className="p-fluid"
        footer={serviceDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="ServiceName">Service Name</label>
          <InputText
            id="ServiceName"
            value={service.ServiceName}
            onChange={(e) =>
              setService({ ...service, ServiceName: e.target.value })
            }
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="ServiceTypeId">Service Type Id</label>
          <InputText
            id="ServiceTypeId"
            value={service.ServiceTypeId}
            onChange={(e) =>
              setService({ ...service, ServiceTypeId: e.target.value })
            }
            required
          />
        </div>
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputText
            id="Description"
            value={service.Description}
            onChange={(e) =>
              setService({ ...service, Description: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="Price">Price</label>
          <InputText
            id="Price"
            value={service.Price}
            onChange={(e) =>
              setService({ ...service, Price: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </div>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog
        visible={deleteServiceDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteServiceDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {service && (
            <span>
              Are you sure you want to delete <b>{service.ServiceName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
