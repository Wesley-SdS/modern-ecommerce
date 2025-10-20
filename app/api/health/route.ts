import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import os from "node:os"

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  version: string
  environment: string
  uptime: number
  checks: {
    database: {
      status: "pass" | "fail"
      responseTime?: number
      error?: string
    }
    memory: {
      status: "pass" | "warn" | "fail"
      usage: number
      total: number
      percentage: number
    }
    disk: {
      status: "pass" | "warn" | "fail"
      usage?: number
      total?: number
      percentage?: number
    }
    external_services?: {
      stripe?: {
        status: "pass" | "fail"
        responseTime?: number
      }
      email?: {
        status: "pass" | "fail"
        responseTime?: number
      }
    }
  }
}

async function checkDatabaseHealth() {
  const startTime = Date.now()
  
  try {
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - startTime
    
    return {
      status: "pass" as const,
      responseTime,
    }
  } catch (error) {
    return {
      status: "fail" as const,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function checkMemoryHealth() {
  const usage = process.memoryUsage()
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const heapUsed = usage.heapUsed
  const heapTotal = usage.heapTotal
  
  const memoryPercentage = (heapUsed / heapTotal) * 100
  
  let status: "pass" | "warn" | "fail" = "pass"
  if (memoryPercentage > 90) status = "fail"
  else if (memoryPercentage > 80) status = "warn"
  
  return {
    status,
    usage: heapUsed,
    total: heapTotal,
    percentage: Math.round(memoryPercentage * 100) / 100,
  }
}

async function checkStripeHealth() {
  const startTime = Date.now()
  
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { status: "fail" as const }
    }
    
    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    await stripe.balance.retrieve()
    
    return {
      status: "pass" as const,
      responseTime: Date.now() - startTime,
    }
  } catch (error) {
    return {
      status: "fail" as const,
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  
  const [dbHealth, memoryHealth, stripeHealth] = await Promise.all([
    checkDatabaseHealth(),
    checkMemoryHealth(),
    checkStripeHealth(),
  ])
  
  const allChecks = [dbHealth.status, memoryHealth.status, stripeHealth.status]
  
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy"
  if (allChecks.includes("fail")) {
    overallStatus = "unhealthy"
  } else if (allChecks.includes("warn")) {
    overallStatus = "degraded"
  }
  
  const healthCheck: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    checks: {
      database: dbHealth,
      memory: memoryHealth,
      disk: {
        status: "pass" as const,
      },
      external_services: {
        stripe: stripeHealth,
      },
    },
  }
  
  const responseTime = Date.now() - startTime
  
  const statusCode = overallStatus === "healthy" ? 200 : 
                     overallStatus === "degraded" ? 200 : 503
  
  return NextResponse.json(healthCheck, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Response-Time": `${responseTime}ms`,
    },
  })
}
