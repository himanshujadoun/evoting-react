import axios from "axios";

// Function to get the token from session storage
const getToken = () => {
  return sessionStorage.getItem("FullToken");
};

// Create an instance of axios with the base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to perform a GET request
const HTTP_GET = async (url, params = {}, additionalHeaders = {}) => {
  try {
    const token = getToken();
    const headers = {
      ...additionalHeaders,
      Authorization: `Bearer ${token}`,
    };
    const response = await apiClient.get(url, {
      params,
      headers,
      responseType: headers.responseType || "json",
    });
    return response;
  } catch (error) {
    console.error("Error with GET request:", error);
    throw error;
  }
};

// Function to perform a POST request
const HTTP_POST = async (url, data, additionalHeaders = {}) => {
  try {
    const token = getToken();
    const headers = {
      ...additionalHeaders,
      Authorization: `Bearer ${token}`,
    };
    const response = await apiClient.post(url, data, { headers });
    return response;
  } catch (error) {
    console.error("Error with POST request:", error);
    throw error;
  }
};

// Function to perform a DELETE request
const HTTP_DELETE = async (url, params = {}, additionalHeaders = {}) => {
  try {
    const token = getToken();
    const headers = {
      ...additionalHeaders,
      Authorization: `Bearer ${token}`,
    };
    const response = await apiClient.delete(url, {
      data: params,
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error with DELETE request:", error);
    throw error;
  }
};

// Function to perform a PUT request
const HTTP_PUT = async (url, data, additionalHeaders = {}) => {
  try {
    const token = getToken();
    const headers = {
      ...additionalHeaders,
      Authorization: `Bearer ${token}`,
    };
    const response = await apiClient.put(url, data, { headers });
    return response;
  } catch (error) {
    console.error("Error with PUT request:", error);
    throw error;
  }
};

export { HTTP_GET, HTTP_PUT, HTTP_POST, HTTP_DELETE };
