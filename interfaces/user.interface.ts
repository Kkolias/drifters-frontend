export enum UserRoles {
    admin = 'admin',
    noRole = 'noRole'
  }
  
  export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoles;
    password?: string;
    createdAt: string;
  }