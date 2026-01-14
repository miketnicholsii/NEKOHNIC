-- Add Vercel Speed Insights Getting Started Guide as a Resource
INSERT INTO public.resources (
  title,
  description,
  content,
  category,
  tier_required,
  is_published,
  read_time_minutes,
  sort_order
) VALUES (
  'Getting Started with Vercel Speed Insights',
  'A comprehensive guide to setting up and using Vercel Speed Insights to monitor and optimize your application''s performance metrics.',
  '# Getting Started with Vercel Speed Insights

This guide will help you get started with using Vercel Speed Insights on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

To use Vercel Speed Insights, you will need:
- A Vercel account (sign up for free at https://vercel.com/signup)
- A Vercel project (create a new project at https://vercel.com/new)
- The Vercel CLI installed (install using: `npm i -g vercel`)

## Step 1: Enable Speed Insights in Vercel

1. Go to your Vercel dashboard at https://vercel.com/dashboard
2. Select your project
3. Navigate to the **Speed Insights** tab
4. Click **Enable** in the dialog

**Note:** Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.

## Step 2: Add @vercel/speed-insights to Your Project

Using the package manager of your choice, add the `@vercel/speed-insights` package to your project:

```bash
npm i @vercel/speed-insights
```

Or with yarn:
```bash
yarn add @vercel/speed-insights
```

Or with pnpm:
```bash
pnpm add @vercel/speed-insights
```

Or with bun:
```bash
bun add @vercel/speed-insights
```

## Step 3: Add the SpeedInsights Component to Your App

The specific implementation depends on your framework:

### For React Applications

```tsx
import { SpeedInsights } from ''@vercel/speed-insights/react'';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <SpeedInsights />
    </div>
  );
}
```

### For Next.js (App Router)

```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### For Next.js (Pages Router)

```tsx
import { SpeedInsights } from ''@vercel/speed-insights/next'';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
```

### For Vue.js

```vue
<script setup>
import { SpeedInsights } from ''@vercel/speed-insights/vue'';
</script>

<template>
  <SpeedInsights />
</template>
```

### For Svelte

```ts
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();
```

### For Other Frameworks

```ts
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();
```

## Step 4: Deploy Your App to Vercel

You can deploy your app to Vercel''s global CDN by running:

```bash
vercel deploy
```

Alternatively, connect your project''s git repository to Vercel for automatic deployments of your latest pushes and merges to main.

Once your app is deployed, it''s ready to begin tracking performance metrics.

## Step 5: View Your Data in the Dashboard

Once your app is deployed and users have visited your site:

1. Go to your Vercel dashboard at https://vercel.com/dashboard
2. Select your project
3. Click the **Speed Insights** tab
4. After a few days of visitor traffic, you''ll be able to start exploring your metrics

## Understanding Your Metrics

Speed Insights tracks Core Web Vitals and other important performance metrics:

- **Largest Contentful Paint (LCP):** How quickly the largest visible content element loads
- **First Input Delay (FID):** How responsive your page is to user interaction
- **Cumulative Layout Shift (CLS):** How much your page content shifts unexpectedly during load
- **First Contentful Paint (FCP):** When the first content appears on the page
- **Time to First Byte (TTFB):** Server response time

## Advanced Configuration

### Removing Sensitive Information from URLs

You can remove sensitive information from the URL by adding a `speedInsightsBeforeSend` function to the global `window` object:

```tsx
declare global {
  interface Window {
    speedInsightsBeforeSend?: (data: any) => any;
  }
}

window.speedInsightsBeforeSend = (data) => {
  // Remove query parameters or other sensitive info
  if (data.route) {
    data.route = data.route.split(''?'')[0];
  }
  return data;
};
```

## Privacy and Compliance

Vercel Speed Insights is designed with privacy in mind and complies with various data protection standards. For more information, see the [privacy policy](https://vercel.com/docs/speed-insights/privacy-policy).

## Troubleshooting

If you''re having issues with Speed Insights:

1. **Check that the script is loaded:** Open your browser console and verify that `/_vercel/speed-insights/script.js` is loaded and has no errors
2. **Verify Speed Insights is enabled:** Go to your Vercel dashboard and confirm that Speed Insights is enabled for your project
3. **Wait for data:** It may take a few hours to days for data to appear in the dashboard
4. **Check user traffic:** Make sure your site is receiving visitor traffic

## Next Steps

Now that you have Vercel Speed Insights set up, you can:

- Learn more about the `@vercel/speed-insights` package and its configuration options
- Review the specific metrics and what they mean for your application
- Set up performance budgets and monitoring alerts
- Compare your metrics across different deployments and time periods
- Optimize your application based on the insights provided

For more information, visit the [Vercel Speed Insights documentation](https://vercel.com/docs/speed-insights).',
  'business-setup',
  'start',
  true,
  8,
  100
);
