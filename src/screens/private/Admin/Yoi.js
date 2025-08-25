import React, {useEffect, useState} from "react";
import Registrations from './AdminYoi/Registrations'
import Assistants from './AdminYoi/Assistants'
import Axios from "axios";

export default function Yoi({ className }) {
  const [selected, setSelected] = useState('registrations')
  const [data, setData] = useState({ children: [], assistants: [] })

  useEffect(() => {
    Axios.get('http://127.0.0.1:8000/api/admin/YOI/', {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
    }).then((response) => {
      setData(response.data)
    })
  }, [])

  return (
    <div className={`admin-yoi admin-with-dropdown ${className}`}>
      <select className='dropdown' value={selected} onChange={e => setSelected(e.target.value)}>
        <option value='registrations'>Registrations</option>
        <option value='assistants'>Assistants</option>
      </select>
      <Registrations children={data.children} className={`adminElement ${selected !== 'registrations' && 'hide'}`} />
      <Assistants assistants={data.assistants} className={`adminElement ${selected !== 'assistants' && 'hide'}`} />
    </div>
  )
}
