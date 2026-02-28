import Button from "./Button.jsx"

function Card(props) {
    return (
        <div className="card">
            <div className="card-body">
                <img
                    className="card-image"
                    src={props.image}
                    alt="Spirit the horse"
                />
                <h2 className="card-title">{props.name}</h2>
                <p className="card-text">
                    <b>Status:</b> {props.status} <br />
                    <b>Location:</b> {props.location} <br />
                    <b>Next Task:</b> {props.nextTask}
                </p>

            </div>
            <div className="card-button">
                <Button label="Open Profile"/>
            </div>
        </div>
    );
}

export default Card;