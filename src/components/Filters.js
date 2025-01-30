import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import './custom.css';
import './filters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import { setSearchQuery, clearSearchQuery } from '../redux/slices/taskSlice';

export default function Filters({selectedCategory = "All"}) {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.tasks.searchQuery);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const handleOpenAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };

    const handleCloseAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleClearSearch = () => {
        dispatch(clearSearchQuery());
    };

    return (
        <div className="px-4">
            <div className="d-flex flex-row align-items-center justify-content-between">
                <div className="d-flex flex-row align-items-center">
                    Filters by : 
                    {/* Category Dropdown */}
                    <div className="dropdown ms-2">
                        <button 
                            className="btn dropdown-btn dropdown-toggle d-flex align-items-center" 
                            type="button" 
                            id="categoryDropdown" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            Category
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    All
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    Work
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    Personal
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Due Date Dropdown */}
                    <div className="dropdown ms-2">
                        <button 
                            className="btn dropdown-btn dropdown-toggle d-flex align-items-center" 
                            type="button" 
                            id="categoryDropdown" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            Due Date
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    All
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    Today
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                >
                                    Tomorrow
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="d-flex flex-row align-items-center">
                    {/* Search Bar */}
                    <div className="ms-auto d-flex flex-row align-items-center">
                        <div className="search-container">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search"
                                aria-label="Search tasks"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <button 
                                    className="btn btn-link clear-search-btn" 
                                    onClick={handleClearSearch}
                                    style={{
                                        position: 'absolute', 
                                        right: '10px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <div>
                            <button 
                                className="btn purple-btn ms-2"
                                onClick={handleOpenAddTaskModal}
                            >
                                ADD TASK
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddTaskModalOpen && (
                <AddTaskModal onClose={handleCloseAddTaskModal} />
            )}
        </div>
    );
}