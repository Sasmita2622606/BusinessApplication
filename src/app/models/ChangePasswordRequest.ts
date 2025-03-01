export interface ChangePasswordRequest {
    token: string;
    currentPassword: string;
    newPassword: string;
  }