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

export const CreateTaskOrTypeSchema = z
  .object({
    type: z.enum(["task", "tag"]),
    id: z.string().trim().optional(),
    name: z.string().trim().min(1, { message: "Tên không được bỏ trống" }),
    description: z.string().trim().optional(),
    colorTag: z.string().trim().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    innerTag: z.array(z.string()).optional(),
  })
  .superRefine(({ type, colorTag, endDate, startDate }, ctx) => {
    if (type === "tag") {
      if (!colorTag) {
        ctx.addIssue({
          code: "custom",
          path: ["colorTag"],
          message: "Hãy chọn màu biểu thị giai đoạn",
        });
      }
    } else {
      if (!startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["startDate"],
          message: "Ngày bắt đầu không được để trống",
        });
      }

      if (!endDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "Ngày kết thúc không được để trống",
        });
      }
    }
  });

export const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Mật khẩu không được bỏ trống" })
      .regex(passwordRegex, { message: "Mật khẩu cũ không đúng định dạng" })
      .trim(),
    password: z
      .string({ required_error: "Mật khẩu mới không được bỏ trống" })
      .regex(passwordRegex, { message: "Mật khẩu mới không đúng định dạng" })
      .trim(),
    confirmPassword: z
      .string({ required_error: "Mật khẩu xác nhận không được bỏ trống" })
      .regex(passwordRegex, {
        message: "Mật khẩu xác nhận không đúng định dạng",
      })
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

export type SignUpBody = z.infer<typeof signUpSchema>;
export type LoginByPhoneBody = z.infer<typeof loginByPhoneSchema>;
export type CreateTaskOrTypeBody = z.infer<typeof CreateTaskOrTypeSchema>;
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
