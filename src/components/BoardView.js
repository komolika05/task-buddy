import react from "react";
import './custom.css';
import './boardView.css';
import { useSelector } from 'react-redux';

export default function BoardView() {
    const tasks = useSelector((state) => state.tasks.tasks);
    return (
        <div className="d-flex flex-row p-3">
            <div className="gray-box me-3 p-2">
                <div className="todo-tag text-center mb-3">TO-DO</div>
                {
                    tasks.filter(task => task.status === 'todo').map(task => (
                        <div className="card mb-2 d-flex flex-column justify-content-between">
                            <div key={task.id} className="p-3">
                                <strong> {task.title} </strong>
                            </div>
                            <div className="gray card-category-text p-2">{task.category}</div>
                        </div>
                    ))
                }
            </div>
            <div className="gray-box me-3 p-2">
            <div className="in-progress-tag mb-3">IN-PROGRESS</div>
                {
                    tasks.filter(task => task.status === 'inProgress').map(task => (
                        <div className="card mb-2">
                            <div key={task.id} className="p-3">
                               <strong> {task.title} </strong>
                            </div>
                            <div className="gray card-category-text p-2">{task.category}</div>
                        </div>
                    ))
                }
            </div>
            <div className="gray-box p-2">
            <div className="completed-tag mb-3">COMPLETED</div>
                {
                    tasks.filter(task => task.status === 'completed').map(task => (
                        <div className="card mb-2">
                            <div key={task.id} className="p-3" style={{textDecoration: "line-through"}}>
                                <strong>{task.title} </strong>
                            </div>
                            <div className="gray card-category-text p-2">{task.category}</div>
                        </div>
                    ))
                }

            </div>
        </div>
    );
}