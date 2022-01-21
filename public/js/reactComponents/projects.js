'use strict';

const e = React.createElement;

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {

        return (
            <div class="apps-row">

                <div class="app-column">
                    <a href="http://sun-house-site.herokuapp.com/">
                        <h3><u>Sun House - Emergency shelter site</u></h3>
                        <img src="/img/sun-house-site.png" alt="Sun House Site" />
                    </a>
                </div>

                <div class="app-column">
                    <a href="http://day-chat-app.herokuapp.com/">
                        <h3><u>Chat room app - socket.io</u></h3>
                        <img src="/img/chat-app.png" alt="chat app" />
                    </a>
                </div>

                <div class="app-column">
                    <a href="http://day-weather-application.herokuapp.com/">
                        <h3><u>Open window - Weather lookup</u></h3>
                        <img src="/img/weather-app.png" alt="weather app" />
                    </a>
                </div>

            </div>
        );
    }
}

const domContainer = document.getElementById('projects');
ReactDOM.render(e(Projects), domContainer);