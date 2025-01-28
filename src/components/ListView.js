import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

import { reorderTasks } from '../redux/slices/taskSlice';


export default function ListView() {
  const { tasks } = useSelector((state) => state.tasks);

  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState('todo');

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
    const res = tasks.filter(task => task.status.toLowerCase() === status).sort((a, b) => a.order - b.order);
    return res;
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
            <ListItem id={task.id} key={task.id} task={task} />
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
    <div className="mt-3 px-2">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tasks table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Task Name</strong></TableCell>
              <TableCell><strong>Due On</strong></TableCell>
              <TableCell><strong>Task Status</strong></TableCell>
              <TableCell><strong>Task Category</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accordionSections.map((section) => (
              <TableRow key={section.id}>
                <TableCell colSpan={4} style={{ padding: 0 }}>
                  <Accordion
                    expanded={true}
                    onChange={handleAccordionChange(section.id)}
                    className={`accordion-${section.id}`}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {section.label} ({filterAndSortTasksByStatus(section.status).length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0 }}>
                      <Table>
                        <TableBody>
                          {renderTaskRows(filterAndSortTasksByStatus(section.status))}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}