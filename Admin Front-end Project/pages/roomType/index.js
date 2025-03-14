import { useState, useEffect } from "react";
import axios from "axios";

export default function RoomType() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [newRoomType, setNewRoomType] = useState({
    RoomTypeId: "",
    RoomTypeName: "",
    MaximumNumberOfGuests: "",
    Description: "",
    Deleted: 0,
  });

  // Lấy danh sách room type khi component mount
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = () => {
    axios
      .get("http://localhost:3000/api/room-type/get-all")
      .then((response) => {
        console.log(response.data);
        setRoomTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching room types:", error);
      });
  };

  // Xóa room type
  const handleDelete = (roomTypeId) => {
    axios
      .delete(`http://localhost:3000/api/room-type/delete/${roomTypeId}`)
      .then(() => {
        fetchRoomTypes();
      })
      .catch((error) => {
        console.error("Error deleting room type:", error);
      });
  };

  // Bắt đầu chỉnh sửa room type
  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
  };

  // Cập nhật room type sau khi chỉnh sửa
  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:3000/api/room-type/update/${editingRoomType.RoomTypeId}`,
        editingRoomType
      )
      .then(() => {
        setEditingRoomType(null);
        fetchRoomTypes();
      })
      .catch((error) => {
        console.error("Error updating room type:", error);
      });
  };

  // Thêm room type mới
  const handleAdd = () => {
    axios
      .post("http://localhost:3000/api/room-type/create", newRoomType)
      .then(() => {
        setNewRoomType({
          RoomTypeId: "",
          RoomTypeName: "",
          MaximumNumberOfGuests: "",
          Description: "",
          Deleted: 0,
        });
        fetchRoomTypes();
      })
      .catch((error) => {
        console.error("Error adding room type:", error);
      });
  };

  return (
    <div>
      <h1>Room Type Page</h1>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>RoomTypeId</th>
            <th>RoomTypeName</th>
            <th>MaximumNumberOfGuests</th>
            <th>Description</th>
            <th>Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((rt) =>
            editingRoomType && editingRoomType.RoomTypeId === rt.RoomTypeId ? (
              <tr key={rt.RoomTypeId}>
                <td>{rt.RoomTypeId}</td>
                <td>
                  <input
                    type="text"
                    value={editingRoomType.RoomTypeName}
                    onChange={(e) =>
                      setEditingRoomType({
                        ...editingRoomType,
                        RoomTypeName: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editingRoomType.MaximumNumberOfGuests}
                    onChange={(e) =>
                      setEditingRoomType({
                        ...editingRoomType,
                        MaximumNumberOfGuests: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingRoomType.Description}
                    onChange={(e) =>
                      setEditingRoomType({
                        ...editingRoomType,
                        Description: e.target.value,
                      })
                    }
                  />
                </td>
                <td>{editingRoomType.Deleted}</td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingRoomType(null)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={rt.RoomTypeId}>
                <td>{rt.RoomTypeId}</td>
                <td>{rt.RoomTypeName}</td>
                <td>{rt.MaximumNumberOfGuests}</td>
                <td>{rt.Description}</td>
                <td>{rt.Deleted}</td>
                <td>
                  <button onClick={() => handleEdit(rt)}>Edit</button>
                  <button onClick={() => handleDelete(rt.RoomTypeId)}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
          {/* Hàng thêm mới */}
          <tr>
            <td>Auto</td>
            <td>
              <input
                type="text"
                placeholder="RoomTypeName"
                value={newRoomType.RoomTypeName}
                onChange={(e) =>
                  setNewRoomType({
                    ...newRoomType,
                    RoomTypeName: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                type="number"
                placeholder="MaximumNumberOfGuests"
                value={newRoomType.MaximumNumberOfGuests}
                onChange={(e) =>
                  setNewRoomType({
                    ...newRoomType,
                    MaximumNumberOfGuests: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Description"
                value={newRoomType.Description}
                onChange={(e) =>
                  setNewRoomType({
                    ...newRoomType,
                    Description: e.target.value,
                  })
                }
              />
            </td>
            <td>{newRoomType.Deleted}</td>
            <td>
              <button onClick={handleAdd}>Add Room Type</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
