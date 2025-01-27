import react from "react";
import './custom.css';
import './tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBox } from '@fortawesome/free-solid-svg-icons';

export default function Tabs({selectedTab, onTabSelect}) {
    return (
        <div className="mb-3">
            <ul className="tab-list px-4">
                <li className={` ${selectedTab === 'list' ? 'active' : ''}`} onClick={() => onTabSelect('list')}>
                    <FontAwesomeIcon icon={faList} className="me-2" />
                    List
                </li>
                <li className={`${selectedTab === 'board' ? 'active' : ''}`} onClick={() => onTabSelect('board')}>
                    <FontAwesomeIcon icon={faBox} className="me-2" />
                    Board
                </li>
            </ul>
        </div>   
    );
}