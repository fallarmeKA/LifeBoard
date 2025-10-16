import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import TasksNotesPage from "./components/TasksNotesPage";
import ExpensesPage from "./components/ExpensesPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TasksNotesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;