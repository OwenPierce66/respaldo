import React, {useEffect, useState} from "react"
import Events from './AdminCalendar/Events'
import Categories from './AdminCalendar/Categories'
import Axios from "axios";

export default function Calendar({ className }) {
  const [selected, setSelected] = useState('events')
  const [data, setData] = useState({ events: [], categories: [] })

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/admin/calendar-events/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
        setData({ events: response.data.events, categories: response.data.categories })
    });
  }, []);

  return (
    <div className={`admin-with-dropdown ${className}`}>
      <select className='dropdown' value={selected} onChange={e => setSelected(e.target.value)}>
        <option value='events'>Events</option>
        <option value='categories'>Categories</option>
      </select>
      <Events
        events={data.events}
        categories={data.categories}
        setEvents={newEvents => setData({ ...data, events: newEvents })}
        className={`adminElement ${selected !== 'events' && 'hide'}`}
      />
      <Categories
        categories={data.categories}
        setCategories={newCategories => setData({ ...data, categories: newCategories })}
        className={`adminElement ${selected !== 'categories' && 'hide'}`}
      />
    </div>
  )
}
