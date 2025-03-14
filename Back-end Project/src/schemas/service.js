import Joi from "joi";

export const serviceSchema = Joi.object({
    ServiceId: Joi.number().required(),
    ServiceName: Joi.string().required(),
    ServiceTypeId: Joi.number().required(),
    Price: Joi.number().required(),
    Description: Joi.string().required(),
    Deleted: Joi.boolean().required(),
    });