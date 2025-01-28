import {useState} from 'react';
import './custom.css';
import Header from './Header';
import Tabs from './Tabs';
import Filters from './Filters';
import ListView from './ListView';
import BoardView from './BoardView';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('list');

  return (
    <div className="p-3">
      <Header />
      <Tabs selectedTab={selectedTab} onTabSelect={(tab)=> setSelectedTab(tab)} />
        {/* Filters */}
      <Filters />
        {/* VIEW */}
      {selectedTab === 'list' && (<div><ListView /></div>)}
      {selectedTab === 'board' && (<div><BoardView /></div>)}
    </div>
  );
}
