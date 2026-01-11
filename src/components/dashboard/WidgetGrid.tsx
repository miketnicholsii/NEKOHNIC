import { ReactNode, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings2, RotateCcw, Check, X, Eye, EyeOff } from "lucide-react";
import { useDashboardLayout, DASHBOARD_WIDGETS } from "@/hooks/use-dashboard-layout";
import DraggableWidget from "./DraggableWidget";
import { WidgetErrorBoundary } from "@/components/ErrorBoundary";
import { WidgetGridSkeleton } from "./DashboardSkeletons";

// Widget components
import DashboardStats from "./DashboardStats";
import FullProductSuite from "./FullProductSuite";
import ActivityFeed from "./ActivityFeed";
import StreakTracker from "./StreakTracker";
import AchievementsPreview from "./AchievementsPreview";
import TierProgress from "./TierProgress";
import AddOnsWidget from "./AddOnsWidget";
import NextSteps from "./NextSteps";
import QuickActions from "./QuickActions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Widget name mapping for error boundaries
const WIDGET_NAMES: Record<string, string> = {
  "stats": "Dashboard Stats",
  "product-suite": "Product Suite",
  "activity-feed": "Activity Feed",
  "streak-tracker": "Streak Tracker",
  "achievements": "Achievements",
  "tier-progress": "Tier Progress",
  "add-ons": "Add-Ons",
  "next-steps": "Next Steps",
  "quick-actions": "Quick Actions",
};

// Widget renderer with ErrorBoundary protection
function renderWidget(widgetId: string) {
  const widgetName = WIDGET_NAMES[widgetId] || widgetId;
  
  const getWidgetComponent = () => {
    switch (widgetId) {
      case "stats":
        return <DashboardStats />;
      case "product-suite":
        return <FullProductSuite />;
      case "activity-feed":
        return <ActivityFeed />;
      case "streak-tracker":
        return <StreakTracker />;
      case "achievements":
        return <AchievementsPreview />;
      case "tier-progress":
        return <TierProgress />;
      case "add-ons":
        return <AddOnsWidget />;
      case "next-steps":
        return <NextSteps />;
      case "quick-actions":
        return <QuickActions />;
      default:
        return null;
    }
  };

  const component = getWidgetComponent();
  if (!component) return null;

  return (
    <WidgetErrorBoundary name={widgetName}>
      {component}
    </WidgetErrorBoundary>
  );
}

// Get widget grid class based on minWidth
function getWidgetGridClass(widgetId: string) {
  const config = DASHBOARD_WIDGETS.find(w => w.id === widgetId);
  if (!config) return "";
  
  switch (config.minWidth) {
    case "full":
      return "col-span-full";
    case "lg":
      return "col-span-full lg:col-span-2";
    case "md":
      return "col-span-full md:col-span-2 lg:col-span-1";
    case "sm":
    default:
      return "col-span-1";
  }
}

export default function WidgetGrid() {
  const {
    visibleWidgets,
    hiddenWidgets,
    isLoading,
    isSaving,
    reorderWidgets,
    toggleWidget,
    resetLayout,
    allWidgets,
  } = useDashboardLayout();

  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = visibleWidgets.indexOf(active.id as string);
      const newIndex = visibleWidgets.indexOf(over.id as string);
      
      // Also include hidden widgets in the full order
      const newVisibleOrder = arrayMove(visibleWidgets, oldIndex, newIndex);
      const fullOrder = [...newVisibleOrder, ...hiddenWidgets];
      reorderWidgets(fullOrder);
    }
  };

  if (isLoading) {
    return <WidgetGridSkeleton />;
  }

  // Group widgets by size for proper layout
  const fullWidthWidgets = visibleWidgets.filter(id => {
    const config = DASHBOARD_WIDGETS.find(w => w.id === id);
    return config?.minWidth === "full";
  });
  
  const regularWidgets = visibleWidgets.filter(id => {
    const config = DASHBOARD_WIDGETS.find(w => w.id === id);
    return config?.minWidth !== "full";
  });

  return (
    <div className="space-y-6">
      {/* Edit Controls */}
      <div className="flex items-center justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={resetLayout}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Done
            </Button>
          </>
        ) : (
          <>
            {/* Widget visibility settings */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Widgets
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Dashboard Widgets</SheetTitle>
                  <SheetDescription>
                    Choose which widgets to show on your dashboard.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] mt-6">
                  <div className="space-y-4 pr-4">
                    {allWidgets.map((widget) => (
                      <div
                        key={widget.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <Label 
                            htmlFor={`widget-${widget.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {widget.title}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {widget.description}
                          </p>
                        </div>
                        <Switch
                          id={`widget-${widget.id}`}
                          checked={!hiddenWidgets.includes(widget.id)}
                          onCheckedChange={() => toggleWidget(widget.id)}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Customize
            </Button>
          </>
        )}
        
        {isSaving && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Saving...
          </span>
        )}
      </div>

      {/* Editing hint */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
          >
            <p className="text-sm text-primary font-medium">
              Drag widgets to reorder them. Click the eye icon to hide a widget.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleWidgets} strategy={rectSortingStrategy}>
          <div className="space-y-6">
            {/* Full-width widgets */}
            {fullWidthWidgets.map((widgetId) => (
              <DraggableWidget
                key={widgetId}
                id={widgetId}
                isEditing={isEditing}
                onHide={() => toggleWidget(widgetId)}
              >
                {renderWidget(widgetId)}
              </DraggableWidget>
            ))}

            {/* Regular widgets in grid */}
            {regularWidgets.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularWidgets.map((widgetId) => (
                  <DraggableWidget
                    key={widgetId}
                    id={widgetId}
                    isEditing={isEditing}
                    onHide={() => toggleWidget(widgetId)}
                    className={getWidgetGridClass(widgetId)}
                  >
                    {renderWidget(widgetId)}
                  </DraggableWidget>
                ))}
              </div>
            )}
          </div>
        </SortableContext>

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 rotate-2 scale-105">
              {renderWidget(activeId)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty state */}
      {visibleWidgets.length === 0 && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-border text-center">
          <EyeOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-foreground mb-2">
            All widgets are hidden
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Click "Widgets" to show some widgets, or reset to default layout.
          </p>
          <Button variant="outline" onClick={resetLayout}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      )}
    </div>
  );
}