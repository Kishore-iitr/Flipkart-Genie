"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/settingsStore";
import { Settings, Key } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { openrouterApiKey, setOpenrouterApiKey } = useSettingsStore();
  const [apiKey, setApiKey] = useState(openrouterApiKey);

  useEffect(() => {
    if (open) {
      setApiKey(useSettingsStore.getState().openrouterApiKey);
    }
  }, [open]);

  const handleSave = () => {
    setOpenrouterApiKey(apiKey.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Application Settings
          </DialogTitle>
          <DialogDescription>
            Configure your API keys to power the Flipkart Genie AI.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenRouter API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
            <p className="text-xs text-slate-500">
              This key is stored securely in your browser cookies and is only sent to the local server.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
