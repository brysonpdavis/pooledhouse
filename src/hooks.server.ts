// import { SvelteKitAuth } from "@auth/sveltekit"
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import EmailProvider from '@auth/core/providers/email';
// import { prisma } from '$lib/server/prisma'


// export const handle = SvelteKitAuth({
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         EmailProvider({
//             server: {
//                 host: "smtp.sendgrid.net",
//                 port: "587",
//                 auth: {
//                     user: "apikey",
//                     pass: 
//                 }
//             },
//             from: 'hey@brysondavis.dev',
//             type: 'email',
//             id: 'email',
//             sendVerificationRequest: () => new Promise((resolve) => resolve()),
//             name: "Sign in with Email"
//         })
//     ]
// });