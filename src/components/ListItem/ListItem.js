import React from "react";
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './style.css';
import {
    TableCell,
    TableRow,
    Chip,
    Checkbox,
} from '@mui/material';
import { updateTask, openEditModal } from '../../redux/slices/taskSlice';

function ListItem({ id, task, isSelected, onSelect }) {
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

    const statusOptions = [{ label: "To-Do", value: "todo" }, { label: "In Progress", value: "in-progress" }, { label: "Completed", value: "completed" }];

    function handleStatusChange(newStatus) {
        dispatch(updateTask({ id, status: newStatus }));
    }

    function handleEditTask() {
        dispatch(openEditModal(id));
    }

    function handleDeleteTask() {
        if (window.confirm("Are you sure you want to delete this task?")) {
            dispatch(updateTask({ id, status: "deleted" }));
        }
    }

    return (
        <TableRow
            ref={setNodeRef} style={style}
            key={task.id}
            sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
            }}
        >
            <TableCell                     
                sx={{width: '4px'}}
            >
                <Checkbox 
                    checked={isSelected} 
                    onChange={onSelect}
                />
            </TableCell>
            <TableCell  {...listeners} {...attributes} sx={{width: '4px'}} className="small-screen-hide"><i className="fas fa-grip-vertical gray"></i></TableCell>
            <TableCell sx={{width: '400px'}}>{task.title}</TableCell>
            <TableCell className="small-screen-hide">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell className="small-screen-hide">
                <div className="dropdown ms-2">
                    <button
                        className="btn dropdown-btn status-dropdown d-flex align-items-center"
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
            <TableCell className="small-screen-hide">
                <Chip
                    label={task.category}
                    variant="outlined"
                    size="small"
                />
            </TableCell>
            <TableCell>
                <div className="dropdown ms-2">
                    <button
                        className="actions-btn d-flex align-items-center"
                        type="button"
                        id="actionDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fas fa-ellipsis-v gray"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="actionDropdown">
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={handleEditTask}
                            >
                                <i class="fa-solid fa-pen me-1"></i>
                                Edit
                            </button>
                        </li>
                        <li>
                            <button
                                className="dropdown-item red"
                                onClick={handleDeleteTask}
                            >
                                <i class="fa-solid fa-trash-can red me-2"></i>
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>

            </TableCell>
        </TableRow>
    )

}

export default ListItem;