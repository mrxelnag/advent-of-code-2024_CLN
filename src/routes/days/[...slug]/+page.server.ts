// +page.server.ts
import type { PageServerLoad } from './$types';
import type { PageResponse, DayResult } from '$lib/types/days/types';

export const load: PageServerLoad = async ({params}): Promise<PageResponse> => {
    const {slug} = params;
    try {
        const response = await fetch(`http://localhost:8080/api/days/${slug}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const result = await response.json() as { res: DayResult };
        return result;
    } catch (error) {
        return {
            res: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
