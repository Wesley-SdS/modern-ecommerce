import { NextResponse } from "next/server"

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: string, details?: any, status = 400) {
  return NextResponse.json({ success: false, error, details }, { status })
}

// Legacy alias for backward compatibility
export function apiResponse<T>(data: T, status = 200) {
  return successResponse(data, status)
}
