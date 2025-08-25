import React, { Component } from 'react'
import moment from 'moment'

export default class Countdown extends Component {
    state = {
        minutes: 3,
        seconds: 0,
    }

    componentDidMount(){
        this.interval = setInterval(() => {
            const then = moment("07 18 2021, 12:00 pm", "M DD YYYY, h:mm a");
            const now = moment();
            const countdown = moment(then - now);
            const days = countdown.format('D');
            const hours = countdown.format('HH');
            const minutes = countdown.format('mm');
            const seconds = countdown.format('ss');
    
            this.setState({ days, hours, minutes, seconds });
        }, 1000);
    }


    render() {
        const {days, hours, minutes, seconds} = this.state
        return (
            <div className="sub-title">{days} days, {hours} hr, {minutes} min, {seconds} sec left</div>
        )
    }
}