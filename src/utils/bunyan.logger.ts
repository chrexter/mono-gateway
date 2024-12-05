import Logger from "bunyan";
import { Request, Response, NextFunction } from "express";

// Middleware to log incoming requests
const bunyan_middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
  logger: Logger,
) => {
  const startTime = Date.now();

  logger.info(
    { method: req.method, url: req.originalUrl, headers: req.headers },
    "Incoming request",
  );

  // Capture response status and time taken
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
      },
      "Request completed",
    );
  });

  // Capture errors if they occur
  res.on("error", (err) => {
    logger.error(
      { method: req.method, url: req.originalUrl, error: err.message },
      "Error in request",
    );
  });

  next();
};

export default bunyan_middleware;
