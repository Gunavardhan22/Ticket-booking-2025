// Mock API client - simulates network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    await delay(300 + Math.random() * 200);
    const data = localStorage.getItem(endpoint);
    if (data) {
      return JSON.parse(data);
    }
    throw new Error('Not found');
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    await delay(400 + Math.random() * 300);
    return body as T;
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    await delay(300 + Math.random() * 200);
    return body as T;
  },
};
