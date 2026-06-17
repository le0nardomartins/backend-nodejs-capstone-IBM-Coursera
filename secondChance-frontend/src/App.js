import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import ItemDetails from './pages/ItemDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import AddItem from './pages/AddItem';
import SearchResults from './pages/SearchResults';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
