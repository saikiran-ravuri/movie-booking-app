import { axiosInstance } from "./axiosInstance";

export const createBooking = async (data) => {
    try {
        const response = await axiosInstance.post("/api/bookings/bookings", data);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const makePayment = async (data) => {
    try {
        const response = await axiosInstance.post("/api/bookings/payments", data);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const GetUserBookings = async () => {
    try {
        const response = await axiosInstance.get("/api/bookings/get-all-bookings");
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};
