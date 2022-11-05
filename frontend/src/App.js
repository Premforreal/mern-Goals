import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import DashBoard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
          <Header/>
          <Routes>
              <Route path='/' element={<DashBoard/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
