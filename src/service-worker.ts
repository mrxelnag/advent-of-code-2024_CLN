/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

console.log('Service worker version', version);

const ASSESTS = [...build, ...files];

// Install the service worker
self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(`cache-${version}`);
		await cache.addAll(ASSESTS);
	}

	event.waitUntil(addFilesToCache());
});

// Activate the service worker
self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== `cache-${version}`) {
				await caches.delete(key);
			}
		}
	}

	event.waitUntil(deleteOldCaches());
});

// Fetch the service worker if the network is not available
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond(): Promise<Response> {
		const url = new URL(event.request.url);
		const cache = await caches.open(`cache-${version}`);

		// Serve the build and files from the cache
		if (ASSESTS.includes(url.pathname)) {
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		try {
			const response = await fetch(event.request);
			const isNotExtension = url.protocol === 'http:';
			const isSuccess = response.status === 200;

			if (isNotExtension && isSuccess) {
				await cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// Fallback to cache if network is not available
			const cachedResponse = await cache.match(url.pathname);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		return new Response('Service Unavailable', { status: 404 });
	}

	event.respondWith(respond());
});

self.addEventListener('message', (event) => {
	if(event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
