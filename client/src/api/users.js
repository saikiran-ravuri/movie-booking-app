import { axiosInstance } from './axiosInstance';

// register user api call
export const RegisterUser = async (value) => {
    try {
        const response = await axiosInstance.post('/api/users/register', value);
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// login user api call
export const LoginUser = async (value) => {
    try {
        const response = await axiosInstance.post('/api/users/login', value);
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// get current logged in user details api call
export const GetLoggedInUser = async () => {
    try {
        const response = await axiosInstance.get('/api/users/get-current-user');
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};
