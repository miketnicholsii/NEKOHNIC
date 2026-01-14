import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  CreditCard,
  Store,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Tradeline {
  id: string;
  vendor_name: string;
  account_type: string;
  credit_limit: number | null;
  current_balance: number | null;
  payment_status: string;
  opened_date: string | null;
  reports_to: string[] | null;
  notes: string | null;
}

const ACCOUNT_TYPES = [
  { value: "net30", label: "Net-30", icon: Clock },
  { value: "store_credit", label: "Store Credit", icon: Store },
  { value: "revolving", label: "Revolving Credit", icon: CreditCard },
  { value: "term_loan", label: "Term Loan", icon: Landmark },
];

const PAYMENT_STATUSES = [
  { value: "current", label: "Current", color: "text-green-500", icon: CheckCircle2 },
  { value: "late", label: "Late", color: "text-yellow-500", icon: AlertCircle },
  { value: "paid_off", label: "Paid Off", color: "text-blue-500", icon: CheckCircle2 },
  { value: "closed", label: "Closed", color: "text-muted-foreground", icon: XCircle },
];

const BUREAUS = ["D&B (Dun & Bradstreet)", "Experian Business", "Equifax Business"];

interface Props {
  userId: string;
}

export default function TradelineTracker({ userId }: Props) {
  const [tradelines, setTradelines] = useState<Tradeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
  const [formData, setFormData] = useState({
    vendor_name: "",
    account_type: "net30",
    credit_limit: "",
    current_balance: "",
    payment_status: "current",
    opened_date: "",
    reports_to: [] as string[],
    notes: "",
  });

  const loadTradelines = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("tradelines")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTradelines(data || []);
    } catch (error) {
      console.error("Error loading tradelines:", error);
      toast.error("Couldn't load your tradelines. Try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTradelines();
  }, [loadTradelines]);

  const handleBureauToggle = (bureau: string) => {
    setFormData(prev => ({
      ...prev,
      reports_to: prev.reports_to.includes(bureau)
        ? prev.reports_to.filter(b => b !== bureau)
        : [...prev.reports_to, bureau]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const payload = {
        user_id: userId,
        vendor_name: formData.vendor_name,
        account_type: formData.account_type,
        credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : null,
        current_balance: formData.current_balance ? parseFloat(formData.current_balance) : null,
        payment_status: formData.payment_status,
        opened_date: formData.opened_date || null,
        reports_to: formData.reports_to.length > 0 ? formData.reports_to : null,
        notes: formData.notes || null,
      };

      if (editingTradeline) {
        const { error } = await supabase
          .from("tradelines")
          .update(payload)
          .eq("id", editingTradeline.id);

        if (error) throw error;
        toast.success("Tradeline updated!");
      } else {
        const { error } = await supabase
          .from("tradelines")
          .insert(payload);

        if (error) throw error;
        toast.success("Tradeline added — great progress!");
      }

      setIsDialogOpen(false);
      resetForm();
      loadTradelines();
    } catch (error) {
      console.error("Error saving tradeline:", error);
      toast.error("Couldn't save that. Try again?");
    }
  };

  const handleEdit = (tradeline: Tradeline) => {
    setEditingTradeline(tradeline);
    setFormData({
      vendor_name: tradeline.vendor_name,
      account_type: tradeline.account_type,
      credit_limit: tradeline.credit_limit?.toString() || "",
      current_balance: tradeline.current_balance?.toString() || "",
      payment_status: tradeline.payment_status,
      opened_date: tradeline.opened_date || "",
      reports_to: tradeline.reports_to || [],
      notes: tradeline.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tradeline?")) return;

    try {
      const { error } = await supabase
        .from("tradelines")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Tradeline removed");
      loadTradelines();
    } catch (error) {
      console.error("Error deleting tradeline:", error);
      toast.error("Couldn't delete that. Try again?");
    }
  };

  const resetForm = () => {
    setEditingTradeline(null);
    setFormData({
      vendor_name: "",
      account_type: "net30",
      credit_limit: "",
      current_balance: "",
      payment_status: "current",
      opened_date: "",
      reports_to: [],
      notes: "",
    });
  };

  const totalCreditLimit = tradelines.reduce((sum, t) => sum + (t.credit_limit || 0), 0);
  const totalBalance = tradelines.reduce((sum, t) => sum + (t.current_balance || 0), 0);
  const utilizationRate = totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-pulse text-muted-foreground">Loading tradelines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Tradelines</p>
          <p className="text-2xl font-bold text-foreground">{tradelines.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Credit</p>
          <p className="text-2xl font-bold text-foreground">
            ${totalCreditLimit.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Utilization</p>
          <p className={`text-2xl font-bold ${utilizationRate > 30 ? 'text-yellow-500' : 'text-primary'}`}>
            {utilizationRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Tradeline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTradeline ? "Edit Tradeline" : "Add New Tradeline"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))}
                  placeholder="e.g., Uline, Home Depot"
                  required
                />
              </div>

              <div>
                <Label htmlFor="account_type">Account Type *</Label>
                <select
                  id="account_type"
                  value={formData.account_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credit_limit">Credit Limit ($)</Label>
                  <Input
                    id="credit_limit"
                    type="number"
                    value={formData.credit_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, credit_limit: e.target.value }))}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="current_balance">Current Balance ($)</Label>
                  <Input
                    id="current_balance"
                    type="number"
                    value={formData.current_balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_balance: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_status">Payment Status</Label>
                <select
                  id="payment_status"
                  value={formData.payment_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="opened_date">Date Opened</Label>
                <Input
                  id="opened_date"
                  type="date"
                  value={formData.opened_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, opened_date: e.target.value }))}
                />
              </div>

              <div>
                <Label>Reports To</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {BUREAUS.map((bureau) => (
                    <div
                      key={bureau}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.reports_to.includes(bureau)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleBureauToggle(bureau)}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        formData.reports_to.includes(bureau)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}>
                        {formData.reports_to.includes(bureau) && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">{bureau}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Account number, contact info, etc."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTradeline ? "Update" : "Add"} Tradeline
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tradelines List */}
      {tradelines.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No tradelines yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Start tracking your vendor accounts and credit lines to monitor your business credit growth.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tradelines.map((tradeline) => {
            const typeInfo = ACCOUNT_TYPES.find(t => t.value === tradeline.account_type);
            const statusInfo = PAYMENT_STATUSES.find(s => s.value === tradeline.payment_status);
            const TypeIcon = typeInfo?.icon || CreditCard;
            const StatusIcon = statusInfo?.icon || CheckCircle2;

            return (
              <div
                key={tradeline.id}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tradeline.vendor_name}</h3>
                      <p className="text-sm text-muted-foreground">{typeInfo?.label}</p>
                      {tradeline.reports_to && tradeline.reports_to.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reports to: {tradeline.reports_to.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo?.label}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tradeline)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tradeline.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {(tradeline.credit_limit || tradeline.current_balance) && (
                  <div className="mt-4 pt-4 border-t border-border flex gap-6">
                    {tradeline.credit_limit && (
                      <div>
                        <p className="text-xs text-muted-foreground">Credit Limit</p>
                        <p className="font-semibold text-foreground">${tradeline.credit_limit.toLocaleString()}</p>
                      </div>
                    )}
                    {tradeline.current_balance !== null && (
                      <div>
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="font-semibold text-foreground">${tradeline.current_balance.toLocaleString()}</p>
                      </div>
                    )}
                    {tradeline.credit_limit && tradeline.current_balance !== null && (
                      <div>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <p className="font-semibold text-foreground">
                          {((tradeline.current_balance / tradeline.credit_limit) * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
