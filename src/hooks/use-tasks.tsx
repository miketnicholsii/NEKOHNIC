import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase";
import { useAuth } from "@/hooks/use-auth";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  module: string | null;
  step: string | null;
  trello_card_id: string | null;
  trello_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, "id" | "user_id" | "created_at" | "updated_at" | "trello_card_id" | "trello_synced_at">;
export type TaskUpdate = Partial<TaskInsert>;

interface UseTasksOptions {
  onTaskComplete?: () => void;
}

export function useTasks(options?: UseTasksOptions) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTasks((data || []) as Task[]);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (task: TaskInsert): Promise<Task | null> => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from("user_tasks")
        .insert({
          ...task,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      const newTask = data as Task;
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate): Promise<Task | null> => {
    if (!user) return null;

    // Check if task is being marked as done
    const currentTask = tasks.find(t => t.id === id);
    const isCompletingTask = updates.status === "done" && currentTask?.status !== "done";

    try {
      const { data, error: updateError } = await supabase
        .from("user_tasks")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const updatedTask = data as Task;
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

      // Trigger callback when task is completed
      if (isCompletingTask && options?.onTaskComplete) {
        options.onTaskComplete();
      }

      return updatedTask;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from("user_tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;
      
      setTasks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const getTasksByModule = (module: string) => {
    return tasks.filter(t => t.module === module);
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(t => t.status === status);
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    getTasksByModule,
    getTasksByStatus,
  };
}
