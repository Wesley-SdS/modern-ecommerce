import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ZodError } from "zod"

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = "AppError"
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN")
    this.name = "ForbiddenError"
  }
}

export const errorHandler = (error: unknown, request: NextRequest) => {

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation Error",
        message: "Invalid input data",
        details: error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    const response: any = {
      error: error.code || "INTERNAL_ERROR",
      message: error.message,
    }

    if (error instanceof ValidationError && error.details) {
      response.details = error.details
    }

    return NextResponse.json(response, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === "production" 
          ? "Internal server error" 
          : error.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
    },
    { status: 500 }
  )
}

export const withErrorHandler = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      return errorHandler(error, request)
    }
  }
}