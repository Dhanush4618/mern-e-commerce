import { createContext, useReducer, useEffect, useContext } from 'react';
import axios from '../axiosInstance';

const AuthContext = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, userInfo: action.payload };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, userInfo: null, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [state.userInfo]);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (err) {
      console.error('Logout failed on server', err);
    }
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateProfile = (data) => {
    dispatch({ type: 'AUTH_SUCCESS', payload: data });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
