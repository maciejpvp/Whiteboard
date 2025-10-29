import Joi from "joi";

const pointSchema = Joi.object({
  x: Joi.number().required(),
  y: Joi.number().required(),
});

const lineElementSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid("line").required(),
  points: Joi.array().items(pointSchema).min(2).required(),
  color: Joi.string().required(),
  size: Joi.number().required(),
});

const textElementSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid("text").required(),
  x: Joi.number().required(),
  y: Joi.number().required(),
  text: Joi.string().required(),
  color: Joi.string().required(),
  fontSize: Joi.number().required(),
  fontFamily: Joi.string().optional(),
});

export const whiteboardElementSchema = Joi.object({
  type: Joi.string().required(),
})
  .when(Joi.object({ type: Joi.valid("line") }).unknown(), {
    then: lineElementSchema,
  })
  .when(Joi.object({ type: Joi.valid("text") }).unknown(), {
    then: textElementSchema,
  });
