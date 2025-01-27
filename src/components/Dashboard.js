import {useState} from 'react';
import './custom.css';
import Header from './Header';
import Tabs from './Tabs';
import Filters from './Filters';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('list');

  return (
    <div className="p-3">
      <Header />
      <Tabs selectedTab={selectedTab} onTabSelect={(tab)=> setSelectedTab(tab)} />
        {/* Filters */}
      <Filters />
        {/* VIEW */}
      {selectedTab === 'list' && (<div>LIST VIEW</div>)}
      {selectedTab === 'board' && (<div>BOARD VIEW</div>)}
    </div>
  );
}
