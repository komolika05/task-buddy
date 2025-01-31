import React, { useState } from 'react';
import {
  Badge,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './MultiTaskSelectFloater.css';

export default function MultiTaskSelectFloater({
  selectedTasks,
  onDelete,
  onChangeStatus,
  onClose
}) {
  const [showStatusChangeMenu, setShowStatusChangeMenu] = useState(false);

  const handleBulkStatusChange = (newStatus) => {
    onChangeStatus(newStatus);
    setShowStatusChangeMenu(false);
  };

  return (
    <>
      {showStatusChangeMenu && selectedTasks.length > 0 && (
        <div
          className="status-change-menu"
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map((option) => (
              <div
                key={option.value}
                style={{ color: "white", cursor: 'pointer' }}
                onClick={() => {
                  handleBulkStatusChange(option.value);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTasks.length > 0 && (
        <div className="selection-badge">
          <Badge
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
            <div className="floating-badge p-2 rounded-pill shadow">
              <div className="d-flex gap-2 align-items-center">
                <Typography variant="body2" sx={{ mr: 1, color: 'white' }}>
                  {selectedTasks.length} Task{selectedTasks.length > 1 ? 's' : ''} selected
                </Typography>
                <IconButton
                  onClick={() => {
                    setShowStatusChangeMenu(false);
                    onClose();
                  }}
                  size="small"
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
                <Button
                  onClick={() => setShowStatusChangeMenu(!showStatusChangeMenu)}
                  size="small"
                  sx={{
                    color: 'white', 
                    textTransform: 'none',
                    borderRadius: '20px',

                    border: '1px solid white',
                  }}
                >
                  Status
                </Button>
                <Button
                  onClick={onDelete}
                  size="small"
                  sx={{
                    color: 'red',
                    backgroundColor: 'transparent',
                    borderRadius: '20px',
                    border: '1px solid red',
                    textTransform: 'none'
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Badge>
        </div>
      )}
    </>
  );
}
