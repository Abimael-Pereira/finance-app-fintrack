import { protectedApi, publicApi } from '@/lib/axios';

export const UserService = {
  /**
   * Cria um novo usuário.
   * @param {Object} input
   * @param {string} input.firstName - Primeiro nome do usuário.
   * @param {string} input.lastName - Sobrenome do usuário.
   * @param {string} input.email - Email do usuário.
   * @param {string} input.password - Senha do usuário.
   * @returns {Object} - Retorna um objeto com os dados do usuário criado e tokens de autenticação.
   * @returns {string} response.tokens.accessToken - Token de acesso.
   * @returns {string} response.tokens.refreshToken - Token de atualização.
   */
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
        accessToken: response.data.tokens.accessToken,
        refreshToken: response.data.tokens.refreshToken,
      },
    };
  },

  /**
   * Realiza o login do usuário.
   * @param {Object} input
   * @param {string} input.email - Email do usuário.
   * @param {string} input.password - Senha do usuário.
   * @returns {Object} - Retorna um objeto com os dados do usuário e tokens de autenticação.
   * @returns {string} response.tokens.accessToken - Token de acesso.
   * @returns {string} response.tokens.refreshToken - Token de atualização.
   */
  login: async (input) => {
    const response = await publicApi.post('auth/login', {
      email: input.email,
      password: input.password,
    });

    console.log(response);

    return {
      id: response.data.id,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      tokens: {
        accessToken: response.data.tokens.accessToken,
        refreshToken: response.data.tokens.refreshToken,
      },
    };
  },

  /**
   * Obtém os dados do usuário autenticado.
   * @returns {Object} - Retorna um objeto com os dados do usuário.
   */
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
