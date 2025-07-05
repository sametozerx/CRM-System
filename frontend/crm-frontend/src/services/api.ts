import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Customer, User, LoginRequest, LoginResponse, CustomerFilter } from '../types';

const API_BASE_URL = 'https://localhost:7214/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - JWT token ekleme
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - 401 hatalarını yakalama
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          // Sadece dashboard sayfasındaysa login'e yönlendir
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/Auth/login', credentials);
    return response.data;
  }

  // Customer CRUD operations
  async getCustomers(): Promise<Customer[]> {
    const response = await this.api.get<Customer[]>('/Customer');
    return response.data;
  }

  async getCustomer(id: number): Promise<Customer> {
    const response = await this.api.get<Customer>(`/Customer/${id}`);
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await this.api.post<Customer>('/Customer', customer);
    return response.data;
  }

  async updateCustomer(customer: Customer): Promise<void> {
    await this.api.put(`/Customer/${customer.id}`, customer);
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.api.delete(`/Customer/${id}`);
  }

  // Customer filtering
  async filterCustomers(filter: CustomerFilter): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (filter.name) params.append('name', filter.name);
    if (filter.email) params.append('email', filter.email);
    if (filter.region) params.append('region', filter.region);
    if (filter.registrationDate) params.append('registrationDate', filter.registrationDate);

    const response = await this.api.get<Customer[]>(`/Customer/filter?${params.toString()}`);
    return response.data;
  }
}

export const apiService = new ApiService(); 