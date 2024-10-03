import React from "react";
import TextEditor from "./TextEditor";
import Dashboard from "./Dashboard";
import {
  BrowserRouter as Router,
  Routes,
   Route,
  Navigate
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";


function App() {
  return (
    <Router>
      <Routes>
      {/* <Route 
          path="/" 
          element={<Dashboard />} 
        /> */}
        <Route 
            path="/" 
            element={<Navigate to={`/documents/${uuidV4()}`} replace />} 
          />
        <Route 
          path="/documents/:id" 
          element={<TextEditor />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
