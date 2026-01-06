import { useState, useEffect, memo } from "react";
import { Instagram } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const INSTAGRAM_URL = "https://www.instagram.com/hellneko.co";
const INSTAGRAM_HANDLE = "@hellneko.co";

interface InstagramData {
  followers: number | null;
  formatted: string | null;
}

// Cache for Instagram data to prevent duplicate fetches
let cachedData: InstagramData | null = null;
let fetchPromise: Promise<InstagramData> | null = null;

async function fetchInstagramData(): Promise<InstagramData> {
  if (cachedData) return cachedData;
  
  if (fetchPromise) return fetchPromise;
  
  fetchPromise = (async () => {
    try {
      // Use direct fetch with GET method since the edge function requires GET
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-followers`,
        {
          method: "GET",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        console.error("Failed to fetch Instagram data:", response.status);
        return { followers: null, formatted: null };
      }
      
      const data = await response.json();
      cachedData = data;
      return data;
    } catch (err) {
      console.error("Instagram fetch error:", err);
      return { followers: null, formatted: null };
    } finally {
      fetchPromise = null;
    }
  })();
  
  return fetchPromise;
}

export const InstagramSection = memo(function InstagramSection() {
  const [data, setData] = useState<InstagramData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    fetchInstagramData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div 
      className="flex flex-col items-start gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-start gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex items-center gap-3">
          <Instagram className="h-5 w-5 text-primary-foreground/80" />
          <span className="font-display text-base tracking-wide text-primary-foreground">
            {INSTAGRAM_HANDLE}
          </span>
        </div>
        
        {loading ? (
          <Skeleton className="h-4 w-20 bg-primary-foreground/10" />
        ) : data?.formatted ? (
          <motion.span 
            className="text-sm text-primary-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.formatted} followers
          </motion.span>
        ) : null}
      </a>
    </motion.div>
  );
});

export const InstagramBadge = memo(function InstagramBadge() {
  const [data, setData] = useState<InstagramData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    fetchInstagramData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-sm transition-all hover:border-primary/30 hover:bg-secondary"
    >
      <Instagram className="h-4 w-4 text-primary" />
      <span className="font-medium text-foreground">{INSTAGRAM_HANDLE}</span>
      {loading ? (
        <Skeleton className="h-3 w-12" />
      ) : data?.formatted ? (
        <span className="text-muted-foreground">• {data.formatted}</span>
      ) : null}
    </a>
  );
});
