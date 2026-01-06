import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ExternalLink,
  RefreshCw,
  Link2,
  Unlink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface TrelloConfig {
  apiKey: string | null;
  token: string | null;
  boardId: string | null;
  connected: boolean;
}

export default function TrelloIntegration() {
  const { user } = useAuth();
  const { tasks, updateTask } = useTasks();
  const [config, setConfig] = useState<TrelloConfig>({
    apiKey: null,
    token: null,
    boardId: null,
    connected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: "",
    token: "",
    boardId: "",
  });

  // Load config from localStorage (we'd store in DB in production)
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`trello_config_${user.id}`);
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    }
  }, [user]);

  const handleConnect = async () => {
    if (!formData.apiKey || !formData.token) {
      toast.error("API Key and Token are required");
      return;
    }

    setIsConnecting(true);
    try {
      // Validate credentials by fetching boards
      const response = await fetch(
        `https://api.trello.com/1/members/me/boards?key=${formData.apiKey}&token=${formData.token}`
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const newConfig = {
        apiKey: formData.apiKey,
        token: formData.token,
        boardId: formData.boardId || null,
        connected: true,
      };

      setConfig(newConfig);
      if (user) {
        localStorage.setItem(`trello_config_${user.id}`, JSON.stringify(newConfig));
      }

      toast.success("Connected to Trello!");
      setShowConnectDialog(false);
    } catch (error) {
      console.error("Trello connection error:", error);
      toast.error("Failed to connect to Trello. Check your credentials.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConfig({
      apiKey: null,
      token: null,
      boardId: null,
      connected: false,
    });
    if (user) {
      localStorage.removeItem(`trello_config_${user.id}`);
    }
    toast.success("Disconnected from Trello");
  };

  const syncTaskToTrello = async (taskId: string, title: string, description?: string) => {
    if (!config.connected || !config.apiKey || !config.token || !config.boardId) {
      return null;
    }

    try {
      // Get lists for the board
      const listsResponse = await fetch(
        `https://api.trello.com/1/boards/${config.boardId}/lists?key=${config.apiKey}&token=${config.token}`
      );
      const lists = await listsResponse.json();
      const todoList = lists.find((l: { name: string }) => 
        l.name.toLowerCase().includes("todo") || l.name.toLowerCase().includes("to do")
      ) || lists[0];

      if (!todoList) {
        throw new Error("No list found on board");
      }

      // Create card
      const cardResponse = await fetch(
        `https://api.trello.com/1/cards?key=${config.apiKey}&token=${config.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: title,
            desc: description || "",
            idList: todoList.id,
          }),
        }
      );

      const card = await cardResponse.json();
      return card.id;
    } catch (error) {
      console.error("Error syncing to Trello:", error);
      return null;
    }
  };

  const handleSyncAll = async () => {
    if (!config.connected || !config.boardId) {
      toast.error("Please connect to Trello and set a board ID first");
      return;
    }

    setIsSyncing(true);
    let synced = 0;

    try {
      for (const task of tasks) {
        if (!task.trello_card_id) {
          const cardId = await syncTaskToTrello(task.id, task.title, task.description || undefined);
          if (cardId) {
            await updateTask(task.id, { 
              trello_card_id: cardId,
              trello_synced_at: new Date().toISOString(),
            } as any);
            synced++;
          }
        }
      }

      toast.success(`Synced ${synced} tasks to Trello`);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync some tasks");
    } finally {
      setIsSyncing(false);
    }
  };

  const syncedCount = tasks.filter(t => t.trello_card_id).length;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0079BF]/10 flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0079BF">
              <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM10.67 16.67C10.67 17.4 10.07 18 9.33 18H5.33C4.6 18 4 17.4 4 16.67V7.33C4 6.6 4.6 6 5.33 6H9.33C10.07 6 10.67 6.6 10.67 7.33V16.67ZM20 11.67C20 12.4 19.4 13 18.67 13H14.67C13.93 13 13.33 12.4 13.33 11.67V7.33C13.33 6.6 13.93 6 14.67 6H18.67C19.4 6 20 6.6 20 7.33V11.67Z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Trello Integration</h3>
            <p className="text-xs text-muted-foreground">
              {config.connected ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </span>
              ) : (
                "Sync tasks with Trello boards"
              )}
            </p>
          </div>
        </div>

        {config.connected ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAll}
              disabled={isSyncing || !config.boardId}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              Sync
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
            >
              <Unlink className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Link2 className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to Trello</DialogTitle>
                <DialogDescription>
                  Enter your Trello API credentials to sync tasks
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    API Key
                  </label>
                  <Input
                    placeholder="Your Trello API Key"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <a
                    href="https://trello.com/app-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    Get your API key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Token
                  </label>
                  <Input
                    placeholder="Your Trello Token"
                    value={formData.token}
                    onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Board ID (optional)
                  </label>
                  <Input
                    placeholder="Board ID for syncing"
                    value={formData.boardId}
                    onChange={(e) => setFormData(prev => ({ ...prev, boardId: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find this in the Trello board URL
                  </p>
                </div>
                <Button 
                  onClick={handleConnect} 
                  className="w-full"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect to Trello"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {config.connected && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasks synced to Trello</span>
            <span className="font-medium text-foreground">
              {syncedCount} / {tasks.length}
            </span>
          </div>
          {!config.boardId && (
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
              <AlertCircle className="h-3 w-3" />
              Set a Board ID to enable syncing
            </p>
          )}
        </div>
      )}
    </div>
  );
}
