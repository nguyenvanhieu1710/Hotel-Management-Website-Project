import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function RentRoomVotes() {
  const [votes, setVotes] = useState([]);
  const [vote, setVote] = useState({
    VoteId: 0,
    RentRoomId: 0,
    UserId: 0,
    Star: 0,
    Comment: "",
    DateCreated: "",
    Deleted: false,
  });
  const [voteDialog, setVoteDialog] = useState(false);
  const [deleteVoteDialog, setDeleteVoteDialog] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);

  // Load dữ liệu đánh giá
  const fetchVotes = async () => {
    try {
      const res = await axios.get(
        "https://localhost:44302/api/rent-room-vote/get-all"
      );
      setVotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  // Mở dialog thêm mới
  const openNew = () => {
    setVote({
      VoteId: 0,
      RentRoomId: 0,
      UserId: 0,
      Star: 0,
      Comment: "",
      DateCreated: "",
      Deleted: false,
    });
    setVoteDialog(true);
  };

  // Ẩn dialog
  const hideDialog = () => setVoteDialog(false);
  const hideDeleteDialog = () => setDeleteVoteDialog(false);

  // Xử lý lưu vote
  const saveVote = async () => {
    try {
      if (vote.VoteId === 0) {
        await axios.post(
          "https://localhost:44302/api/rent-room-vote/create",
          vote
        );
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đã thêm đánh giá!",
          life: 3000,
        });
      } else {
        await axios.put(
          `https://localhost:44302/api/rent-room-vote/update/${vote.VoteId}`,
          vote
        );
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đã cập nhật đánh giá!",
          life: 3000,
        });
      }
      setVoteDialog(false);
      fetchVotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Mở dialog chỉnh sửa
  const editVote = (rowData) => {
    setVote({ ...rowData });
    setVoteDialog(true);
  };

  // Xác nhận xóa 1 vote
  const confirmDeleteVote = (rowData) => {
    setVote(rowData);
    setDeleteVoteDialog(true);
  };

  // Xóa 1 vote
  const deleteVote = async () => {
    try {
      await axios.delete(
        `https://localhost:44302/api/rent-room-vote/delete/${vote.VoteId}`
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa đánh giá!",
        life: 3000,
      });
      setDeleteVoteDialog(false);
      fetchVotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa nhiều votes
  const deleteSelectedVotes = async () => {
    try {
      const ids = selectedVotes.map((v) => v.VoteId);
      await axios.post(
        "https://localhost:44302/api/rent-room-vote/delete-multiple",
        ids
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa các đánh giá!",
        life: 3000,
      });
      setSelectedVotes(null);
      fetchVotes();
    } catch (err) {
      console.error(err);
    }
  };

  // Action buttons
  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
        onClick={() => editVote(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteVote(rowData)}
      />
    </>
  );

  return (
    <div className="container">
      <Toast ref={toast} />

      <div className="header flex justify-between mb-4">
        <Button label="Thêm Đánh Giá" icon="pi pi-plus" onClick={openNew} />
        <Button
          label="Xóa các mục đã chọn"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={deleteSelectedVotes}
          disabled={!selectedVotes || !selectedVotes.length}
        />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
          className="ml-2"
        />
      </div>

      <DataTable
        value={votes}
        paginator
        rows={5}
        dataKey="VoteId"
        selection={selectedVotes}
        onSelectionChange={(e) => setSelectedVotes(e.value)}
        globalFilter={globalFilter}
        header="Danh Sách Đánh Giá Thuê Phòng"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="VoteId" header="ID" />
        <Column field="RentRoomId" header="Mã Thuê Phòng" />
        <Column field="UserId" header="Người Dùng" />
        <Column field="Star" header="Số Sao" />
        <Column field="Comment" header="Bình Luận" />
        <Column field="DateCreated" header="Ngày Tạo" />
        <Column body={actionBodyTemplate} header="Hành Động" />
      </DataTable>

      {/* Dialog Thêm / Sửa */}
      <Dialog
        visible={voteDialog}
        style={{ width: "450px" }}
        header="Thông Tin Đánh Giá"
        modal
        className="p-fluid"
        footer={
          <>
            <Button
              label="Hủy"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideDialog}
            />
            <Button
              label="Lưu"
              icon="pi pi-check"
              className="p-button-text"
              onClick={saveVote}
            />
          </>
        }
      >
        <InputText
          id="RentRoomId"
          value={vote.RentRoomId}
          onChange={(e) => setVote({ ...vote, RentRoomId: e.target.value })}
          placeholder="Mã Thuê Phòng"
        />
        <InputText
          id="UserId"
          value={vote.UserId}
          onChange={(e) => setVote({ ...vote, UserId: e.target.value })}
          placeholder="Người Dùng"
        />
        <InputText
          id="Star"
          value={vote.Star}
          onChange={(e) => setVote({ ...vote, Star: e.target.value })}
          placeholder="Số Sao"
        />
        <InputText
          id="Comment"
          value={vote.Comment}
          onChange={(e) => setVote({ ...vote, Comment: e.target.value })}
          placeholder="Bình Luận"
        />
      </Dialog>

      {/* Dialog Xác Nhận Xóa */}
      <Dialog
        visible={deleteVoteDialog}
        style={{ width: "450px" }}
        header="Xác Nhận"
        modal
        footer={
          <>
            <Button
              label="Không"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideDeleteDialog}
            />
            <Button
              label="Có"
              icon="pi pi-check"
              className="p-button-text"
              onClick={deleteVote}
            />
          </>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            Bạn chắc chắn muốn xóa đánh giá <b>{vote.VoteId}</b>?
          </span>
        </div>
      </Dialog>
    </div>
  );
}
