import { ApiResponse } from '@school-erp/shared';

export class ApiClient {
  private static baseUrl = '/api/v1';

  public static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || `HTTP Error ${res.status}`);
    }

    return res.json();
  }
}
