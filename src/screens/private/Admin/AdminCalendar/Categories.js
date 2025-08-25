import Axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function Categories({ className, categories, setCategories }) {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const [editModal, setEditModal] = useState({ open: false, category: {} })

  return (
    <div className={className}>
      <div className="createButtonWrapper">
        <button className="createButton" onClick={() => setOpenAddModal(true)}>
          Add Category
        </button>
      </div>

      <div className="adminTable">
        <div className="adminTableHeader">
          <div className="adminTableHeader-title">Calendar Categories</div>
        </div>
        <div className="adminTableBody">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                return (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td className="admin-calendar-button-wrapper">
                      <button
                        className="admin-calendar-button"
                        onClick={() => setEditModal({ open: true, category })}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="admin-calendar-button-wrapper">
                      <button
                        className="admin-calendar-button"
                        onClick={() => setDeleteModal({ open: true, id: category.id })}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddModal open={openAddModal} setOpen={setOpenAddModal} setCategories={setCategories} />
      <EditModal
        open={editModal.open}
        setOpen={newOpen => setEditModal({ ...editModal, open: newOpen })}
        category={editModal.category}
        setCategories={setCategories}
      />
      <ConfirmDeleteModal
        open={deleteModal.open}
        setOpen={newOpen => setDeleteModal({ ...deleteModal, open: newOpen })}
        categoryToDelete={deleteModal.id}
        setCategories={setCategories}
      />
    </div>
  )
}

function EditModal({ open, setOpen, category, setCategories }) {
  const [values, setValues] = useState({ name: '', description: '' })

  useEffect(() => {
    setValues({ name: category.name, description: category.description })
  }, [category])

  const handleSubmit = e => {
    e.preventDefault()

    Axios.patch(`http://127.0.0.1:8000/api/admin/calendar-categories/${category.id}`,
      { category: values },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setCategories(response.data.categories);
      setOpen(false)
    });
  }

  return (
    <Modal
      className="Modal admin-calendar-category-modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
    >
      <p className="category-modal-header">Edit Category</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="name">Name:</label>
          <input
            name="name"
            id="name"
            placeholder="Category name"
            onChange={e => setValues({ ...values, name: e.target.value })}
            value={values.name}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            rows={5}
            placeholder="Category description"
            onChange={e => setValues({ ...values, description: e.target.value })}
            value={values.description}
            required
          />
        </div>
        <div className="admin-calendar-button-wrapper">
          <button className="admin-calendar-button">Save</button>
        </div>
      </form>
    </Modal>
  )
}

function ConfirmDeleteModal({ open, setOpen, categoryToDelete, setCategories }) {
  const handleDelete = () => {
    Axios.delete(`http://127.0.0.1:8000/api/admin/calendar-categories/${categoryToDelete}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setCategories(response.data.categories);
      setOpen(false)
    });
  }

  return (
    <Modal
      className="Modal admin-calendar-category-modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
    >
      <p className="category-modal-header">Delete Category</p>
      <p>Are you sure you would like to delete this category?</p>
      <p>All events in this category will be deleted as well.</p>
      <div className="delete-confirm-buttons-wrapper">
        <div className="admin-calendar-button-wrapper">
          <button onClick={() => handleDelete()} type="button" className="admin-calendar-button">Confirm</button>
        </div>
        <div className="admin-calendar-button-wrapper">
          <button type="button" onClick={() => setOpen(false)} className="cancel admin-calendar-button">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

function AddModal({ open, setOpen, setCategories }) {
  const [values, setValues] = useState({ name: '', description: '' })

  const handleSubmit = e => {
    e.preventDefault()

    Axios.post("http://127.0.0.1:8000/api/admin/calendar-categories/", { category: values }, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setCategories(response.data.categories);
      setValues({ name: '', description: '' })
      setOpen(false)
    });
  }

  return (
    <Modal
      className="Modal admin-calendar-category-modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
    >
      <p className="category-modal-header">Add Category</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="name">Name:</label>
          <input
            name="name"
            id="name"
            placeholder="Category name"
            onChange={e => setValues({ ...values, name: e.target.value })}
            value={values.name}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            rows={5}
            placeholder="Category description"
            onChange={e => setValues({ ...values, description: e.target.value })}
            value={values.description}
            required
          />
        </div>
        <div className="admin-calendar-button-wrapper">
          <button className="admin-calendar-button">Add</button>
        </div>
      </form>
    </Modal>
  )
}
