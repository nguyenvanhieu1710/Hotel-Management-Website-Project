import Joi from "joi";

export const staffSchema = Joi.object({
  StaffId: Joi.number().optional(),
  StaffName: Joi.string().required(),
  StaffImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
  Position: Joi.string().required(),
  Salary: Joi.number().required(),
  Status: Joi.string().required(),
  WorkStartDate: Joi.date().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().optional(),
});

export const createStaffSchema = Joi.object({
  StaffName: Joi.string().required(),
  StaffImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
  Position: Joi.string().required(),
  Salary: Joi.number().required(),
  Status: Joi.string().required(),
  WorkStartDate: Joi.date().required(),
  Description: Joi.string().required(),
});

export const updateStaffSchema = Joi.object({
  StaffId: Joi.number().optional(), // Allow but ignore
  StaffName: Joi.string().optional(),
  StaffImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().optional(),
  Gender: Joi.string().optional(),
  PhoneNumber: Joi.string().optional(),
  Address: Joi.string().optional(),
  Position: Joi.string().optional(),
  Salary: Joi.number().optional(),
  Status: Joi.string().optional(),
  WorkStartDate: Joi.date().optional(),
  Description: Joi.string().optional(),
  Deleted: Joi.number().optional(), // Allow but ignore
  Email: Joi.string().optional(), // Allow but ignore (from JOIN)
  AccountStatus: Joi.string().optional(), // Allow but ignore (from JOIN)
}).min(1); // At least one field must be provided
