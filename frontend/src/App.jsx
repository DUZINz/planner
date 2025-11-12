import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateEvent from './pages/CreateEvent'
import EventsList from './pages/EventsList'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/" element={<Navigate to="/events" />} />
      </Routes>
    </Router>
  )
}
