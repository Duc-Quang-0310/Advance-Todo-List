import { User, UserInfo, UserMetadata } from "firebase/auth";

export interface Userinfo {
  email: string | null;
  userID: string;
  displayName: string | null;
  avatar: string | null;
  provider: {
    data: UserInfo[];
    id: string;
  };
  metadata: UserMetadata;
  isAnonymus: boolean;
  phoneNumber: string | null;
  isEmailVerified: boolean;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ChangePasswordBody extends Omit<LoginBody, "email"> {
  user: User;
}
