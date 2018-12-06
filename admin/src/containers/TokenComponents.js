export function TokenSuccess(data, client) {
  localStorage.setItem('admin_user', data.verifyAdminToken.Admin.othernames);
  localStorage.setItem('admin_token', data.verifyAdminToken.token);
  client.writeData({
    data: {
      isAuthenticated: true,
      admin_user: data.verifyAdminToken.Admin.othernames,
      admin_token: data.verifyAdminToken.token
    }
  });
}

export function TokenFailure(client) {
  client.writeData({
    data: {
      isAuthenticated: false,
      admin_user: null,
      admin_token: null,
      sessionError: 'Your session has expired!'
    }
  });
  localStorage.clear();
}
