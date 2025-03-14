class RentRoomVotesDetail {
  constructor({
    RentRoomVotesDetailId = 0,
    RentRoomVotesId = 0,
    RoomId = 0,
    ServiceVotesId = 0,
    TotalCostOfThisRoom = 0,
    Note = "",
    Deleted = false,
  }) {
    this.RentRoomVotesDetailId = RentRoomVotesDetailId;
    this.RentRoomVotesId = RentRoomVotesId;
    this.RoomId = RoomId;
    this.ServiceVotesId = ServiceVotesId;
    this.TotalCostOfThisRoom = TotalCostOfThisRoom;
    this.Note = Note;
    this.Deleted = Deleted;
  }
}

export default RentRoomVotesDetail;
