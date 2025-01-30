import {useState} from 'react';
import './custom.css';
import Header from './Header';
import Tabs from './Tabs';
import Filters from './Filters';
import ListView from './ListView';
import BoardView from './BoardView';
import EditTaskModal from './EditTaskModal/EditTaskModal';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('list');
  const { editModal, tasks } = useSelector((state) => state.tasks);

  const editingTask = editModal.taskId 
    ? tasks.find(task => task.id === editModal.taskId) 
    : null;

  return (
    <div className="p-3">
      <Header />
      <Tabs selectedTab={selectedTab} onTabSelect={(tab)=> setSelectedTab(tab)} />
      <Filters />
      {selectedTab === 'list' && (<div><ListView /></div>)}
      {selectedTab === 'board' && (<div><BoardView /></div>)}
      {editModal.isOpen && editingTask && (
        <EditTaskModal 
          task={editingTask} 
        />
      )}
    </div>
  );
}
