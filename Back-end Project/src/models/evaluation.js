class Evaluation {
  constructor({
    EvaluationId,
    UserId,
    RoomId,
    Rating,
    Comment,
    Status,
    Deleted,
  }) {
    this.EvaluationId = EvaluationId;
    this.UserId = UserId;
    this.RoomId = RoomId;
    this.Rating = Rating;
    this.Comment = Comment;
    this.Status = Status;
    this.Deleted = Deleted;
  }
}
