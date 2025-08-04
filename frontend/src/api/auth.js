import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Axios interceptor for automatic token attachment
const setupAxiosInterceptors = (store) => {
  axios.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.access;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const state = store.getState();
        const refreshTokenValue = state.auth.refresh;
        
        if (refreshTokenValue) {
          try {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
              refresh: refreshTokenValue,
            });
            
            const { access } = response.data;
            store.dispatch({ type: 'auth/refreshToken', payload: { access } });
            
            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            store.dispatch({ type: 'auth/logout' });
            window.location.href = '/login';
          }
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export const login = async (email, password, dispatch, loginSuccess) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/token/`, {
      email,
      password,
    });

    const { access, refresh } = res.data;
    dispatch(loginSuccess({ access, refresh }));
    
    return { success: true, data: res.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || "Login failed" 
    };
  }
};

export const register = async (userData, dispatch) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register/`, userData);
    return { success: true, data: res.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || "Registration failed" 
    };
  }
};

// Todo API functions
export const todoAPI = {
  getTodos: async () => {
    const response = await axios.get(`${API_BASE_URL}/todos/`);
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await axios.post(`${API_BASE_URL}/todos/`, todoData);
    return response.data;
  },

  updateTodo: async (id, todoData) => {
    const response = await axios.patch(`${API_BASE_URL}/todos/${id}/`, todoData);
    return response.data;
  },

  deleteTodo: async (id) => {
    await axios.delete(`${API_BASE_URL}/todos/${id}/`);
  },
};

export { setupAxiosInterceptors };