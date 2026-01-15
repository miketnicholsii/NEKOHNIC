import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase";
import { useTasks } from "@/hooks/use-tasks";
import { FeatureGate } from "@/components/FeatureGate";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import { PageLoader } from "@/components/LoadingStates";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Lock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProgressEntry {
  step: string;
  module: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

const MODULE_COLORS: Record<string, string> = {
  business_starter: "hsl(var(--primary))",
  business_credit: "hsl(142, 76%, 36%)",
  personal_brand: "hsl(280, 68%, 60%)",
};

const MODULE_NAMES: Record<string, string> = {
  business_starter: "Business Starter",
  business_credit: "Business Credit",
  personal_brand: "Personal Brand",
};

const MODULE_STEP_COUNTS: Record<string, number> = {
  business_starter: 5,
  business_credit: 7,
  personal_brand: 6,
};

export default function Analytics() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Feature access for advanced analytics
  const advancedAccess = useFeatureGate("analytics_advanced");

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: true });

        if (error) throw error;
        setProgress(data || []);
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  // Filter data by time range
  const filteredProgress = useMemo(() => {
    if (timeRange === "all") return progress;
    
    const now = new Date();
    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const cutoff = new Date(now.getTime() - daysMap[timeRange] * 24 * 60 * 60 * 1000);
    
    return progress.filter(p => 
      p.completed_at && new Date(p.completed_at) >= cutoff
    );
  }, [progress, timeRange]);

  // Completion over time data
  const completionOverTime = useMemo(() => {
    const completedItems = filteredProgress.filter(p => p.completed && p.completed_at);
    const grouped: Record<string, number> = {};

    completedItems.forEach(item => {
      const date = new Date(item.completed_at!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // Create cumulative data
    let cumulative = 0;
    return Object.entries(grouped).map(([date, count]) => {
      cumulative += count;
      return { date, completed: count, cumulative };
    });
  }, [filteredProgress]);

  // Module breakdown data
  const moduleBreakdown = useMemo(() => {
    const modules = ["business_starter", "business_credit", "personal_brand"];
    
    return modules.map(module => {
      const moduleProgress = filteredProgress.filter(p => p.module === module);
      const completed = moduleProgress.filter(p => p.completed).length;
      const total = MODULE_STEP_COUNTS[module];
      
      return {
        module,
        name: MODULE_NAMES[module],
        completed,
        total,
        remaining: total - completed,
        percentage: Math.round((completed / total) * 100),
      };
    });
  }, [filteredProgress]);

  // Pie chart data
  const pieData = useMemo(() => {
    return moduleBreakdown.map(m => ({
      name: m.name,
      value: m.completed,
      color: MODULE_COLORS[m.module],
    })).filter(d => d.value > 0);
  }, [moduleBreakdown]);

  // Task analytics
  const taskAnalytics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const inProgress = tasks.filter(t => t.status === "in_progress").length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const overdue = tasks.filter(t => 
      t.status !== "done" && 
      t.due_date && 
      new Date(t.due_date) < new Date()
    ).length;

    return { total, completed, inProgress, todo, overdue };
  }, [tasks]);

  // Weekly activity data
  const weeklyActivity = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dateStr = date.toISOString().split("T")[0];
      const completedSteps = progress.filter(p => 
        p.completed_at?.startsWith(dateStr)
      ).length;
      const completedTasks = tasks.filter(t => 
        t.status === "done" && t.updated_at.startsWith(dateStr)
      ).length;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        steps: completedSteps,
        tasks: completedTasks,
      };
    });
  }, [progress, tasks]);

  // Summary stats
  const totalCompleted = progress.filter(p => p.completed).length;
  const totalSteps = Object.values(MODULE_STEP_COUNTS).reduce((a, b) => a + b, 0);
  const overallProgress = Math.round((totalCompleted / totalSteps) * 100);

  if (isLoading) {
    return <PageLoader message="Loading analytics..." />;
  }

  return (
    <FeatureGate 
      feature="analytics_basic"
      lockedTitle="Progress Analytics"
      lockedDescription="Track your journey, view completion trends, and get insights into your progress over time."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Your Progress
            </h1>
            <p className="text-muted-foreground">
              A clear view of how your journey is unfolding
            </p>
          </div>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={Target}
            label="Overall Progress"
            value={`${overallProgress}%`}
            subtext={`${totalCompleted} of ${totalSteps} steps`}
            color="primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="Tasks Completed"
            value={taskAnalytics.completed.toString()}
            subtext={`of ${taskAnalytics.total} total`}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={taskAnalytics.inProgress.toString()}
            subtext="active tasks"
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Overdue"
            value={taskAnalytics.overdue.toString()}
            subtext="need attention"
            color="red"
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Completion Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Progress Over Time</h2>
            </div>
            
            {completionOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={completionOverTime}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorCumulative)"
                    name="Total Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Complete steps to see your progress chart" />
            )}
          </motion.div>

          {/* Module Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Module Progress</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={moduleBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 'dataMax']} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === "completed" ? "Completed" : "Remaining"
                  ]}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--primary))" name="Completed" radius={[0, 4, 4, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="hsl(var(--muted))" name="Remaining" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Weekly Activity</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="steps" fill="hsl(var(--primary))" name="Steps Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill="hsl(142, 76%, 36%)" name="Tasks Done" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribution Pie Chart - Advanced Feature */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Completion Distribution</h2>
              </div>
              {!advancedAccess.hasAccess && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Lock className="h-3 w-3" />
                  Elite
                </Badge>
              )}
            </div>
            
            <FeatureGate 
              feature="analytics_advanced"
              lockedStyle="overlay"
              lockedTitle="Advanced Analytics"
              lockedDescription="Unlock detailed distribution charts and advanced insights."
              showUpgradeCTA={true}
            >
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} steps`, "Completed"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Complete steps to see distribution" />
              )}
            </FeatureGate>
          </motion.div>
        </div>

        {/* Module Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {moduleBreakdown.map((module) => (
            <div
              key={module.module}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{module.name}</h3>
                <span 
                  className="text-lg font-bold"
                  style={{ color: MODULE_COLORS[module.module] }}
                >
                  {module.percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${module.percentage}%`,
                    backgroundColor: MODULE_COLORS[module.module],
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {module.completed} of {module.total} steps completed
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </FeatureGate>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: "primary" | "green" | "blue" | "red";
}) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    green: "text-success bg-success/10",
    blue: "text-info bg-info/10",
    red: "text-destructive bg-destructive/10",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
      {message}
    </div>
  );
}
