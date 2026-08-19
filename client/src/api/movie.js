import { axiosInstance } from './axiosInstance';

export const FetchAllMovies = async () => {
    try {
        const response = await axiosInstance.get('/api/movies');
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const FetchMovieById = async (movieId) => {
    try {
        const response = await axiosInstance.get(`/api/movies/${movieId}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};

export const CreateMovie = async (movieData) => {
    try {
        const response = await axiosInstance.post('/api/movies', movieData);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.response ? err.response.data : { success: false, message: err.message };
    }
};