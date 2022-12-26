import { sign, verify } from "jsonwebtoken";

const HASH_STRING = "TruongBaoNgoc";

export const encode = (username: string, password: string) =>
  sign({ username, password }, HASH_STRING);

export const decode = (token: string) => verify(token, HASH_STRING);
