import axios from 'axios';

const apiCountries_URL = 'https://restcountries.com/v3.1';

const apiCountries = axios.create({
    baseURL: apiCountries_URL
});

export const getCountriesList = async () => {
    try {
        // Filtramos por campos para que la respuesta sea ligera
        const response = await apiCountries.get('/all?fields=name');
        return response.data
            .map(country => country.name.common)
            .sort((a, b) => a.localeCompare(b));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

export default apiCountries;