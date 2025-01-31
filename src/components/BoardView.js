import React, { useState } from "react";
import './custom.css';
import './boardView.css';
import { useSelector, useDispatch } from 'react-redux';
import { openEditModal, deleteTask, updateTask, reorderTasks } from '../redux/slices/taskSlice';

// Import dnd-kit libraries
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    closestCorners,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Create a Sortable Card Component
function SortableCard({ task, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'pointer'
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            {...attributes}
            {...listeners}
            className="card mb-2 d-flex flex-column justify-content-between"
        >
            <div className="p-3 d-flex justify-content-between">
                <strong>{task.title}</strong>
                <div className="dropdown ms-2">
                    <button
                        className="actions-btn d-flex align-items-center"
                        type="button"
                        id="actionDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fas fa-ellipsis-h gray"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="actionDropdown">
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => onEdit(task.id)}
                            >
                                <i className="fa-solid fa-pen me-1"></i>
                                Edit
                            </button>
                        </li>
                        <li>
                            <button
                                className="dropdown-item red"
                                onClick={() => onDelete(task.id)}
                            >
                                <i className="fa-solid fa-trash-can me-1"></i>
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-3 d-flex flex-row justify-content-between">
                <div className="gray card-category-text">{task.category}</div>
                <div className="gray card-category-text">{task.dueDate}</div>
            </div>
        </div>
    );
}

export default function BoardView() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const searchQuery = useSelector((state) => state.tasks.searchQuery);
    const categoryFilter = useSelector((state) => state.tasks.categoryFilter);
    const dueDateFilter = useSelector((state) => state.tasks.dueDateFilter);
    const [activeTask, setActiveTask] = useState(null);

    const statuses = ['todo', 'in-progress', 'completed'];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Allow small movements before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event) {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        setActiveTask(task);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveTask(null);

        if (over) {
            const sourceTask = tasks.find(task => task.id === active.id);
            const destinationTask = tasks.find(task => task.id === over.id);

            // Determine the new status based on the column
            const newStatus = statuses.find(status => 
                filterTasksByStatusAndSearch(status).some(task => task.id === over.id)
            );

            if (sourceTask) {
                if (newStatus && sourceTask.status !== newStatus) {
                    // Update task status when dragged to a different column
                    dispatch(updateTask({ 
                        id: sourceTask.id, 
                        status: newStatus 
                    }));
                } else if (destinationTask && sourceTask.status === destinationTask.status) {
                    // Reorder tasks within the same status
                    dispatch(reorderTasks({ 
                        sourceId: active.id, 
                        destinationId: over.id, 
                        sourceIndex: active.data.current.sortable.index, 
                        destinationIndex: over.data.current.sortable.index 
                    }));
                }
            }
        }
    }

    const handleEditTask = (taskId) => {
        dispatch(openEditModal(taskId));
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const filterTasksByStatusAndSearch = (status) => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return tasks.filter(task => {
            const matchesStatus = task.status === status;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = !categoryFilter || task.category === categoryFilter;
            
            let matchesDueDate = true;
            if (dueDateFilter === 'Today') {
              matchesDueDate = task.dueDate === today;
            } else if (dueDateFilter === 'Tomorrow') {
              matchesDueDate = task.dueDate === tomorrow;
            }

            return matchesStatus && matchesSearch && matchesCategory && matchesDueDate;
        }).sort((a, b) => a.order - b.order);
    };

    const renderTaskCards = (status) => {
        const filteredTasks = filterTasksByStatusAndSearch(status);
        return (
            <SortableContext
                items={filteredTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
            >
                {filteredTasks.map(task => (
                    <SortableCard 
                        key={task.id} 
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </SortableContext>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="d-flex flex-row p-3">
                {
                    statuses.map(status => (
                        <div key={status} className="gray-box me-3 p-2">
                            <div className={`${status}-tag text-center mb-3`}>
                                {status.toUpperCase()} ({filterTasksByStatusAndSearch(status).length})
                            </div>
                            {
                                filterTasksByStatusAndSearch(status).length === 0 ? (
                                    <div className="p-3 text-center">
                                        No task is {status}
                                    </div>
                                ) : renderTaskCards(status)
                            }
                        </div>
                    ))
                }
                <DragOverlay>
                    {activeTask ? (
                        <div className="card mb-2 d-flex flex-column justify-content-between">
                            <div className="p-3 d-flex justify-content-between">
                                <strong>{activeTask.title}</strong>
                            </div>
                            <div className="p-3 d-flex flex-row justify-content-between">
                                <div className="gray card-category-text">{activeTask.category}</div>
                                <div className="gray card-category-text">{activeTask.dueDate}</div>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}