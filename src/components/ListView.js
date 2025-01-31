import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  deleteTask, 
  reorderTasks,
  updateTask 
} from '../redux/slices/taskSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function ListView() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const categoryFilter = useSelector((state) => state.tasks.categoryFilter);
  const dueDateFilter = useSelector((state) => state.tasks.dueDateFilter);
  const [expandedAccordions, setExpandedAccordions] = useState(['todo']);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
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

    if (over && active.id !== over.id) {
      const sourceTask = tasks.find(task => task.id === active.id);
      const destinationTask = tasks.find(task => task.id === over.id);

      if (sourceTask && destinationTask) {
        if (sourceTask.status !== destinationTask.status) {
          dispatch(updateTask({ 
            id: sourceTask.id, 
            status: destinationTask.status 
          }));
        } else {
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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
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
      <SortableContext
        items={filteredTasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {filteredTasks.map((task) => (
          <ListItem 
            id={task.id} 
            key={task.id} 
            task={task} 
            style={{ backgroundColor: 'inherit' }}
            isSelected={selectedTasks.includes(task.id)}
            onSelect={() => handleTaskSelect(task.id)}
          />
        ))}
      </SortableContext>
    );
  };

  const accordionSections = [
    { id: 'todo', label: 'To Do', status: 'todo' },
    { id: 'inprogress', label: 'In Progress', status: 'in-progress' },
    { id: 'completed', label: 'Completed', status: 'completed' }
  ];

  return (
    <div className="mt-3 px-2 position-relative">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: 'left' }}><strong>Task Name</strong></TableCell>
                <TableCell sx={{ textAlign: 'left' }}><strong>Due On</strong></TableCell>
                <TableCell sx={{ textAlign: 'left' }}><strong>Task Status</strong></TableCell>
                <TableCell sx={{ textAlign: 'left' }}><strong>Task Category</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accordionSections.map((section) => {
                const filteredTasks = filterAndSortTasksByStatus(section.status);
                return (
                  <TableRow key={section.id}>
                    <TableCell colSpan={6} style={{ padding: 0 }}>
                      <Accordion
                        expanded={expandedAccordions.includes(section.id)}
                        onChange={handleAccordionChange(section.id)}
                        className={`accordion-${section.id}`}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{section.label} ({filteredTasks.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                          <Table>
                            <TableBody>
                              {filteredTasks.length > 0 ? (
                                renderTaskRows(filteredTasks)
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} sx={{ textAlign: 'center', padding: '1rem' }}>
                                    <Typography>
                                      No tasks in {section.label}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <DragOverlay>
          {activeTask ? (
            <ListItem 
              id={activeTask.id} 
              task={activeTask} 
              isDragging 
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <MultiTaskSelectFloater 
        selectedTasks={selectedTasks} 
        onDelete={handleBulkDelete} 
        onChangeStatus={handleBulkStatusChange} 
        onClose={() => setSelectedTasks([])}
      />
    </div>
  );
}