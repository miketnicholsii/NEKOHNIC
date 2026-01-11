import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTasks, Task, TaskInsert } from "@/hooks/use-tasks";
import { useStreaks } from "@/hooks/use-streaks";
import { toast } from "sonner";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Trash2,
  Calendar,
  MoreVertical,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorState } from "@/components/LoadingStates";

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-muted-foreground", bg: "bg-muted" },
  medium: { label: "Medium", color: "text-foreground", bg: "bg-muted" },
  high: { label: "High", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  urgent: { label: "Urgent", color: "text-destructive", bg: "bg-destructive/10" },
};

const STATUS_CONFIG = {
  todo: { label: "To Do", icon: Circle, color: "text-muted-foreground" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-primary" },
  done: { label: "Done", icon: CheckCircle2, color: "text-green-600" },
};

export default function TaskManager() {
  const { recordTaskCompletion } = useStreaks();
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks({
    onTaskComplete: recordTaskCompletion,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState<TaskInsert>({
    title: "",
    description: null,
    status: "todo",
    priority: "medium",
    due_date: null,
    module: null,
    step: null,
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Give your task a name first");
      return;
    }

    try {
      await createTask(newTask);
      toast.success("Task added — you got this!");
      setNewTask({
        title: "",
        description: null,
        status: "todo",
        priority: "medium",
        due_date: null,
        module: null,
        step: null,
      });
      setIsCreateOpen(false);
    } catch {
      toast.error("Couldn't add that task. Try again?");
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTask(taskId, { status });
      if (status === "done") {
        toast.success("Nice work! Task complete.");
      } else {
        toast.success("Task updated");
      }
    } catch {
      toast.error("Couldn't update that. Try again?");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task removed");
    } catch {
      toast.error("Couldn't delete that. Try again?");
    }
  };

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const doneTasks = tasks.filter(t => t.status === "done");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Task Manager</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} total tasks • {doneTasks.length} completed
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="cta" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)..."
                value={newTask.description || ""}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value || null }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task["priority"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newTask.module || "none"}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, module: value === "none" ? null : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Module</SelectItem>
                    <SelectItem value="business_starter">Business Starter</SelectItem>
                    <SelectItem value="business_credit">Business Credit</SelectItem>
                    <SelectItem value="personal_brand">Personal Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="date"
                value={newTask.due_date?.split("T")[0] || ""}
                onChange={(e) => setNewTask(prev => ({ 
                  ...prev, 
                  due_date: e.target.value ? new Date(e.target.value).toISOString() : null 
                }))}
              />
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Columns */}
      {error && (
        <ErrorState
          title="Couldn't load your tasks"
          description={error}
          onRetry={fetchTasks}
          variant="card"
        />
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {/* To Do */}
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          status="todo"
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />
        
        {/* In Progress */}
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="in_progress"
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />
        
        {/* Done */}
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          status="done"
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

function TaskColumn({
  title,
  tasks,
  status,
  onStatusChange,
  onDelete,
}: {
  title: string;
  tasks: Task[];
  status: Task["status"];
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="bg-muted/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tasks
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  index,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  index: number;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => {
            const nextStatus: Record<Task["status"], Task["status"]> = {
              todo: "in_progress",
              in_progress: "done",
              done: "todo",
            };
            onStatusChange(task.id, nextStatus[task.status]);
          }}
          className="mt-0.5 flex-shrink-0"
        >
          {task.status === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : task.status === "in_progress" ? (
            <Clock className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
            {task.module && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {task.module.replace("_", " ")}
              </span>
            )}
            {task.due_date && (
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                {isOverdue && <AlertTriangle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange(task.id, "todo")}>
              Move to To Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, "in_progress")}>
              Move to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, "done")}>
              Move to Done
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
