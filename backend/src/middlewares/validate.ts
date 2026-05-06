import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validate = (schema: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    const validations = ["query", "params", "body"].map((value: string) => {
      if (schema[value]) {
        const joiValidation = Joi.compile(schema[value])
          .prefs({
            abortEarly: false,
            errors: { label: "key" },
          })
          .validate(req[value] || {});

        if (joiValidation.error) return joiValidation.error;

        return null;
      }
      return null;
    });

    const errors = validations.filter(Boolean) as Joi.ValidationError[];

    if (errors.length > 0) {
      const errorMessage = errors
        .map((err) => err.details.map((detail) => detail.message).join(', '))
        .join(', ');

      return res.status(400).json({
        code: 400,
        message: errorMessage,
      });
    }

    return next();
  };
};

export default validate;
