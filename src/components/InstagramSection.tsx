import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const INSTAGRAM_URL = "https://www.instagram.com/hellneko.co";
const INSTAGRAM_HANDLE = "@hellneko.co";

interface InstagramData {
  followers: number | null;
  formatted: string | null;
}

export function InstagramSection() {
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const { data: response, error } = await supabase.functions.invoke("instagram-followers");
        
        if (error) {
          console.error("Failed to fetch Instagram data:", error);
          setData({ followers: null, formatted: null });
        } else {
          setData(response);
        }
      } catch (err) {
        console.error("Instagram fetch error:", err);
        setData({ followers: null, formatted: null });
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
  }, []);

  return (
    <motion.div 
      className="flex flex-col items-start gap-4"
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

      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow
        </a>
      </Button>
    </motion.div>
  );
}

export function InstagramBadge() {
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const { data: response, error } = await supabase.functions.invoke("instagram-followers");
        
        if (error) {
          setData({ followers: null, formatted: null });
        } else {
          setData(response);
        }
      } catch {
        setData({ followers: null, formatted: null });
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
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
}
