interface DataType {
  verifyAdminToken: TokenType;
}

interface TokenType {
  Admin: Admin;
  token: string;
}

interface Admin {
  othernames: string;
}

export function TokenSuccess(data: DataType, client: any): void {
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

export function TokenFailure(client: any): void {
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
