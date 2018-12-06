export function TokenSuccess(data, client) {
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

export function TokenFailure(client) {
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
