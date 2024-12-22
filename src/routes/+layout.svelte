<script lang="ts">
    import '../app.css';
    import Navigation from '../lib/components/navigation.svelte';
    import {browser} from '$app/environment'
    import {QueryClient, QueryClientProvider} from '@tanstack/svelte-query'
    import {onMount} from "svelte";

    let {children} = $props();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
            },
        },
    })

    async function detectSWUpdate() {
        const registration = await navigator.serviceWorker.ready;
        registration.addEventListener("updatefound", () => {
            const newSW = registration.installing;
            newSW?.addEventListener("statechange", () => {
                if (newSW?.state === "installed") {
                    console.log("New SW installed. Reloading page");
                    if (confirm("New version available. Reload to update?")) {
                        newSW.postMessage({type: "SKIP_WAITING"});
                        window.location.reload();
                    }
                }
            });
        });
    }

    onMount(() => {
        detectSWUpdate();
    });
</script>

<QueryClientProvider client={queryClient}>
    <Navigation/>
    <main class="flex items-center min-h-screen justify-center">
        {@render children()}
    </main>
</QueryClientProvider>
