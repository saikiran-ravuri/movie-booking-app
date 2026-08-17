import { axiosInstance } from './axiosInstance';

// register user api call
export const RegisterUser = async (value) => {
    try {
        const response = await axiosInstance.post('/api/users/register', value);
        return response.data;
    } catch (err) {
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

// login user api call
export const LoginUser = async (value) => {
    try {
        const response = await axiosInstance.post('/api/users/login', value);
        return response.data;
    } catch (err) {
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

// get current logged in user details api call
export const GetLoggedInUser = async () => {
    try {
        const response = await axiosInstance.get('/api/users/get-current-user');
        return response.data;
    } catch (err) {
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

// forget password user api call
export const ForgetPasswordAPI = async (data) => {
    try {
        const response = await axiosInstance.post('/api/users/forget', data);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

// reset password user api call
export const ResetPasswordAPI = async (data) => {
    try {
        const response = await axiosInstance.post('/api/users/reset', data);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const ForgetPasswordUser = ForgetPasswordAPI;
export const ResetPasswordUser = ResetPasswordAPI;
