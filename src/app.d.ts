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

		interface Locals {
			auth: import("lucia").AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type DatabaseUserAttributes = {};
		type DatabaseSessionAttributes = {};
	}
}

export { };
