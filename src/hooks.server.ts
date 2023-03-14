import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from '@auth/core/providers/email';
import { prisma } from '$lib/server/prisma'
import { sendVerificationRequest } from "$lib/server/auth/send-verification-request";

import {SENDGRID_API_KEY} from '$env/static/private'

export const handle = SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: `smtp://apikey:${SENDGRID_API_KEY}@smtp.sendgrid.net:587`,
            from: 'hey@brysondavis.dev',
            type: 'email',
            id: 'email',
            sendVerificationRequest,
            name: "Sign in with Email",
        })
    ],
    pages: {
        verifyRequest: '/auth/sent'
    }
});
