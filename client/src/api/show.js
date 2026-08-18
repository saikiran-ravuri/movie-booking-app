import { axiosInstance } from './axiosInstance';

export const GetShowsByMovieId = async (movieId, date) => {
    try {
        const url = date ? `/api/shows/movies/${movieId}?showDate=${date}` : `/api/shows/movies/${movieId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const GetShowDetails = async (showId, date) => {
    try {
        const url = date ? `/api/shows/${showId}?date=${date}` : `/api/shows/${showId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};
