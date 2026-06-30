import {z} from 'zod'

export const createAppSchema = z.object({
    appName:z.string().min(3,'App name must be at least 3 characters long'),
    appDescription:z.string().min(10,'App description must be at least 10 characters long'),
    appType:z.string().min(3,'App type must be at least 3 characters long'),
    isActive:z.boolean().optional(),
    appDbConfig:z.record(z.any()).optional()
})

export const updateAppSchema=createAppSchema.partial()