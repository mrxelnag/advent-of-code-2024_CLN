<script lang="ts">
    import '../app.css';
    import Navigation from '../lib/components/navigation.svelte';
    import {browser} from '$app/environment'
    import {QueryClient, QueryClientProvider} from '@tanstack/svelte-query'

    let {children} = $props();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
            },
        },
    })
</script>

<QueryClientProvider client={queryClient}>
    <Navigation/>
    <main class="flex items-center min-h-screen justify-center">
        {@render children()}
    </main>
</QueryClientProvider>
