import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";

export default function Service() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({
    ServiceId: 0,
    ServiceName: "",
    ServiceTypeId: 0,
    ServiceImage: "",
    Price: 0,
    Description: "",
    Deleted: false,
  });
  const [serviceDialog, setServiceDialog] = useState(false);
  const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const toast = useRef(null);
  const [token, setToken] = useState(null);

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
      life: 3000,
    });
  };

  const onPage = (event) => {
    setLazyParams({
      ...lazyParams,
      first: event.first,
      rows: event.rows,
    });
  };

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchServices();
      fetchServiceTypes();
    }
  }, [token, lazyParams]);

  const fetchServices = () => {
    setLoading(true);
    const page = Math.floor(lazyParams.first / lazyParams.rows) + 1;

    axios
      .get("http://localhost:3000/api/service", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: lazyParams.rows,
        },
      })
      .then((response) => {
        console.log("Service API Response:", response.data);
        // Backend returns { success: true, data: [...], pagination: {...} }
        if (response.data.success && response.data.data) {
          setServices(response.data.data);
          setTotalRecords(
            response.data.pagination?.total || response.data.data.length
          );
        } else {
          // Fallback for old format
          setServices(Array.isArray(response.data) ? response.data : []);
          setTotalRecords(response.data.length || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setServices([]);
        setTotalRecords(0);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching service data",
          life: 3000,
        });
      });
  };

  const fetchServiceTypes = () => {
    axios
      .get(`http://localhost:3000/api/service-type`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }, // Get all service types for dropdown
      })
      .then((response) => {
        console.log("Service Type API Response:", response.data);
        if (response.data.success && response.data.data) {
          setServiceTypes(response.data.data);
        } else {
          setServiceTypes(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch((err) => {
        console.error("Error fetching service types:", err);
        setServiceTypes([]);
      });
  };

  const openNew = () => {
    setService({
      ServiceId: 0,
      ServiceName: "",
      ServiceTypeId: 0,
      ServiceImage: "",
      Price: 0,
      Description: "",
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

    // Filter data to only include Service table fields
    const serviceData = {
      ServiceName: service.ServiceName,
      ServiceTypeId: service.ServiceTypeId,
      ServiceImage: service.ServiceImage || "",
      Price: parseFloat(service.Price) || 0,
      Description: service.Description || "",
    };

    if (service.ServiceId === 0) {
      console.log("Creating new service: ", serviceData);
      axios
        .post(`http://localhost:3000/api/service`, serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          fetchServices();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: response.data.message || "Service Created",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error creating service:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error creating service",
            life: 3000,
          });
        });
    } else {
      console.log("Updating service: ", serviceData);
      axios
        .put(
          `http://localhost:3000/api/service/${service.ServiceId}`,
          serviceData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          fetchServices();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: response.data.message || "Service Updated",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error updating service:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || "Error updating service",
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
      .delete(`http://localhost:3000/api/service/${service.ServiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        fetchServices();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message || "Service Deleted",
          life: 3000,
        });
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Error deleting service",
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

  const onServiceTypeChange = (e) => {
    setService({ ...service, ServiceTypeId: e.target.value });
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
        setService((prev) => ({ ...prev, ServiceImage: data.link }));
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
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Service Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="ServiceId" header="Service ID" sortable />
        <Column field="ServiceName" header="Service Name" sortable />
        <Column
          field="ServiceTypeId"
          header="Service Type Id"
          sortable
          body={(rowData) => {
            const serviceType = serviceTypes.find(
              (type) => type.ServiceTypeId === rowData.ServiceTypeId
            );
            return serviceType ? serviceType.ServiceTypeName : "Unknown";
          }}
        />
        <Column
          field="ServiceImage"
          header="Image"
          body={(rowData) => (
            <img
              src={rowData.ServiceImage}
              alt="Service"
              style={{ width: "50px", height: "50px", borderRadius: "5px" }}
              referrerPolicy="no-referrer"
            />
          )}
          sortable
        />
        <Column field="Description" header="Description" sortable />
        <Column
          field="Price"
          header="Price"
          sortable
          body={(rowData) => Number(rowData.Price).toLocaleString() + " USD"}
        />
        {/* <Column
          field="Deleted"
          header="Deleted"
          sortable
          body={(rowData) => (rowData.Deleted ? "Deleted" : "Active")}
        /> */}
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
            placeholder="Please enter a service name"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="ServiceTypeId">Service Type</label>
          <Dropdown
            id="ServiceTypeId"
            value={service.ServiceTypeId}
            options={serviceTypes}
            onChange={onServiceTypeChange}
            required
            optionLabel="ServiceTypeName"
            optionValue="ServiceTypeId"
            placeholder="Select a Service Type"
          />
        </div>
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputText
            id="Description"
            value={service.Description}
            placeholder="Please enter a description"
            onChange={(e) =>
              setService({ ...service, Description: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="Price">Price</label>
          <InputNumber
            id="Price"
            value={service.Price}
            placeholder="Please enter a price"
            onChange={(e) =>
              setService({ ...service, Price: parseFloat(e.value) || 0 })
            }
            required
            showButtons
          />
        </div>
        <div className="p-field">
          <label htmlFor="ServiceImage">Service Image</label>
          <img
            src={
              service.ServiceImage && service.ServiceImage !== "null"
                ? service.ServiceImage
                : "https://didongviet.vn/dchannel/wp-content/uploads/2022/10/demo-la-gi-3-didongviet.jpg"
            }
            alt="Service"
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
            name="ServiceImage"
            accept="image/*"
            customUpload
            auto
            chooseLabel="Upload Image"
            uploadHandler={(e) => onImageUpload(e)}
            className="p-mt-2"
          />
        </div>
      </Dialog>

      {/* Dialog confirm delete */}
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
