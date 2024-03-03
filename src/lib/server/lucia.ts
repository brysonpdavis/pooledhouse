import { lucia } from 'lucia'
import { sveltekit } from 'lucia/middleware'
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma'
import { dev } from '$app/environment'
import { prisma as prismaClient } from './prisma'

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prismaAdapter(prismaClient)
})

export type Auth = typeof auth
