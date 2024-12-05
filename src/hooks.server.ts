import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Log the incoming request details
    console.log('Incoming request:', {
        method: event.request.method,
        url: event.url.href,
    });

    // Call the next handler (e.g., to load page or endpoint)
    const response = await resolve(event);

    // Log the outgoing response details
    console.log('Outgoing response:', {
        status: response.status,
    });

    return response;
};
