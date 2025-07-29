import { protectedApi, publicApi } from '@/lib/axios';

export const UserService = {
  signup: async (input) => {
    const response = await publicApi.post('/users', {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: input.password,
    });

    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      tokens: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    };
  },
  login: async (input) => {
    const response = await publicApi.post('auth/login', {
      email: input.email,
      password: input.password,
    });

    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      tokens: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
    };
  },
  me: async () => {
    const response = await protectedApi.get('/users/me');
    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
    };
  },
};
