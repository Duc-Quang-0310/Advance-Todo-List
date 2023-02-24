import { User, UserInfo, UserMetadata } from "firebase/auth";
import { DocumentData, Timestamp } from "firebase/firestore";

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
  oldPassword: string;
}

export interface Stage extends DocumentData {
  id?: string;
  refID: string;
  label: string;
  colorChema: string;
  description: string;
  order: number;
  createdAt?: Timestamp;
  userId: string;
  isDefault?: boolean;
  updatedAt?: Timestamp;
}

export enum FirestoreSchema {
  STAGE = "stage",
  task = "task",
}

export interface Filter {
  onSuccess?: () => void;
  user?: Partial<User>;
}
