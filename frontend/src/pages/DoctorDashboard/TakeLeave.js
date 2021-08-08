import React from 'react'
import DateTimePicker from "react-datetime-picker"
import "./TakeLeave.css"

const TakeLeave = () => {
    return (
        <div className="leave_application">
            <DateTimePicker>
            </DateTimePicker>
            <DateTimePicker>
            </DateTimePicker>
            <button>Cancel</button>
            <button>Reschedule</button>
            <button>Submit Leave</button>
        </div>
    )
}

export default TakeLeave
