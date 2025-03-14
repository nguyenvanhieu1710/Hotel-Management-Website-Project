import { useState, useEffect } from "react";
import axios from "axios";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    RoomTypeId: "",
    Price: "",
    NumberOfFloor: "",
    Status: "",
    Description: "",
    Deleted: 0,
  });

  // Lấy danh sách phòng khi component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get("http://localhost:3000/api/rooms/get-all")
      .then((response) => {
        console.log(response.data);
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  // Xóa phòng
  const handleDelete = (roomId) => {
    axios
      .delete(`http://localhost:4000/api/rooms/delete/${roomId}`)
      .then(() => {
        fetchRooms();
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
      });
  };

  // Bắt đầu sửa phòng
  const handleEdit = (room) => {
    setEditingRoom(room);
  };

  // Cập nhật phòng sau khi sửa
  const handleUpdate = () => {
    axios
      .put(`http://localhost:3000/api/rooms/update/${editingRoom.RoomId}`, editingRoom)
      .then(() => {
        setEditingRoom(null);
        fetchRooms();
      })
      .catch((error) => {
        console.error("Error updating room:", error);
      });
  };

  // Thêm phòng mới
  const handleAdd = () => {
    axios
      .post("http://localhost:3000/api/rooms/create", newRoom)
      .then(() => {
        setNewRoom({
          RoomTypeId: "",
          Price: "",
          NumberOfFloor: "",
          Status: "",
          Description: "",
          Deleted: 0,
        });
        fetchRooms();
      })
      .catch((error) => {
        console.error("Error adding room:", error);
      });
  };

  return (
    <div>
      <h1>Room Page</h1>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>RoomId</th>
            <th>RoomTypeId</th>
            <th>Price</th>
            <th>NumberOfFloor</th>
            <th>Status</th>
            <th>Description</th>
            <th>Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) =>
            editingRoom && editingRoom.RoomId === room.RoomId ? (
              <tr key={room.RoomId}>
                <td>{room.RoomId}</td>
                <td>
                  <input
                    type="text"
                    value={editingRoom.RoomTypeId}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, RoomTypeId: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingRoom.Price}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, Price: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingRoom.NumberOfFloor}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, NumberOfFloor: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingRoom.Status}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, Status: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingRoom.Description}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, Description: e.target.value })
                    }
                  />
                </td>
                <td>{editingRoom.Deleted}</td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingRoom(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={room.RoomId}>
                <td>{room.RoomId}</td>
                <td>{room.RoomTypeId}</td>
                <td>{room.Price}</td>
                <td>{room.NumberOfFloor}</td>
                <td>{room.Status}</td>
                <td>{room.Description}</td>
                <td>{room.Deleted}</td>
                <td>
                  <button onClick={() => handleEdit(room)}>Edit</button>
                  <button onClick={() => handleDelete(room.RoomId)}>Delete</button>
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
                placeholder="RoomTypeId"
                value={newRoom.RoomTypeId}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, RoomTypeId: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Price"
                value={newRoom.Price}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, Price: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="NumberOfFloor"
                value={newRoom.NumberOfFloor}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, NumberOfFloor: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Status"
                value={newRoom.Status}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, Status: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Description"
                value={newRoom.Description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, Description: e.target.value })
                }
              />
            </td>
            <td>{newRoom.Deleted}</td>
            <td>
              <button onClick={handleAdd}>Add Room</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
