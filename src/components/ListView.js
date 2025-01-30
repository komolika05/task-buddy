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
  Badge,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './listView.css';
import ListItem from './ListItem/ListItem';

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
  const [expanded, setExpanded] = useState('todo');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showStatusChangeMenu, setShowStatusChangeMenu] = useState(false);

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
    return tasks
      .filter(task => 
        task.status.toLowerCase() === status && 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
    setShowStatusChangeMenu(false);
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
    { id: 'inprogress', label: 'In Progress', status: 'inprogress' },
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

      {selectedTasks.length > 0 && (
        <>
          {showStatusChangeMenu && (
            <div 
              className="status-change-menu" 
              style={{
                position: 'fixed',
                bottom: '80px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '15px',
                zIndex: 1000,
                width: '300px',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Change Status
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'todo', label: 'To Do' },
                  { value: 'inProgress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' }
                ].map((option) => (
                  <Button 
                    key={option.value}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      handleBulkStatusChange(option.value);
                    }}
                    fullWidth
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Button 
                variant="text" 
                color="secondary" 
                onClick={() => setShowStatusChangeMenu(false)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="selection-badge">
            <Badge 
              badgeContent={selectedTasks.length} 
              color="primary" 
              sx={{
                position: 'fixed', 
                bottom: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                zIndex: 1000,
                '& .MuiBadge-badge': {
                  fontSize: '1rem',
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%'
                }
              }}
            >
              <div className="d-flex gap-2 bg-white p-2 rounded-pill shadow">
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => {
                    setShowStatusChangeMenu(true);
                  }}
                >
                  Change Status
                </Button>
              </div>
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}