import React, { useState, Component, useEffect, Fragment } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { connect } from "react-redux";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import Axios from "axios";

const localizer = momentLocalizer(moment);

Modal.setAppElement("body");

const Calendar = ({ user }) => {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userCategories, setUserCategories] = useState(user.profile.calendar_event_categories)
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/calendar-events/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setEvents(response.data.events.map(event => {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
        return event
      }));
      setCategories(response.data.categories);
    });
  }, []);

  return (
    <div className="calendar">
      {categories.length > 0 && (
        <button
          className="user-calendar-categories-update-button"
          onClick={() => setShowCategoriesModal(true)}
        >
          Update calendar categories
        </button>
      )}
      <BigCalendar
        selectable
        localizer={localizer}
        views={["month", "day"]}
        date={date}
        view={view}
        onNavigate={newDate => setDate(newDate)}
        onView={newView => setView(newView)}
        onSelectEvent={(e) => {
          setSelectedEvent(e)
          setShowModal(true)
        }}
        onSelectSlot={e => {
          if (view === 'month') {
            setView('day')
            setDate(e.slots[0])
          }
        }}
        events={events}
      />
      <CategoriesModal
        open={showCategoriesModal}
        setOpen={setShowCategoriesModal}
        userCategories={userCategories}
        setUserCategories={setUserCategories}
        categories={categories}
        setEvents={setEvents}
      />
      <Modal
        className="Modal Event-Modal"
        overlayClassName="Overlay"
        isOpen={showModal}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => (setSelectedEvent(), setShowModal(false))}
        ariaHideApp={false}
      >
        {selectedEvent ? (
          <div className="modal-event">
            <div className="header">
              <span />
              <div className="title">{selectedEvent.title}</div>
              <div
                className="close"
                onClick={() => (setSelectedEvent(), setShowModal(false))}
              >
                x
              </div>
            </div>
            <div className="body-show">
              <div className="desc-show">{selectedEvent.description}</div>
              <div className="date-times-show">
                <div className="time">
                  <div>Start:</div>
                  {moment(selectedEvent.start).format("MM-DD-YYYY h:mm a")}
                </div>{" "}
                <div className="time">
                  <div>End:</div>
                  {moment(selectedEvent.end).format("MM-DD-YYYY h:mm a")}
                </div>
              </div>
            </div>
            <div className="footer"></div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

function CategoriesModal({ open, setOpen, userCategories, setUserCategories, categories, setEvents }) {
  const [selectedCategories, setSelectedCategories] = useState({})

  useEffect(() => {
    setSelectedCategories(
      categories.reduce((previousCategories, currentCategory) => {
        return {
          ...previousCategories,
          [currentCategory.id]: userCategories.includes(currentCategory.id)
        }
      }, {})
    )
  }, [categories, open])

  const handleSubmit = e => {
    e.preventDefault()

    const categoriesData = Object.entries(selectedCategories).reduce(
      (previousData, [id, isChecked]) => {
        const newData = [...previousData]

        if (isChecked) {
          newData.push(Number(id))
        }

        return newData
      },
      []
    )

    Axios.patch("http://127.0.0.1:8000/api/calendar-event-categories/", { categories: categoriesData }, {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setEvents(response.data.events);
      setUserCategories(categoriesData)
      setOpen(false)
    });
  }

  return (
    <Modal
      className="Modal user-calendar-category-modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <p className="header-text">Select the categories you would like to see on your calendar</p>
        {categories.map(category => (
          <div key={category.id} className="user-category-container">
            <div>
              <input
                onChange={e => {
                  setSelectedCategories({ ...selectedCategories, [category.id]: e.target.checked })
                }}
                type="checkbox"
                checked={category.id in selectedCategories && selectedCategories[category.id]}
                name={`category-${category.id}`}
                id={`category-${category.id}`}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
            <p>{category.description}</p>
          </div>
        ))}
        <div>
          <div>
            <button type="submit">Confirm</button>
          </div>
          <div>
            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

function mapStateToProps(state) {
  return { user: state.auth.user };
}

export default connect(mapStateToProps)(Calendar);
