import React, { useState, Component } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import Axios from "axios";
import Datetime from "react-datetime";

const localizer = momentLocalizer(moment);
Modal.setAppElement("body");

const Events = ({ className, events, setEvents, categories }) => {
  const [selectedEvent, setSelectedEvent] = useState();
  const [openModal, setOpenModal] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: "",
    allDay: false,
    start: null,
    end: null,
    selectable: true,
    description: "",
    category: "",
  });

  const handleSelectSlot = ({ start, end }) => {
    setOpenModal('new');
    setNewEvent((newEvent) => ({
      ...newEvent,
      start: start,
      end: end,
    }));
  };

  return (
    <div className={className}>
      <div className="calendar">
        <BigCalendar
          selectable
          popup
          localizer={localizer}
          views={["month"]}
          defaultView="month"
          defaultDate={new Date()}
          components={{ toolbar: CustomToolbar }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(e) => (
            setSelectedEvent(e), setOpenModal('show')
          )}
          events={events}
        />
        <ShowModal
          open={openModal === 'show'}
          setOpen={setOpenModal}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEvents={setEvents}
          categories={categories}
        />
        <NewModal
          open={openModal === 'new'}
          setOpen={setOpenModal}
          setSelectedEvent={setSelectedEvent}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          setEvents={setEvents}
          categories={categories}
        />
      </div>
    </div>
  );
};

function NewModal({
  open,
  setOpen,
  setSelectedEvent,
  setEvents,
  newEvent,
  setNewEvent,
  categories
}) {
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const createEvent = () => {
    Axios.post(
      "http://127.0.0.1:8000/api/admin/calendar-events/",
      {
        event: {
          title: newEvent.title,
          allDay: false,
          start: moment(newEvent.start.toString()).format("YYYY-MM-DD HH:MM"),
          end: moment(newEvent.end.toString()).format("YYYY-MM-DD HH:MM"),
          selectable: true,
          description: newEvent.description,
          category_id: newEvent.category,
        },
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      setOpen('')
      setEvents(response.data.events)
    });
  };

  return (
    <Modal
      className="Modal Event-Modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => (setSelectedEvent(), setOpen(''))}
      ariaHideApp={false}
    >
      {newEvent ? (
        <div className="modal-event">
          <div className="header">
            <span />
            <div className="title">New Event</div>
            <div
              className="close"
              onClick={() => (setSelectedEvent(), setOpen(''))}
            >
              x
            </div>
          </div>
          <div className="body">
            <div className="title">
              <label htmlFor="">Title</label>
              <input
                type="text"
                name="title"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="desc">
              <label htmlFor="">Description</label>
              <textarea
                name="description"
                id=""
                cols="30"
                rows="10"
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
            <div className="category">
              <label>Category</label>
              <select
                name="category"
                cols="30"
                rows="10"
                onChange={(e) => handleChange(e)}
                value={newEvent.category}
                required
              >
                <option value="">No category</option>
                {categories.map(category => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="date-times">
              <div className="input-container">
                <label htmlFor="">Start</label>
                <Datetime
                  value={newEvent.start}
                  onChange={(date) =>
                    setNewEvent((newEvent) => ({
                      ...newEvent,
                      start: date,
                    }))
                  }
                />
              </div>

              <div className="input-container">
                <label htmlFor="">End</label>
                <Datetime
                  value={newEvent.end}
                  onChange={(date) =>
                    setNewEvent((newEvent) => ({
                      ...newEvent,
                      end: date,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <button onClick={createEvent}>Submit</button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

function ShowModal({
  open,
  setOpen,
  setSelectedEvent,
  selectedEvent,
  setEvents,
  categories,
}) {
  const deleteEvent = () => {
    Axios.delete(
      `http://127.0.0.1:8000/api/admin/calendar-events/${selectedEvent.id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      setOpen('')
      setEvents(response.data.events)
    });
  };

  const editEvent = () => {
    Axios.patch(
      `http://127.0.0.1:8000/api/admin/calendar-events/${selectedEvent.id}`,
      {
        event: {
          title: selectedEvent.title,
          allDay: false,
          start: moment(selectedEvent.start).format("YYYY-MM-DD HH:mm"),
          end: moment(selectedEvent.end).format("YYYY-MM-DD HH:mm"),
          selectable: true,
          description: selectedEvent.description,
          category_id: selectedEvent.category,
        },
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then((response) => {
      setOpen('')
      setEvents(response.data.events)
    });
  };

  return (
    <Modal
      className="Modal Event-Modal"
      overlayClassName="Overlay"
      isOpen={open}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => (setSelectedEvent(), setOpen(''))}
      ariaHideApp={false}
    >
      {selectedEvent ? (
        <div className="modal-event">
          <div className="header">
            <span />
            <div className="title">Edit Event</div>
            <div
              className="close"
              onClick={() => (setSelectedEvent(), setOpen(''))}
            >
              x
            </div>
          </div>
          <div className="body">
            <div className="title">
              <label htmlFor="">Title</label>
              <input
                type="text"
                name="title"
                onChange={(e) =>
                  setSelectedEvent((selectedEvent) => ({
                    ...selectedEvent,
                    title: e.target.value,
                  }))
                }
                value={selectedEvent.title}
              />
            </div>
            <div className="desc">
              <label htmlFor="">Description</label>
              <textarea
                name="description"
                id=""
                cols="30"
                rows="10"
                onChange={(e) =>
                  setSelectedEvent((selectedEvent) => ({
                    ...selectedEvent,
                    description: e.target.value,
                  }))
                }
                value={selectedEvent.description}
              ></textarea>
            </div>
            <div className="category">
              <label>Category</label>
              <select
                name="category"
                cols="30"
                rows="10"
                onChange={(e) =>
                  setSelectedEvent((selectedEvent) => ({
                    ...selectedEvent,
                    category: e.target.value,
                  }))
                }
                value={selectedEvent.category}
                required
              >
                <option value="">No category</option>
                {categories.map(category => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="date-times">
              <div className="input-container">
                <label htmlFor="">Start</label>
                <Datetime
                  value={moment(selectedEvent.start)}
                  onChange={(date) =>
                    setSelectedEvent((selectedEvent) => ({
                      ...selectedEvent,
                      start: date,
                    }))
                  }
                />
              </div>

              <div className="input-container">
                <label htmlFor="">End</label>
                <Datetime
                  value={moment(selectedEvent.end)}
                  onChange={(date) =>
                    setSelectedEvent((selectedEvent) => ({
                      ...selectedEvent,
                      end: date,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <button className="delete" onClick={deleteEvent}>
              Delete
            </button>
            <button onClick={editEvent}>Submit</button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

class CustomToolbar extends Component {
  render() {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => this.navigate("TODAY")}>
            today
          </button>
          <button type="button" onClick={() => this.navigate("PREV")}>
            back
          </button>
          <button type="button" onClick={() => this.navigate("NEXT")}>
            next
          </button>
        </span>
        <span className="rbc-toolbar-label">{this.props.label}</span>
      </div>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };
}

export default Events;
