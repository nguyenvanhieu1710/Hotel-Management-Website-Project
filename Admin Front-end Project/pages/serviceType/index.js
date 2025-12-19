import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function ServiceType() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceType, setServiceType] = useState({
    ServiceTypeId: 0,
    ServiceTypeName: "",
    Description: "",
    Deleted: false,
  });
  const [serviceTypeDialog, setServiceTypeDialog] = useState(false);
  const [deleteServiceTypeDialog, setDeleteServiceTypeDialog] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const toast = useRef(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchServiceTypes();
    }
  }, [token, lazyParams]);

  const fetchServiceTypes = () => {
    setLoading(true);
    const page = Math.floor(lazyParams.first / lazyParams.rows) + 1;

    axios
      .get("http://localhost:3000/api/service-type", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: lazyParams.rows,
        },
      })
      .then((response) => {
        console.log("Service Type API Response:", response.data);
        // Backend returns { success: true, data: [...], pagination: {...} }
        if (response.data.success && response.data.data) {
          setServiceTypes(response.data.data);
          setTotalRecords(
            response.data.pagination?.total || response.data.data.length
          );
        } else {
          // Fallback for old format
          setServiceTypes(Array.isArray(response.data) ? response.data : []);
          setTotalRecords(response.data.length || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service types:", error);
        setServiceTypes([]);
        setTotalRecords(0);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching service type data",
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

  const openNew = () => {
    setServiceType({
      ServiceTypeId: 0,
      ServiceTypeName: "",
      Description: "",
      Deleted: false,
    });
    setServiceTypeDialog(true);
  };

  const hideDialog = () => setServiceTypeDialog(false);
  const hideDeleteDialog = () => setDeleteServiceTypeDialog(false);

  const saveServiceType = () => {
    if (serviceType.ServiceTypeName.trim() === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Service Type Name is required",
        life: 3000,
      });
      return;
    }

    if (serviceType.ServiceTypeId === 0) {
      console.log("Creating service type: ", serviceType);
      // Filter data to only include ServiceType table fields
      const createData = {
        ServiceTypeName: serviceType.ServiceTypeName,
        Description: serviceType.Description || "",
      };
      axios
        .post(`http://localhost:3000/api/service-type`, createData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchServiceTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Service Type Created",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error creating service type:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Error creating service type",
            life: 3000,
          });
        });
    } else {
      console.log("Updating service type: ", serviceType);
      // Filter data to only include ServiceType table fields
      const updateData = {
        ServiceTypeName: serviceType.ServiceTypeName,
        Description: serviceType.Description || "",
      };
      axios
        .put(
          `http://localhost:3000/api/service-type/${serviceType.ServiceTypeId}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchServiceTypes();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Service Type Updated",
            life: 3000,
          });
        })
        .catch((error) => {
          console.error("Error updating service type:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Error updating service type",
            life: 3000,
          });
        });
    }
    setServiceTypeDialog(false);
  };

  const editServiceType = (rowData) => {
    setServiceType({ ...rowData });
    setServiceTypeDialog(true);
  };

  const confirmDeleteServiceType = (rowData) => {
    setServiceType(rowData);
    setDeleteServiceTypeDialog(true);
  };

  const deleteServiceType = () => {
    axios
      .delete(
        `http://localhost:3000/api/service-type/${serviceType.ServiceTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchServiceTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Service Type Deleted",
          life: 3000,
        });
      })
      .catch((error) => {
        console.error("Error deleting service type:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error.response?.data?.message || "Error deleting service type",
          life: 3000,
        });
      });
    setDeleteServiceTypeDialog(false);
  };

  const deleteSelectedServiceTypes = () => {
    const idsToDelete = selectedServiceTypes.map((item) => item.ServiceTypeId);
    axios
      .post(
        `http://localhost:3000/api/service-type/delete-multiple`,
        idsToDelete,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchServiceTypes();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Service Types Deleted",
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
        onClick={deleteSelectedServiceTypes}
        disabled={!selectedServiceTypes || !selectedServiceTypes.length}
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
        onClick={() => editServiceType(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteServiceType(rowData)}
      />
    </div>
  );

  const serviceTypeDialogFooter = (
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
        onClick={saveServiceType}
      />
    </div>
  );

  const deleteServiceTypeDialogFooter = (
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
        onClick={deleteServiceType}
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
        value={serviceTypes}
        selection={selectedServiceTypes}
        onSelectionChange={(e) => setSelectedServiceTypes(e.value)}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        rowsPerPageOptions={[5, 10, 20]}
        globalFilter={globalFilter}
        header="Service Type Management"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="ServiceTypeId" header="ID" sortable />
        <Column field="ServiceTypeName" header="Service Type Name" sortable />
        <Column field="Description" header="Description" sortable />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "10rem" }}
        />
      </DataTable>

      <Dialog
        visible={serviceTypeDialog}
        style={{ width: "450px" }}
        header="Service Type Details"
        modal
        className="p-fluid"
        footer={serviceTypeDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="ServiceTypeName">Service Type Name</label>
          <InputText
            id="ServiceTypeName"
            value={serviceType.ServiceTypeName}
            onChange={(e) =>
              setServiceType({
                ...serviceType,
                ServiceTypeName: e.target.value,
              })
            }
            placeholder="Please enter a service type name"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="Description">Description</label>
          <InputText
            id="Description"
            value={serviceType.Description}
            onChange={(e) =>
              setServiceType({ ...serviceType, Description: e.target.value })
            }
            placeholder="Please enter description"
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteServiceTypeDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteServiceTypeDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {serviceType && (
            <span>
              Are you sure you want to delete{" "}
              <b>{serviceType.ServiceTypeName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
