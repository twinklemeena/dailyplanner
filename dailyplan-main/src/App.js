import { useState } from 'react'
import './style.css';
import axios from 'axios'

function App() {

  /* Date State */
  const [fromDate, setFromDate] = useState('XX/XX/XX')
  const [toDate, setToDate] = useState('XX/XX/XX')
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')

  /* Class State */

  const [cls, setCls] = useState('')
  const [clas, setClas] = useState('')

  /* Present Date State */
  const [pDate, setPDate] = useState('')
  const [presentDate, setPresentDate] = useState('')

  /* Day state */

  const [day, setDay] = useState('')
  const [dayHeader, setDayHeader] = useState('')

  /* subject state */

  const [sub, setSub] = useState('')
  const [teacher, setTeacher] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [pd, setPd] = useState('')
  const [chapter, setChapter] = useState('')

  /* Form State */

  const [form, setForm] = useState([])
  const [id_1, setId_1] = useState(1)

  /* Extra Subjects */
    const [subs, setSubs] = useState('')

    const [subId, setSubId] = useState(1)

    const [extra, setExtra] = useState([])
  /* functions */

  const changeToValue = (e) => {
    setTo(e.target.value)
  }
  const changeFromValue = (e) => {
    setFrom(e.target.value)
  }
  const changeClassValue = (e) => {
    setCls(e.target.value)
  }
  const changePresentDateValue = (e) => {
    setPDate(e.target.value)
  }

  const changeDayValue = (e) => {
    setDay(e.target.value)
  }

  const handleClick = () => {

    axios.post("http://35.223.189.206/form_details/insert", {
      from_date: from,
      to_date: to,
      clas_s: cls,
      date: pDate,
      day: day
    })

    setFromDate(to)
    setToDate(from)
    setClas(cls)
    setPresentDate(pDate)
    setDayHeader(day)
  }

  const submit = () => {

    axios.post("http://35.223.189.206/period_details/insert", {
      date: pDate,
      period_number: pd,
      subject: sub,
      teacher: teacher,
      phone: phone,
      topic: topic
    })
    setForm([...form, {
      id: Math.floor(Math.floor(Math.random() * 10000)),
      period: pd,
      subject: sub,
      teacher: teacher,
      phone: phone,
      topic: topic,
      chapter: chapter

    }])
  }

  const submitExtraSub = () => {
    
    setSubId(subId + 1)

    setExtra([...extra, {
      id : subId,
      subject: subs
    }])

    console.log(extra)
  }

  const generatePDF = () => {
    setId_1(Math.floor(Math.floor(Math.random() * 10000)))
    // setId_1(id_1 + 1);
    axios.post("http://35.223.189.206/generate/pdf", {
      id_1: id_1,
      date: pDate,
      period_number: pd,
      subject: sub,
      teacher: teacher,
      phone: phone,
      topic: topic,
      from_date: from,
      to_date: to,
      clas_s: cls,
      chapter: chapter,
      day: day,
      form: form,
      extra: extra
    })
  }

  const downloadPDF = () => {
    axios.post("http://35.223.189.206/download/pdf", {
      id_1: id_1
    })
  }
  return (

    /* input form */
    <div className="form">
      <h1>Daily Plan</h1>
      <div>
        <label >From</label>
        <input type="date" placeholder="FROM DATE" onChange={changeFromValue} />
        <label>To</label>
        <input placeholder="TO DATE" type="date" onChange={changeToValue} />
        <label>Class</label>
        <input placeholder="Class" type="text" onChange={changeClassValue} />
        <label>Day</label>
        <input placeholder="Day" type="text" onChange={changeDayValue} />
        <label>Present Date</label>
        <input placeholder="Date" type="date" onChange={changePresentDateValue} />
        <button variant="contained" onClick={handleClick}>SUBMIT</button>
      </div>
      <br />

      {/* Period Details */}

      <div>
        <label>Period Details</label>
        <input placeholder="Period Number" onChange={e => setPd(e.target.value)} type="text" />
        <input placeholder="Subject" onChange={e => setSub(e.target.value)} type="text" />
        <input placeholder="Teacher Name" onChange={e => setTeacher(e.target.value)} type="text" />
        <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} type="text" />
        <input placeholder="Chapter" type="text" onChange={e => setChapter(e.target.value)} />
        <input placeholder="Topic" type="text" onChange={e => setTopic(e.target.value)} />
        <button variant="contained" onClick={submit}>SUBMIT</button>
      </div>

      <br />

      <div>
        <label >Extra Subject</label>
        <input placeholder="Subject Name" type="text" onChange={e => setSubs(e.target.value)} /> 
        <button onClick={submitExtraSub}>SUBMIT</button>
      </div>



      {/* Main */}

      <div className="body">
        <div className="header">
          <h1>Weekly Online Learning Schedule</h1>
          <h3 className="in-hd"> Date - {fromDate} to {toDate} </h3>
          <h3 className="in-hd">Class - {clas}</h3>
          <h3 className="in-hd">{dayHeader} - {presentDate}</h3>
        </div>
        <div>
          {
            form.map(form => (
              <div>
                <h3>Period {form.period} {form.subject} [{form.teacher}] Ph no. {form.phone}</h3>
                <h3>Zoom Interactive class(Chap {form.chapter}- Topic {form.topic})</h3>
              </div>
            ))
          }
        </div>
        <div className="footer">
          <h2>5:00PM – 6:00 PM  - SELF STUDY/REVISION TIME</h2>
        </div>
        <div className="content">
        {
          extra.map(extra => (
            <div>
              <h3>Sub {extra.id} : {extra.subject}</h3>
            </div>
          ))
        }
        </div>
        <div>
          <h2>Note: In each period Teacher will be available on
            phone after Zoom interactive class/tutorial video,
            till the period ends. Feel free to interact through
            text/voice messaging or calling the teacher. </h2>
        </div>
      </div>
      <button onClick={() => 
        {generatePDF() ; downloadPDF()}}>Generate</button> 
    </div>
  );
}

export default App;
