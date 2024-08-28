import { Routes, Route } from 'react-router-dom';

import styles from './app.module.css';
import Board from '../lib/board/Board';
import TicketDetails from './ticket-details/ticket-details';

const App = () => {
  return (
    <div className={styles['app']}>
      <Routes>
        <Route path="/" element={<Board />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
