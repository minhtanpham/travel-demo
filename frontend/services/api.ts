/**
 * Reusable API service for making HTTP requests using Axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, token?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error("API Request Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      params,
    };

    const response = await this.axiosInstance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, body);
    return response.data;
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, body);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
}

// Create and export a singleton instance
export const api = new ApiService(API_BASE_URL, STRAPI_TOKEN);

export default api;
