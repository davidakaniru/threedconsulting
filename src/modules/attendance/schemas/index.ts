import * as yup from "yup";

export const attendanceUpdateSchema = yup
  .object({
    records: yup
      .array()
      .of(
        yup.object({
          attendanceId: yup.string().uuid().required(),
          status: yup
            .string()
            .oneOf(["pending", "present", "absent", "late"])
            .required(),
          notes: yup.string().trim().max(500).nullable().optional(),
        }),
      )
      .min(1)
      .required(),
  })
  .required();

export type AttendanceUpdateInput = yup.InferType<
  typeof attendanceUpdateSchema
>;
