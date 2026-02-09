import { useState } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  X,
  Play,
  Target
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTaskFromInsight } from "@/functions/create-task-from-insight";
import { resolveInsight } from "@/functions/resolve-insight";

export interface Insight {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  explanation: string;
  supportingData: any;
  status: string;
  createdAt: string;
  resolvedAt?: string;
}

interface InsightsListProps {
  insights: Insight[];
  onInsightResolved?: (insightId: string) => void;
  onTaskCreated?: (taskId: string) => void;
}

export function InsightsList({ insights, onInsightResolved, onTaskCreated }: InsightsListProps) {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    dueDate: "",
    priority: "medium",
    notes: ""
  });
  const [creatingTask, setCreatingTask] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "high": return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "medium": return <Clock className="h-5 w-5 text-yellow-500" />;
      case "low": return <Activity className="h-5 w-5 text-blue-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case "spending_spike": return <TrendingUp className="h-4 w-4" />;
      case "savings_drop": return <TrendingDown className="h-4 w-4" />;
      case "budget_leakage": return <AlertCircle className="h-4 w-4" />;
      case "income_dip": return <TrendingDown className="h-4 w-4" />;
      case "debt_growth": return <AlertTriangle className="h-4 w-4" />;
      case "transaction_silence": return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleResolveInsight = async (insightId: string, action: string, notes?: string) => {
    try {
      await resolveInsight({ data: { insightId, action, notes } } as any);
      
      onInsightResolved?.(insightId);
    } catch (error) {
      console.error("Failed to resolve insight:", error);
    }
  };

  const handleCreateTask = async (insightId: string) => {
    setCreatingTask(true);
    try {
      const response = await createTaskFromInsight({ data: {
        insightId,
        taskType: "spending_review",
        dueDate: taskForm.dueDate || undefined,
        priority: taskForm.priority
      }} as any);

      const task = response.data;
      onTaskCreated?.(task.id);
      setIsTaskDialogOpen(false);
      setSelectedInsight(null);
      setTaskForm({ dueDate: "", priority: "medium", notes: "" });
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setCreatingTask(false);
    }
  };

  const openTaskDialog = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsTaskDialogOpen(true);
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">All caught up!</h3>
          <p className="text-muted-foreground">
            No active insights. Your financial data looks healthy right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant={getSeverityVariant(insight.severity)}>
                      {insight.severity}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {insight.explanation}
                  </CardDescription>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(insight.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Supporting Data Preview */}
            {insight.supportingData && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {insight.type === "spending_spike" && insight.supportingData.percentageIncrease && (
                    <div>
                      <span className="text-muted-foreground">Increase:</span>
                      <span className="ml-1 font-medium">{insight.supportingData.percentageIncrease.toFixed(1)}%</span>
                    </div>
                  )}
                  {insight.type === "savings_drop" && insight.supportingData.currentSavingsRate && (
                    <div>
                      <span className="text-muted-foreground">Current Rate:</span>
                      <span className="ml-1 font-medium">{insight.supportingData.currentSavingsRate.toFixed(1)}%</span>
                    </div>
                  )}
                  {insight.type === "budget_leakage" && insight.supportingData.overagePercentage && (
                    <div>
                      <span className="text-muted-foreground">Over Budget:</span>
                      <span className="ml-1 font-medium">{insight.supportingData.overagePercentage.toFixed(1)}%</span>
                    </div>
                  )}
                  {insight.type === "income_dip" && insight.supportingData.percentageDecrease && (
                    <div>
                      <span className="text-muted-foreground">Income Drop:</span>
                      <span className="ml-1 font-medium">{insight.supportingData.percentageDecrease.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger>
                  <Button variant="outline" size="sm" onClick={() => setSelectedInsight(insight)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {getInsightTypeIcon(insight.type)}
                      {insight.title}
                    </DialogTitle>
                    <DialogDescription>
                      Detailed analysis and recommendations
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedInsight && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedInsight.explanation}
                        </p>
                      </div>
                      
                      {selectedInsight.supportingData && (
                        <div>
                          <h4 className="font-medium mb-2">Supporting Data</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(selectedInsight.supportingData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          onClick={() => openTaskDialog(selectedInsight)}
                          className="flex-1"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Create Action Task
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleResolveInsight(selectedInsight.id, "reviewed")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openTaskDialog(insight)}
              >
                <Target className="h-4 w-4 mr-2" />
                Create Task
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleResolveInsight(insight.id, "dismissed")}
              >
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Task Creation Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task from Insight</DialogTitle>
            <DialogDescription>
              {selectedInsight?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={taskForm.priority} 
                onValueChange={(value: string | null) => setTaskForm(prev => ({ ...prev, priority: value || "medium" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional context or notes..."
                value={taskForm.notes}
                onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => selectedInsight && handleCreateTask(selectedInsight.id)}
                disabled={creatingTask}
                className="flex-1"
              >
                {creatingTask ? (
                  "Creating..."
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsTaskDialogOpen(false)}
                disabled={creatingTask}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}