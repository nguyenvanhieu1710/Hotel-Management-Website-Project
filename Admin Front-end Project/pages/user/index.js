import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

const User = () => {
  let emptyUser = { id: null, username: '', email: '', role: '' };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);

  // Giả sử dữ liệu ban đầu
  useEffect(() => {
    setUsers([
      { id: 'U1', username: 'john_doe', email: 'john@example.com', role: 'Admin' },
      { id: 'U2', username: 'jane_smith', email: 'jane@example.com', role: 'User' },
    ]);
  }, []);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);

    if (user.username.trim() !== '' && user.email.trim() !== '') {
      let _users = [...users];
      let _user = { ...user };

      if (_user.id) {
        // Cập nhật user
        const index = findIndexById(_user.id);
        _users[index] = _user;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
      } else {
        // Tạo mới user
        _user.id = createId();
        _users.push(_user);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
      }

      setUsers(_users);
      setUserDialog(false);
      setUser(emptyUser);
    }
  };

  const editUser = (userData) => {
    setUser({ ...userData });
    setUserDialog(true);
  };

  const confirmDeleteUser = (userData) => {
    setUser(userData);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    let _users = users.filter(val => val.id !== user.id);
    setUsers(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    let _users = users.filter(val => !selectedUsers.includes(val));
    setUsers(_users);
    setDeleteUsersDialog(false);
    setSelectedUsers(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
          <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return <React.Fragment>{/* Có thể thêm nút Import/Export nếu cần */}</React.Fragment>;
  };

  const usernameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Username</span>
        {rowData.username}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    );
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Role</span>
        {rowData.role}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteUser(rowData)} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Users</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
    </>
  );

  const deleteUserDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
    </>
  );

  const deleteUsersDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedUsers} />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

          <DataTable
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            globalFilter={globalFilter}
            emptyMessage="No users found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="username" header="Username" sortable body={usernameBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
            <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
            <Column field="role" header="Role" sortable body={roleBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
          </DataTable>

          <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.username })} />
              {submitted && !user.username && <small className="p-invalid">Username is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} />
              {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <InputText id="role" value={user.role} onChange={(e) => onInputChange(e, 'role')} />
            </div>
          </Dialog>

          <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {user && <span>Are you sure you want to delete <b>{user.username}</b>?</span>}
            </div>
          </Dialog>

          <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
            <div className="flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              <span>Are you sure you want to delete the selected users?</span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default User;
