import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Evaluation() {
  const emptyEvaluation = {
    EvaluationId: 0,
    UserId: 0,
    RoomId: 0,
    Rating: 0,
    Comment: "",
    Status: "Draft",
    Deleted: false,
  };

  const [evaluations, setEvaluations] = useState([]);
  const [evaluation, setEvaluation] = useState(emptyEvaluation);
  const [selectedEvaluations, setSelectedEvaluations] = useState(null);
  const [evaluationDialog, setEvaluationDialog] = useState(false);
  const [deleteEvaluationDialog, setDeleteEvaluationDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [token, setToken] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRooms();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEvaluations();
    }
  }, [lazyParams, token]);

  const fetchEvaluations = () => {
    setLoading(true);
    const { page, rows } = lazyParams;

    console.log("Fetching evaluations with params:", { page, limit: rows });

    if (!token) {
      console.error("No authentication token available");
      toast.current.show({
        severity: "error",
        summary: "Authentication Error",
        detail: "Please login to access this page",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3000/api/evaluation`, {
        params: { page, limit: rows },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Evaluations response:", res.data);
        if (res.data.success) {
          setEvaluations(res.data.data || []);
          setTotalRecords(res.data.pagination?.total || 0);
        } else {
          setEvaluations([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching evaluations:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch evaluations",
          life: 3000,
        });
        setEvaluations([]);
        setTotalRecords(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    console.log("Fetching users for evaluations");

    if (!token) {
      console.error("No authentication token available for users");
      return;
    }

    axios
      .get(`http://localhost:3000/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Users response:", res.data);
        if (res.data.success) {
          setUsers(res.data.data || []);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  };

  const fetchRooms = () => {
    console.log("Fetching rooms for evaluations");

    if (!token) {
      console.error("No authentication token available for rooms");
      return;
    }

    axios
      .get(`http://localhost:3000/api/room`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Rooms response:", res.data);
        if (res.data.success) {
          setRooms(res.data.data || []);
        } else {
          setRooms([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      });
  };

  const onPage = (event) => {
    const newLazyParams = {
      ...lazyParams,
      first: event.first,
      rows: event.rows,
      page: Math.floor(event.first / event.rows) + 1,
    };
    setLazyParams(newLazyParams);
  };

  const openNew = () => {
    setEvaluation(emptyEvaluation);
    setEvaluationDialog(true);
  };

  const hideDialog = () => {
    setEvaluationDialog(false);
  };

  const hideDeleteEvaluationDialog = () => setDeleteEvaluationDialog(false);

  const validateEvaluation = () => {
    if (!evaluation.UserId || evaluation.UserId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "User is required",
        life: 3000,
      });
      return false;
    }
    if (!evaluation.RoomId || evaluation.RoomId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Room is required",
        life: 3000,
      });
      return false;
    }
    if (!evaluation.Rating || evaluation.Rating <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Rating must be greater than 0",
        life: 3000,
      });
      return false;
    }
    if (!evaluation.Comment || evaluation.Comment.trim() === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Comment is required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const saveEvaluation = () => {
    if (!validateEvaluation()) return;

    // Filter out fields that don't belong to Evaluation table
    const evaluationFields = {
      UserId: evaluation.UserId,
      RoomId: evaluation.RoomId,
      Rating: evaluation.Rating,
      Comment: evaluation.Comment,
      Status: evaluation.Status,
    };

    if (evaluation.EvaluationId === 0) {
      console.log("Creating evaluation:", evaluationFields);
      axios
        .post(`http://localhost:3000/api/evaluation`, evaluationFields, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          fetchEvaluations();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Evaluation Created",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error creating evaluation:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create evaluation",
            life: 3000,
          });
        });
    } else {
      console.log("Updating evaluation:", {
        EvaluationId: evaluation.EvaluationId,
        ...evaluationFields,
      });
      axios
        .put(
          `http://localhost:3000/api/evaluation/${evaluation.EvaluationId}`,
          evaluationFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          fetchEvaluations();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Evaluation Updated",
            life: 3000,
          });
        })
        .catch((err) => {
          console.error("Error updating evaluation:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update evaluation",
            life: 3000,
          });
        });
    }
    setEvaluationDialog(false);
    setEvaluation(emptyEvaluation);
  };

  const editEvaluation = (evaluationData) => {
    setEvaluation({ ...evaluationData });
    setEvaluationDialog(true);
  };

  const confirmDeleteEvaluation = (evaluationData) => {
    setEvaluation(evaluationData);
    setDeleteEvaluationDialog(true);
  };

  const deleteEvaluation = () => {
    axios
      .delete(
        `http://localhost:3000/api/evaluation/${evaluation.EvaluationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        fetchEvaluations();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Evaluation Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting evaluation:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete evaluation",
          life: 3000,
        });
      });
    setDeleteEvaluationDialog(false);
    setEvaluation(emptyEvaluation);
  };

  const deleteSelectedEvaluations = () => {
    if (!selectedEvaluations || selectedEvaluations.length === 0) return;

    const deletePromises = selectedEvaluations.map((item) =>
      axios.delete(
        `http://localhost:3000/api/evaluation/${item.EvaluationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );

    Promise.all(deletePromises)
      .then(() => {
        fetchEvaluations();
        setSelectedEvaluations(null);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Selected Evaluations Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting selected evaluations:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete selected evaluations",
          life: 3000,
        });
      });
  };

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    let _evaluation = { ...evaluation };
    _evaluation[name] = val;
    setEvaluation(_evaluation);
  };

  const onUserChange = (e) => {
    setEvaluation({ ...evaluation, UserId: e.value });
  };

  const onRoomChange = (e) => {
    setEvaluation({ ...evaluation, RoomId: e.value });
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
        onClick={deleteSelectedEvaluations}
        disabled={!selectedEvaluations || !selectedEvaluations.length}
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
        onClick={() => editEvaluation(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteEvaluation(rowData)}
      />
    </>
  );

  const evaluationDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveEvaluation} />
    </>
  );

  const deleteEvaluationDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEvaluationDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteEvaluation} />
    </>
  );

  const deleteEvaluationsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        // onClick={hideDeleteEvaluationsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedEvaluations}
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
            value={evaluations}
            selection={selectedEvaluations}
            onSelectionChange={(e) => setSelectedEvaluations(e.value)}
            dataKey="EvaluationId"
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            header="Evaluation Management"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="EvaluationId" header="Evaluation ID" sortable />
            <Column
              field="UserId"
              header="User"
              sortable
              body={(rowData) => {
                const user = users.find(
                  (user) => user.UserId === rowData.UserId
                );
                return user
                  ? `${user.UserName} (ID: ${rowData.UserId})`
                  : `User ID: ${rowData.UserId}`;
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
                return room
                  ? `Room ${room.RoomId}`
                  : `Room ID: ${rowData.RoomId}`;
              }}
            />
            <Column
              field="Rating"
              header="Rating"
              sortable
              body={(rowData) => {
                return `${rowData.Rating}/5 ⭐`;
              }}
            />
            <Column
              field="Comment"
              header="Comment"
              sortable
              body={(rowData) => {
                return rowData.Comment?.length > 50
                  ? `${rowData.Comment.substring(0, 50)}...`
                  : rowData.Comment;
              }}
            />
            <Column field="Status" header="Status" sortable />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>

          <Dialog
            visible={evaluationDialog}
            style={{ width: "450px" }}
            header="Evaluation Details"
            modal
            className="p-fluid"
            footer={evaluationDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="UserId">User</label>
              <Dropdown
                id="UserId"
                value={evaluation.UserId}
                options={users.map((user) => ({
                  label: `${user.UserName} (ID: ${user.UserId})`,
                  value: user.UserId,
                }))}
                onChange={onUserChange}
                placeholder="Select User"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="RoomId">Room</label>
              <Dropdown
                id="RoomId"
                value={evaluation.RoomId}
                options={rooms.map((room) => ({
                  label: `Room ${room.RoomId}`,
                  value: room.RoomId,
                }))}
                onChange={onRoomChange}
                placeholder="Select Room"
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Rating">Rating</label>
              <Rating
                className="mb-2 mt-2"
                value={evaluation.Rating}
                onChange={(e) => {
                  onInputChange(e, "Rating");
                }}
              />
            </div>
            <div className="p-field">
              <label htmlFor="Comment">Comment</label>
              <InputText
                id="Comment"
                value={evaluation.Comment}
                onChange={(e) => onInputChange(e, "Comment")}
                placeholder="Please enter a comment"
              />
            </div>
            <div className="field">
              <label htmlFor="Status">Status</label>
              <Dropdown
                id="Status"
                value={evaluation.Status}
                options={[
                  "Draft",
                  "Under Review",
                  "Approved",
                  "Rejected",
                  "Published",
                ]}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Select Status"
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteEvaluationDialog}
            header="Confirm"
            modal
            footer={deleteEvaluationDialogFooter}
            onHide={hideDeleteEvaluationDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {evaluation && (
                <span>
                  Are you sure you want to delete{" "}
                  <b>{evaluation.EvaluationId}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
