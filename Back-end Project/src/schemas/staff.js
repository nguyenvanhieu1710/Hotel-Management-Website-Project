import Joi from "joi";

export const staffSchema = Joi.object({
  StaffId: Joi.number().required(),
  StaffName: Joi.string().required(),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
  Position: Joi.string().required(),
  Salary: Joi.number().required(),
  Status: Joi.string().required(),
  WorkStartDate: Joi.date().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
