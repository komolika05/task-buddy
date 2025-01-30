import React from "react";
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './style.css';
import {
    TableCell,
    TableRow,
    Chip,
} from '@mui/material';
import { updateTask } from '../../redux/slices/taskSlice';

function ListItem({ id, task }) {
    const dispatch = useDispatch();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const statusOptions = [{ label: "To-Do", value: "todo" }, { label: "In Progress", value: "inProgress" }, { label: "Completed", value: "completed" }];

    function handleStatusChange(newStatus) {
        dispatch(updateTask({ id, status: newStatus }));
    }
    return (
        <TableRow
            ref={setNodeRef} style={style}
            key={task.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            {/* !IMPORTANT: keep listeners separate from TableRow, they hinder with other TableRow oncclick listeners (like dropdown item)*/}
            <TableCell  {...listeners} {...attributes}><i className="fas fa-grip-vertical gray"></i></TableCell>
            <TableCell>{task.title}</TableCell>
            <TableCell>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell>
                <div className="dropdown ms-2">
                    <button
                        className="btn dropdown-btn dropdown-toggle d-flex align-items-center"
                        type="button"
                        id="categoryDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {statusOptions.find(option => option.value === task.status)?.label || "Status"}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                        {statusOptions.map((option) => (
                            <li key={option.value} onClick={(e) => {
                                handleStatusChange(option.value)
                            }}>
                                <button
                                    className={`dropdown-item ${option.value === task.status ? 'selected' : ''}`}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </TableCell>
            <TableCell>
                <Chip
                    label={task.category}
                    variant="outlined"
                    size="small"
                />
            </TableCell>
        </TableRow>
    )

}

export default ListItem;