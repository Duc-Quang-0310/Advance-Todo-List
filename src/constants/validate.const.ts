import * as z from "zod";
import { LoginBody } from "../zustand/type";

export const loginSchema: z.ZodType<LoginBody> = z.object({
  email: z
    .string({ required_error: "Email không được bỏ trống" })
    .email({ message: "Chưa phải dạng email vui lòng nhập lại" })
    .trim()
    .min(1, { message: "Email không được bỏ trống" }),
  password: z
    .string({ required_error: "Mật khẩu không được bỏ trống" })
    .min(1, { message: "Mật khẩu không được bỏ trống" })
    .max(30, { message: "Mật khẩu quá dài vui lòng nhập lại" })
    .trim(),
});
