const Users = () => {
  return (
    <section>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">User List</h2>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div
            className="trash-container mt-2"
            data-bs-toggle="modal"
            data-bs-target="#trashCanModal"
          >
            <i className="fas fa-trash"></i>
            <span className="badge">3</span>
          </div>
          <div className="mb-2 d-flex justify-content-end">
            <form action="#" className="search-bar" id="searchForm">
              <input
                type="search"
                name="search"
                id="searchInput"
                pattern=".*\S.*"
                required
              />
              <button className="search-btn" type="submit">
                <span>Search</span>
              </button>
            </form>
            <button
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              type="button"
              className="btn btn-primary btn-add-user"
            >
              Add
            </button>
            <button
              type="button"
              className="btn btn-warning mx-1 btn-update-user"
            >
              Update
            </button>
            <button type="button" className="btn btn-danger btn-delete-user">
              Delete
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-wrap">
              <table className="table table-hover" id="activeTable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Birthday</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Image</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Address</th>
                    <th scope="col">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" className="user-checkbox" />
                    </th>
                    <td>1</td>
                    <td>Nguyen Van A</td>
                    <td>2024-11-05</td>
                    <td>0123456789</td>
                    <td>
                      <img
                        src="../img/anh-trang.jpg"
                        alt="Image"
                        width="30"
                        height="30"
                      />
                    </td>
                    <td>Male</td>
                    <td>HCM</td>
                    <td>Diamond</td>
                  </tr>
                </tbody>
              </table>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li className="page-item disabled btn-previous">
                    <a className="page-link" href="#" tabIndex="-1">
                      Previous
                    </a>
                  </li>
                  <li className="page-item btn-onePage">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item btn-twoPage">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item btn-threePage">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item btn-next">
                    <a className="page-link" href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Modal: Create User */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create user
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Your name.."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="birthday" className="form-label">
                    Birthday
                  </label>
                  <input type="date" name="birthday" className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phonenumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phonenumber"
                    className="form-control"
                    placeholder="Your phone number.."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Image
                  </label>
                  <input className="form-control" type="file" id="formFile" />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option value="" selected>
                      Gender
                    </option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Your address.."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ranking" className="form-label">
                    Rank
                  </label>
                  <input
                    type="text"
                    name="ranking"
                    className="form-control"
                    placeholder="Your rank.."
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
