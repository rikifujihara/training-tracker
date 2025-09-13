"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, Copy, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

interface PasteDataStepProps {
  rawData: string;
  setRawData: (data: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function PasteDataStep({ rawData, setRawData, onNext, canProceed }: PasteDataStepProps) {
  const [hasPasted, setHasPasted] = useState(false);

  const handlePaste = async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();
      setRawData(clipboardData);
      setHasPasted(true);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawData(e.target.value);
    if (!hasPasted && e.target.value.length > 0) {
      setHasPasted(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-surface-action-hover-2 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-surface-action mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">How to copy your leads data:</h3>
            <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
              <li>Open your email or spreadsheet with the leads data</li>
              <li>Select the data rows (no need to include headers)</li>
              <li>Copy it (Ctrl+C or Cmd+C)</li>
              <li>Paste it in the box below or click the &ldquo;Paste from Clipboard&rdquo; button</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              ✨ Don&apos;t worry about headers - we&apos;ll help you map each column to the right field!
            </p>
          </div>
        </div>
      </div>

      {/* Paste Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="paste-area" className="text-sm font-medium">
            Paste your table data here:
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Paste from Clipboard
          </Button>
        </div>
        
        <textarea
          id="paste-area"
          placeholder="Paste your table data here... 

Example format (no headers needed):
Sarah Mitchell	412345678	30/06/2025	1989	PT Pack
James Henderson	423456789	30/06/2025	1992	New Joiner
Emma Rodriguez	434567890	30/06/2025	1985	New Joiner"
          value={rawData}
          onChange={handleTextareaChange}
          className="w-full h-64 p-4 border border-input rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-surface-action focus:border-surface-action"
        />
      </div>

      {/* Preview */}
      {rawData && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Preview (first few lines):</Label>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
              {rawData.split('\n').slice(0, 5).join('\n')}
              {rawData.split('\n').length > 5 && '\n...'}
            </pre>
          </div>
        </div>
      )}

      {/* Validation */}
      {hasPasted && rawData.split('\n').length < 1 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            Please paste at least one row of lead data.
          </span>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}