import { APIResponse } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { CreatePostRequest, UpdatePostRequest } from '@models/JsonPlaceholderModels';
import { ApiClient } from '../ApiClient';

export class JsonPlaceholderService extends ApiClient {
    private readonly baseUrl = Routes.JSONPLACEHOLDER.BASE_URL;

    async getAllPosts(): Promise<APIResponse> {
        return this.get(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}`);
    }

    async getPostById(id: number): Promise<APIResponse> {
        return this.get(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}/${id}`);
    }

    async getPostsByUserId(userId: number): Promise<APIResponse> {
        return this.get(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}`, { params: { userId: userId.toString() } });
    }

    async createPost(payload: CreatePostRequest): Promise<APIResponse> {
        return this.post(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}`, {
            data: payload,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async updatePost(id: number, payload: UpdatePostRequest): Promise<APIResponse> {
        return this.put(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}/${id}`, {
            data: payload,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async deletePost(id: number): Promise<APIResponse> {
        return this.delete(`${this.baseUrl}${Routes.JSONPLACEHOLDER.POSTS}/${id}`);
    }

    async getAllUsers(): Promise<APIResponse> {
        return this.get(`${this.baseUrl}${Routes.JSONPLACEHOLDER.USERS}`);
    }

    async getUserById(id: number): Promise<APIResponse> {
        return this.get(`${this.baseUrl}${Routes.JSONPLACEHOLDER.USERS}/${id}`);
    }
}
