import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import './custom.css';
import './filters.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import { 
  setSearchQuery, 
  clearSearchQuery, 
  setCategoryFilter,
  setDueDateFilter 
} from '../redux/slices/taskSlice';

export default function Filters({selectedCategory = ""}) {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.tasks.searchQuery);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedCategoryState, setSelectedCategoryState] = useState(selectedCategory);
    const [selectedDueDateState, setSelectedDueDateState] = useState('');

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

    const handleCategoryChange = (category) => {
        setSelectedCategoryState(category);
        dispatch(setCategoryFilter(category));
    };

    const handleClearCategoryFilter = () => {
        setSelectedCategoryState('');
        dispatch(setCategoryFilter(''));
    };

    const handleDueDateChange = (dueDate) => {
        setSelectedDueDateState(dueDate);
        dispatch(setDueDateFilter(dueDate));
    };

    const handleClearDueDateFilter = () => {
        setSelectedDueDateState('');
        dispatch(setDueDateFilter(''));
    };

    return (
        <div className="px-4">
            <div className="d-flex flex-row align-items-center justify-content-between flex-wrap">
                <div className="d-flex flex-row align-items-center">
                    Filters by : 
                    {/* Category Dropdown */}
                    <div className="dropdown ms-2 d-flex align-items-center">
                        <button 
                            className="btn dropdown-btn dropdown-toggle d-flex align-items-center" 
                            type="button" 
                            id="categoryDropdown" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            {selectedCategoryState || 'Category'}
                        </button>
                        {selectedCategoryState && (
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                className="ms-2 text-muted" 
                                style={{ cursor: 'pointer' }}
                                onClick={handleClearCategoryFilter}
                            />
                        )}
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            <li>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => handleCategoryChange('work')}
                                >
                                    Work
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => handleCategoryChange('personal')}
                                >
                                    Personal
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Due Date Dropdown */}
                    <div className="dropdown ms-2 d-flex align-items-center">
                        <button 
                            className="btn dropdown-btn dropdown-toggle d-flex align-items-center" 
                            type="button" 
                            id="dueDateDropdown" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            {selectedDueDateState || 'Due Date'}
                        </button>
                        {selectedDueDateState && (
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                className="ms-2 text-muted" 
                                style={{ cursor: 'pointer' }}
                                onClick={handleClearDueDateFilter}
                            />
                        )}
                        <ul className="dropdown-menu" aria-labelledby="dueDateDropdown">
                            <li>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => handleDueDateChange('Today')}
                                >
                                    Today
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => handleDueDateChange('Tomorrow')}
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
                            {!searchQuery && (
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                            )}
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
                                    className="btn clear-search-btn" 
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
                                className="btn purple-btn ms-2 small-screen-hide"
                                onClick={handleOpenAddTaskModal}
                            >
                                ADD TASK
                            </button>
                            <button 
                                className="btn mt-2 purple-btn ms-2 big-screen-hide add-task-mobile-btn"
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