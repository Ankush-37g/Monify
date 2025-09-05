import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {

  console.error("Error caught by middleware:", err);

  if (err instanceof ApiError) 
  {
    return res.status(err.statusCode)
              .json({
                    success: err.success,
                    message: err.message,
                    errors: err.errors,
                    data: err.data,
    });
  }

  // Handle unexpected errors
  return res.status(500)
           .json({
            success: false,
            message: "Internal Server Error",
            errors: err.message || [],
            data: null,
  });
};

export { errorHandler };
