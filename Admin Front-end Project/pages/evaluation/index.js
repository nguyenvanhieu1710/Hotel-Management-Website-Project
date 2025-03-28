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

export default function Evaluation() {
  let emptyEvaluation = {
    EvaluationId: 0,
    UserId: 0,
    RoomId: 0,
    Rating: 0,
    Comment: "",
    Status: "",
    Deleted: false,
  };

  const token = "YOUR_API_TOKEN_HERE";
  const [evaluations, setEvaluations] = useState([]);
  const [evaluation, setEvaluation] = useState(emptyEvaluation);
  const [selectedEvaluations, setSelectedEvaluations] = useState(null);
  const [evaluationDialog, setEvaluationDialog] = useState(false);
  const [deleteEvaluationDialog, setDeleteEvaluationDialog] = useState(false);
  const [deleteEvaluationsDialog, setDeleteEvaluationsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchEvaluations();
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchEvaluations = () => {
    axios
      .get("http://localhost:3000/api/evaluation", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvaluations(response.data))
      .catch((error) => console.error("Error fetching evaluations:", error));
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/user/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/rooms/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  const openNew = () => {
    setEvaluation(emptyEvaluation);
    setSubmitted(false);
    setEvaluationDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEvaluationDialog(false);
  };

  const hideDeleteEvaluationDialog = () => setDeleteEvaluationDialog(false);
  const hideDeleteEvaluationsDialog = () => setDeleteEvaluationsDialog(false);

  const validateEvaluation = () => {
    if (!evaluation.UserId) return false;
    if (!evaluation.RoomId) return false;
    if (evaluation.Rating <= 0) return false;
    if (!evaluation.Comment) return false;
    if (!evaluation.Status) return false;
    return true;
  };

  const saveEvaluation = () => {
    setSubmitted(true);
    let _evaluations = [...evaluations];
    let _evaluation = { ...evaluation };

    if (validateEvaluation()) {
      if (evaluation.EvaluationId !== 0) {
        // Update existing evaluation (PUT request)
        evaluation.Deleted = false;
        // copy and delete evaluation because must delete CreatedAt, UpdatedAt field
        let copyEvaluation = { ...evaluation };
        delete copyEvaluation.CreatedAt;
        delete copyEvaluation.UpdatedAt;
        console.log("Updating evaluation:", copyEvaluation);
        axios
          .put(
            `http://localhost:3000/api/evaluation/${evaluation.EvaluationId}`,
            copyEvaluation,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            fetchEvaluations();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Evaluation has been updated",
              life: 3000,
            });
            setEvaluationDialog(false);
            setEvaluation(emptyEvaluation);
          })
          .catch((error) => console.error("Error updating evaluation:", error));
      } else {
        // Add new evaluation (POST request)
        console.log("Creating evaluation:", evaluation);
        evaluation.Deleted = false;
        axios
          .post("http://localhost:3000/api/evaluation", evaluation, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            fetchEvaluations();
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Evaluation has been created",
              life: 3000,
            });
            setEvaluationDialog(false);
            setEvaluation(emptyEvaluation);
          })
          .catch((error) => console.error("Error creating evaluation:", error));
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

  const editEvaluation = (evaluationData) => {
    setEvaluation({ ...evaluationData });
    setEvaluationDialog(true);
  };

  const confirmDeleteEvaluation = (evaluationData) => {
    setEvaluation(evaluationData);
    setDeleteEvaluationDialog(true);
  };

  const deleteEvaluation = () => {
    console.log("Evaluation:", evaluation);

    axios
      .delete(
        `http://localhost:3000/api/evaluation/${evaluation.EvaluationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        fetchEvaluations();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Evaluation Deleted",
          life: 3000,
        });
        setDeleteEvaluationDialog(false);
        setEvaluation(emptyEvaluation);
      })
      .catch((error) => console.error("Error deleting evaluation:", error));
  };

  const confirmDeleteSelected = () => setDeleteEvaluationsDialog(true);

  const deleteSelectedEvaluations = () => {
    let _evaluations = evaluations.filter(
      (val) => !selectedEvaluations.includes(val)
    );
    setEvaluations(_evaluations);
    setDeleteEvaluationsDialog(false);
    setSelectedEvaluations(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Evaluations Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) =>
    evaluations.findIndex((r) => r.EvaluationId === id);
  const createId = () => Math.floor(Math.random() * 100000);

  const onInputChange = (e, name) => {
    let val = e.target ? e.target.value : e.value;
    let _evaluation = { ...evaluation };
    _evaluation[name] = val;
    setEvaluation(_evaluation);
  };

  const onEvaluationTypeChange = (e) => {
    onInputChange({ value: e.value }, "EvaluationTypeId");
  };

  const onUserChange = (e) => {
    setEvaluation({ ...evaluation, UserId: e.value });
  };

  const onRoomChange = (e) => {
    setEvaluation({ ...evaluation, RoomId: e.value });
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
      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={confirmDeleteSelected}
        disabled={!selectedEvaluations || !selectedEvaluations.length}
      />
    </div>
  );

  const rightToolbarTemplate = () => <></>;

  const statusBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Status</span>
      {rowData.Status}
    </>
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

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Evaluations</h5>
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
        onClick={hideDeleteEvaluationsDialog}
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
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={evaluations}
            selection={selectedEvaluations}
            onSelectionChange={(e) => setSelectedEvaluations(e.value)}
            dataKey="EvaluationId"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column field="EvaluationId" header="Evaluation ID" sortable />
            <Column field="UserId" header="User ID" sortable />
            <Column field="RoomId" header="Room ID" sortable />
            <Column field="Rating" header="Rating" sortable />
            <Column field="Comment" header="Comment" sortable />
            <Column field="Status" header="Status" sortable />
            <Column
              field="Deleted"
              header="Deleted"
              body={(rowData) => (rowData.Deleted ? "Yes" : "No")}
              sortable
            />
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
              <label htmlFor="UserId">User Id</label>
              <Dropdown
                id="UserId"
                value={evaluation.UserId}
                options={users}
                optionLabel="UserId"
                optionValue="UserId"
                onChange={onUserChange}
                placeholder="Select User"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="RoomId">Room Id</label>
              <Dropdown
                id="RoomId"
                value={evaluation.RoomId}
                options={rooms}
                onChange={onRoomChange}
                optionLabel="RoomId"
                optionValue="RoomId"
                placeholder="Select Room"
                className={classNames({
                  "p-invalid": submitted && !evaluation.RoomId,
                })}
                required
              />
            </div>
            <div className="p-field">
              <label htmlFor="Rating">Rating</label>
              <InputNumber
                id="Rating"
                value={evaluation.Rating}
                onChange={(e) => onInputChange(e, "Rating")}
                placeholder="Rating"
                min={0}
                max={5}
              />
            </div>
            <div className="p-field">
              <label htmlFor="Comment">Comment</label>
              <InputText
                id="Comment"
                value={evaluation.Comment}
                onChange={(e) => onInputChange(e, "Comment")}
                placeholder="Comment"
              />
            </div>
            <div className="p-field">
              <label htmlFor="Status">Status</label>
              <InputText
                id="Status"
                value={evaluation.Status}
                onChange={(e) => onInputChange(e, "Status")}
                placeholder="Status"
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteEvaluationDialog}
            header="Confirm"
            modal
            footer={deleteEvaluationDialogFooter}
            onHide={hideDeleteEvaluationDialog}
          ></Dialog>

          <Dialog
            visible={deleteEvaluationsDialog}
            header="Confirm"
            modal
            footer={deleteEvaluationsDialogFooter}
            onHide={hideDeleteEvaluationsDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {evaluation && (
                <span>
                  Are you sure you want to delete the selected evaluations?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
