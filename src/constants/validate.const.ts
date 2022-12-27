import * as z from "zod";
import { LoginBody } from "../zustand/type";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

export const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;

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
    .regex(passwordRegex, "Mật khẩu không đúng định dạng đăng ký ")
    .trim(),
});

export const signUpSchema = z
  .object({
    email: z
      .string({ required_error: "Email không được bỏ trống" })
      .email({ message: "Chưa phải dạng email vui lòng nhập lại" })
      .trim()
      .min(1, { message: "Email không được bỏ trống" }),
    password: z
      .string({ required_error: "Mật khẩu không được bỏ trống" })
      .regex(passwordRegex)
      .trim(),
    confirmPassword: z
      .string({ required_error: "Mật khẩu xác nhận không được bỏ trống" })
      .regex(passwordRegex, "Mật khẩu xác nhận không đúng")
      .trim(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    const testRes = passwordRegex.test(confirmPassword);
    if (testRes && confirmPassword === password) {
      return;
    }
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Mật khẩu xác nhận không đúng",
    });
  });

export const loginByPhoneSchema = z.object({
  telephone: z.string({
    required_error: "Số điện thoại không được bỏ trống",
  }),
  // .regex(phoneNumberRegex, "Chưa đúng dạng của số điện thoại"),
  verifyCode: z.string().optional(),
});
// .superRefine(({ telephone, verifyCode }, ctx) => {
//   if (!telephone) {
//     return;
//   }

//   if (!verifyCode) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["verifyCode"],
//       message: "Mã xác nhận không được để trống",
//     });
//   }
// });

export const PSWRecoverSchema = z.object({
  email: z
    .string({ required_error: "Email không được bỏ trống" })
    .email({ message: "Chưa phải dạng email vui lòng nhập lại" })
    .trim()
    .min(1, { message: "Email không được bỏ trống" }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
export type LoginByPhoneBody = z.infer<typeof loginByPhoneSchema>;
