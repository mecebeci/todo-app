import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { setupAxiosInterceptors, todoAPI } from "./api/auth"

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Provider, useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { logout } from "./redux/authSlice";

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component (giriş yapmışsa todo'ya yönlendir)
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// Logout Button Component
function LogoutButton() {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button 
      onClick={handleLogout}
      className="logout-btn"
    >
      Exit
    </button>
  );
}

// Main Todo App Component
function TodoApp() {
  const [todos, setTodos] = useState([])
  const [selectedTab, setSelectedTab] = useState('Open')
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      todoAPI.getTodos()
        .then(data => {
          console.log(data)
          setTodos(data)
        })
        .catch(err => console.log(err))
    }
  }, [isAuthenticated])

  function handleAddTodo(newTodo) {
    todoAPI.createTodo({
      input: newTodo,
      complete: false
    })
      .then(data => setTodos(prev => [...prev, data]))
      .catch(err => console.error(err))
  }

  function handleCompletedTodo(id) {
    todoAPI.updateTodo(id, { complete: true })
      .then(data => {
        setTodos(prev => prev.map(t => t.id === data.id ? data : t))
      })
      .catch(err => console.error(err))
  }

  function handleDeleteTodo(id) {
    todoAPI.deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id))
      })
      .catch(err => console.error(err))
  }

  return (
    <div style={{ position: 'relative' }}>
      <LogoutButton />
      <Header todos={todos}/>
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos}/>
      <TodoList selectedTab={selectedTab} handleDeleteTodo={handleDeleteTodo}
       handleCompletedTodo={handleCompletedTodo} todos={todos}/>
      <TodoInput handleAddTodo={handleAddTodo}/>
    </div>
  );
}

function App() {
  useEffect(() => {
    setupAxiosInterceptors(store);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <TodoApp />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;