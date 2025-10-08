import axios from "axios";

// For physical device - remove the __DEV__ check temporarily
const API_BASE_URL = "http://192.168.1.35:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const doctorServices = {
  getAllDoctors: async () => {
    try {
      console.log('🔄 Fetching from:', `${API_BASE_URL}/doctors`);
      const response = await api.get("/doctors");
      console.log('✅ Success! Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Axios Error:', error.message);
      console.log('Full error details:', error.response?.data || error);
      throw error;
    }
  },
};

export default doctorServices;