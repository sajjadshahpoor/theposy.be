import { body } from "express-validator";

export const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];
