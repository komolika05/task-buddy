import React, { useState } from "react";
import './custom.css';
import './filters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AddTaskModal from "./AddTaskModal/AddTaskModal";

export default function Filters({selectedCategory = "All"}) {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const handleOpenAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };

    const handleCloseAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
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
                            />
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