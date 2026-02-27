import { useState } from "react";
import { Key, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/context/ApiKeyContext";
import { toast } from "sonner";

export default function ApiKeyModal() {
  const { apiKey, setApiKey, showModal, setShowModal } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error("Please enter a valid API key");
      return;
    }
    setApiKey(trimmed);
    setShowModal(false);
    toast.success("API key saved successfully");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">Gemini API Key</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            SheCodes uses Google Gemini AI to generate contests, practice questions, and prep plans.
            Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono text-sm"
            />
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Get a free API key from Google AI Studio
          </a>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              className="flex-1 btn-primary border-0"
            >
              Save Key
            </Button>
            {apiKey && (
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
