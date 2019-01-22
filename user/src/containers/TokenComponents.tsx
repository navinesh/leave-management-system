interface DataType {
  verifyUserToken: TokenType;
}

interface TokenType {
  User: User;
  token: string;
}

interface User {
  id: string;
}

export function TokenSuccess(data: DataType, client: any): void {
  localStorage.setItem('id', data.verifyUserToken.User.id);
  localStorage.setItem('auth_token', data.verifyUserToken.token);
  client.writeData({
    data: {
      isAuthenticated: true,
      id: data.verifyUserToken.User.id,
      auth_token: data.verifyUserToken.token
    }
  });
}

export function TokenFailure(client: any): void {
  client.writeData({
    data: {
      isAuthenticated: false,
      id: null,
      auth_token: null,
      sessionError: 'Your session has expired!'
    }
  });
  localStorage.clear();
}
