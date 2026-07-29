# Why there is no root `loading.tsx`

There used to be a `src/app/loading.tsx` rendering a full-screen spinner. It was
removed deliberately — **do not add one back at the app root.**

A route-level `loading.tsx` makes Next stream a skeleton immediately. Once any
HTML is flushed the HTTP status is locked, so a later `notFound()` can no longer
set 404. Because that file sat at the **root**, it applied to every route in the
app, and every missing page answered **HTTP 200** with the 404 body:

```
/p/<missing>                                  200   (body = 404 page)
/events/<missing>                             200
/institutions/engineering/programs/<missing>  200
/institutions/<inst>/p/<missing>              200
```

Search engines index nonexistent URLs as valid pages, and any client checking
`res.ok` gets a false positive. With the file removed, all of those return a real
`404` and ISR is untouched — `revalidate` and `generateStaticParams` still apply,
so this cost no caching.

Verified against Next.js 16.2.12 with `next build` + `next start`. Note that
neither `dynamicParams`, a segment-level `not-found.tsx`, nor
`dynamic = "force-dynamic"` fixes the status — only removing the streaming
boundary above the `notFound()` call does.

If a segment genuinely needs loading UI, use `<Suspense>` **inside** the page,
below the data fetch that decides whether to call `notFound()`, or add a
`loading.tsx` scoped to a segment whose pages never call `notFound()`.

Upstream issue: https://github.com/vercel/next.js/issues/76474
