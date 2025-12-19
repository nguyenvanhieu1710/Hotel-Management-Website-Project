import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function ServiceVotes() {
  let emptyServiceVotes = {
    ServiceVotesId: 0,
    ServiceId: 0,
    UserId: 0,
    Quantity: 1,
    TotalAmount: 0,
    Deleted: false,
  };

  const [serviceVotesList, setServiceVotesList] = useState([]);
  const [serviceVotes, setServiceVotes] = useState(emptyServiceVotes);
  const [selectedServiceVotes, setSelectedServiceVotes] = useState(null);
  const [serviceVotesDialog, setServiceVotesDialog] = useState(false);
  const [deleteServiceVotesDialog, setDeleteServiceVotesDialog] =
    useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [token, setToken] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchServiceVotes();
      fetchUsers();
      fetchServices();
    }
  }, [token, lazyParams]);

  const fetchServiceVotes = () => {
    setLoading(true);
    const page = Math.floor(lazyParams.first / lazyParams.rows) + 1;

    axios
      .get("http://localhost:3000/api/serviceVotes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: lazyParams.rows,
        },
      })
      .then((response) => {
        console.log("Service Votes API Response:", response.data);
        if (response.data.success && response.data.data) {
          setServiceVotesList(response.data.data);
          setTotalRecords(
            response.data.pagination?.total || response.data.data.length
          );
        } else {
          setServiceVotesList(
            Array.isArray(response.data) ? response.data : []
          );
          setTotalRecords(response.data.length || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service votes:", error);
        setServiceVotesList([]);
        setTotalRecords(0);
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching service votes data",
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

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      })
      .then((response) => {
        if (response.data.success && response.data.data) {
          setUsers(response.data.data);
        } else {
          setUsers(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  };

  const fetchServices = () => {
    axios
      .get("http://localhost:3000/api/service", {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      })
      .then((response) => {
        console.log("Services API Response:", response.data);
        if (response.data.success && response.data.data) {
          setServices(response.data.data);
        } else {
          setServices(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setServices([]);
      });
  };

  const openNew = () => {
    setServiceVotes(emptyServiceVotes);
    setServiceVotesDialog(true);
  };

  const hideDialog = () => {
    setServiceVotesDialog(false);
  };

  const hideDeleteDialog = () => setDeleteServiceVotesDialog(false);

  const validateServiceVotes = () => {
    if (!serviceVotes.ServiceId) return false;
    if (!serviceVotes.UserId) return false;
    if (!serviceVotes.Quantity || serviceVotes.Quantity <= 0) return false;
    return true;
  };

  // Calculate total amount when service or quantity changes
  const calculateTotalAmount = (serviceId, quantity) => {
    const service = services.find((s) => s.ServiceId === serviceId);
    if (service) {
      return parseFloat(service.Price) * quantity;
    }
    return 0;
  };

  const onServiceChange = (e) => {
    const serviceId = e.value;
    const totalAmount = calculateTotalAmount(serviceId, serviceVotes.Quantity);
    setServiceVotes({
      ...serviceVotes,
      ServiceId: serviceId,
      TotalAmount: totalAmount,
    });
  };

  const onQuantityChange = (e) => {
    const quantity = e.value || 1;
    const totalAmount = calculateTotalAmount(serviceVotes.ServiceId, quantity);
    setServiceVotes({
      ...serviceVotes,
      Quantity: quantity,
      TotalAmount: totalAmount,
    });
  };

  const onUserChange = (e) => {
    setServiceVotes({ ...serviceVotes, UserId: e.value });
  };

  const saveServiceVotes = () => {
    if (!validateServiceVotes()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields",
        life: 3000,
      });
      return;
    }

    // Filter data to only include ServiceVotes table fields
    const serviceVotesData = {
      ServiceId: serviceVotes.ServiceId,
      UserId: serviceVotes.UserId,
      Quantity: serviceVotes.Quantity,
      TotalAmount: serviceVotes.TotalAmount,
    };

    if (serviceVotes.ServiceVotesId !== 0) {
      // Update existing
      console.log("Updating serviceVotes:", serviceVotesData);
      axios
        .put(
          `http://localhost:3000/api/serviceVotes/${serviceVotes.ServiceVotesId}`,
          serviceVotesData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          fetchServiceVotes();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail:
              response.data.message || "Service Votes updated successfully",
            life: 3000,
          });
          setServiceVotesDialog(false);
          setServiceVotes(emptyServiceVotes);
        })
        .catch((error) => {
          console.error("Error updating serviceVotes:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Error updating service votes",
            life: 3000,
          });
        });
    } else {
      // Create new
      console.log("Creating serviceVotes:", serviceVotesData);
      axios
        .post("http://localhost:3000/api/serviceVotes", serviceVotesData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          fetchServiceVotes();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail:
              response.data.message || "Service Votes created successfully",
            life: 3000,
          });
          setServiceVotesDialog(false);
          setServiceVotes(emptyServiceVotes);
        })
        .catch((error) => {
          console.error("Error creating serviceVotes:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Error creating service votes",
            life: 3000,
          });
        });
    }
  };

  const editServiceVotes = (rowData) => {
    setServiceVotes({ ...rowData });
    setServiceVotesDialog(true);
  };

  const confirmDeleteServiceVotes = (rowData) => {
    setServiceVotes(rowData);
    setDeleteServiceVotesDialog(true);
  };

  const deleteServiceVotes = () => {
    axios
      .delete(
        `http://localhost:3000/api/serviceVotes/${serviceVotes.ServiceVotesId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        fetchServiceVotes();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message || "Service Votes deleted successfully",
          life: 3000,
        });
        setDeleteServiceVotesDialog(false);
        setServiceVotes(emptyServiceVotes);
      })
      .catch((error) => {
        console.error("Error deleting serviceVotes:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            error.response?.data?.message || "Error deleting service votes",
          life: 3000,
        });
      });
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

  const rightToolbarTemplate = () => (
    <InputText
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search..."
    />
  );

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => editServiceVotes(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteServiceVotes(rowData)}
      />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Service Votes</h5>
    </div>
  );

  const serviceVotesDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveServiceVotes} />
    </>
  );

  const deleteServiceVotesDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteServiceVotes}
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
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={serviceVotesList}
            selection={selectedServiceVotes}
            onSelectionChange={(e) => setSelectedServiceVotes(e.value)}
            dataKey="ServiceVotesId"
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="ServiceVotesId" header="ID" sortable />
            <Column
              field="ServiceId"
              header="Service"
              sortable
              body={(rowData) => {
                const service = services.find(
                  (s) => s.ServiceId === rowData.ServiceId
                );
                return service
                  ? `${service.ServiceName} (ID: ${service.ServiceId})`
                  : `Service ID: ${rowData.ServiceId}`;
              }}
            />
            <Column
              field="UserId"
              header="User"
              sortable
              body={(rowData) => {
                const user = users.find((u) => u.UserId === rowData.UserId);
                return user
                  ? `${user.UserName} (ID: ${user.UserId})`
                  : `User ID: ${rowData.UserId}`;
              }}
            />
            <Column field="Quantity" header="Quantity" sortable />
            <Column
              field="TotalAmount"
              header="Total Amount"
              sortable
              body={(rowData) =>
                `$${Number(rowData.TotalAmount).toLocaleString()}`
              }
            />
            <Column
              field="Actions"
              header="Actions"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>

          {/* Dialog Add/Edit */}
          <Dialog
            visible={serviceVotesDialog}
            style={{ width: "450px" }}
            header="Service Votes Details"
            modal
            className="p-fluid"
            footer={serviceVotesDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="ServiceId">Service</label>
              <Dropdown
                id="ServiceId"
                value={serviceVotes.ServiceId}
                options={services}
                optionLabel={(option) =>
                  `${option.ServiceName} - $${option.Price}`
                }
                optionValue="ServiceId"
                onChange={onServiceChange}
                placeholder="Select Service"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="UserId">User</label>
              <Dropdown
                id="UserId"
                value={serviceVotes.UserId}
                options={users}
                optionLabel={(option) =>
                  `${option.UserName} (ID: ${option.UserId})`
                }
                optionValue="UserId"
                onChange={onUserChange}
                placeholder="Select User"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="Quantity">Quantity</label>
              <InputNumber
                id="Quantity"
                value={serviceVotes.Quantity}
                onValueChange={onQuantityChange}
                min={1}
                showButtons
                required
              />
            </div>
            <div className="field">
              <label htmlFor="TotalAmount">Total Amount</label>
              <InputNumber
                id="TotalAmount"
                value={serviceVotes.TotalAmount}
                mode="currency"
                currency="USD"
                disabled
              />
            </div>
          </Dialog>

          {/* Dialog Confirm Delete */}
          <Dialog
            visible={deleteServiceVotesDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteServiceVotesDialogFooter}
            onHide={hideDeleteDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {serviceVotes && (
                <span>Are you sure you want to delete this service vote?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
