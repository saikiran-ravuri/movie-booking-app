import { axiosInstance } from './axiosInstance';

export const GetShowsByMovieId = async (movieId, date) => {
    try {
        const query = date ? `?showDate=${date}` : '';
        const response = await axiosInstance.get(`/api/shows/movies/${movieId}${query}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const GetShowDetails = async (showId) => {
    try {
        const response = await axiosInstance.get(`/api/shows/${showId}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};
