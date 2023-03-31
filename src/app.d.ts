// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {
		// 	authorized?: boolean
		// }
		// interface PageData {}
		// interface Platform {}
	}
}

declare module "@auth" {
	interface Session {
		user: {
			id: string,
			email: string,
			phone: string,
			industryVerificationToken: string
		}
	}

	interface DefaultSession {
		user: {
			id: string,
			email: string,
			phone: string,
			industryVerificationToken: string
		}
	}

	interface User {
		id: string,
		email: string,
		phone: string,
		industryVerificationToken: string

	}
}

export {};
