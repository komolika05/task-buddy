import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  deleteTask, 
  reorderTasks 
} from '../redux/slices/taskSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './listView.css';
import ListItem from './ListItem/ListItem';
import MultiTaskSelectFloater from './MultiTaskSelectFloater';

// For sortable functionality
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { updateTask } from '../redux/slices/taskSlice';

export default function ListView() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const categoryFilter = useSelector((state) => state.tasks.categoryFilter);
  const dueDateFilter = useSelector((state) => state.tasks.dueDateFilter);
  const [expanded, setExpanded] = useState('todo');
  const [selectedTasks, setSelectedTasks] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      dispatch(reorderTasks({ sourceId: active.id, destinationId: over.id, sourceIndex: active.data.current.sortable.index, destinationIndex: over.data.current.sortable.index }));
    }
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filterAndSortTasksByStatus = (status) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return tasks
      .filter(task => {
        const matchesStatus = task.status.toLowerCase() === status.toLowerCase();
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // If no category filter is set, include all tasks
        const matchesCategory = !categoryFilter || task.category === categoryFilter;
        
        // If no due date filter is set, include all tasks
        let matchesDueDate = true;
        if (dueDateFilter === 'Today') {
          matchesDueDate = task.dueDate === today;
        } else if (dueDateFilter === 'Tomorrow') {
          matchesDueDate = task.dueDate === tomorrow;
        }

        return matchesStatus && matchesSearch && matchesCategory && matchesDueDate;
      })
      .sort((a, b) => a.order - b.order);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(taskId => {
        dispatch(deleteTask(taskId));
      });
      setSelectedTasks([]);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    selectedTasks.forEach(taskId => {
      dispatch(updateTask({ id: taskId, status: newStatus }));
    });
    setSelectedTasks([]);
  };

  const renderTaskRows = (filteredTasks) => {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <ListItem 
              id={task.id} 
              key={task.id} 
              task={task} 
              isSelected={selectedTasks.includes(task.id)}
              onSelect={() => handleTaskSelect(task.id)}
            />
          ))}
        </SortableContext>
      </DndContext>);
  };

  const accordionSections = [
    { id: 'todo', label: 'To Do', status: 'todo' },
    { id: 'inprogress', label: 'In Progress', status: 'inProgress' },
    { id: 'completed', label: 'Completed', status: 'completed' }
  ];

  return (
    <div className="mt-3 px-2 position-relative">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tasks table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell><strong>Task Name</strong></TableCell>
              <TableCell><strong>Due On</strong></TableCell>
              <TableCell><strong>Task Status</strong></TableCell>
              <TableCell><strong>Task Category</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accordionSections.map((section) => {
              const filteredTasks = filterAndSortTasksByStatus(section.status);
              return filteredTasks.length > 0 ? (
                <TableRow key={section.id}>
                  <TableCell colSpan={5} style={{ padding: 0 }}>
                    <Accordion
                      expanded={true}
                      onChange={handleAccordionChange(section.id)}
                      className={`accordion-${section.id}`}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {section.label} ({filteredTasks.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: 0 }}>
                        <Table>
                          <TableBody>
                            {renderTaskRows(filteredTasks)}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ) : null;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <MultiTaskSelectFloater 
        selectedTasks={selectedTasks} 
        onDelete={handleBulkDelete} 
        onChangeStatus={handleBulkStatusChange} 
        onClose={() => setSelectedTasks([])}
      />
    </div>
  );
}