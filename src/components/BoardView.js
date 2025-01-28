import react from "react";
import './custom.css';
import './boardView.css';

export default function BoardView() {
    return (
        <div className="d-flex flex-row p-3">
            <div className="gray-box me-3">
                <div className="todo-tag text-center">TO-DO</div>
            </div>
            <div className="gray-box me-3">
                <div className="in-progress-tag">IN-PROGRESS</div>
            </div>
            <div className="gray-box">
                <div className="completed-tag">COMPLETED</div>
            </div>
        </div>
    );
}