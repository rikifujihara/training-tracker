"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Copy, FileText, AlertCircle, Upload, Table } from "lucide-react";
import { useState } from "react";
import * as React from "react";

interface PasteDataStepProps {
  rawData: string;
  setRawData: (data: string) => void;
  hasHeaders: boolean;
  setHasHeaders: (hasHeaders: boolean) => void;
  onNext: () => void;
  canProceed: boolean;
}

// Smart table parser - detects various data formats
const parseTableData = (text: string, delimiter?: string): string[][] => {
  if (!text.trim()) return [];

  // Try to parse HTML tables first (from emails/web pages)
  const htmlMatch = text.match(/<table[\s\S]*?<\/table>/i);
  if (htmlMatch) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlMatch[0], 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr'));
    return rows.map(row =>
      Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent?.trim() || '')
    ).filter(row => row.length > 0);
  }

  // If delimiter is specified, use it
  if (delimiter) {
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => line.split(delimiter).map(cell => cell.trim()));
  }

  // Auto-detect delimiter by testing common ones
  const delimiters = ['\t', ',', '|', ';', ' '];
  const lines = text.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  let bestDelimiter = '\t';
  let bestScore = 0;

  for (const delim of delimiters) {
    const parsed = lines.map(line => line.split(delim).map(cell => cell.trim()));

    // Calculate consistency score
    const fieldCounts = parsed.map(row => row.length);
    const avgFields = fieldCounts.reduce((a, b) => a + b, 0) / fieldCounts.length;
    const consistency = fieldCounts.filter(count => Math.abs(count - avgFields) <= 1).length / fieldCounts.length;

    // Prefer delimiters that create more fields and better consistency
    const score = avgFields * consistency;

    if (score > bestScore && avgFields >= 2) {
      bestScore = score;
      bestDelimiter = delim;
    }
  }

  // Parse with best delimiter
  return lines.map(line => bestDelimiter === ' '
    ? line.split(/\s+/).filter(cell => cell.length > 0)
    : line.split(bestDelimiter).map(cell => cell.trim())
  );
};


export function PasteDataStep({ rawData, setRawData, hasHeaders, setHasHeaders, onNext, canProceed }: PasteDataStepProps) {
  const [hasPasted, setHasPasted] = useState(false);
  const [delimiter, setDelimiter] = useState<string>('auto');
  const [parsedData, setParsedData] = useState<string[][]>([]);

  // Parse data whenever rawData or delimiter changes
  React.useEffect(() => {
    if (rawData) {
      const detectedDelimiter = delimiter === 'auto' ? undefined : delimiter;
      const parsed = parseTableData(rawData, detectedDelimiter);
      setParsedData(parsed);

      // Convert parsed data back to tab-separated format for downstream compatibility
      const tabSeparated = parsed.map(row => row.join('\t')).join('\n');
      if (tabSeparated !== rawData) {
        setRawData(tabSeparated);
      }
    } else {
      setParsedData([]);
    }
  }, [rawData, delimiter, setRawData]);

  const handlePaste = async () => {
    try {
      let clipboardData = '';

      // Try to get rich content first (HTML from emails/web)
      if (navigator.clipboard.read) {
        try {
          const clipboardItems = await navigator.clipboard.read();
          for (const item of clipboardItems) {
            if (item.types.includes('text/html')) {
              const htmlBlob = await item.getType('text/html');
              const htmlText = await htmlBlob.text();
              clipboardData = htmlText;
              break;
            }
          }
        } catch {
          // Fallback to plain text
        }
      }

      // Fallback to plain text if HTML wasn't available
      if (!clipboardData) {
        clipboardData = await navigator.clipboard.readText();
      }

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

  const delimiterOptions = [
    { value: 'auto', label: 'Auto-detect' },
    { value: '\t', label: 'Tab' },
    { value: ',', label: 'Comma' },
    { value: '|', label: 'Pipe' },
    { value: ';', label: 'Semicolon' },
    { value: ' ', label: 'Space' }
  ];

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

      {/* Smart Paste Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Paste your data:
          </Label>
          <div className="flex items-center gap-2">
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Delimiter" />
              </SelectTrigger>
              <SelectContent>
                {delimiterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Paste
            </Button>
          </div>
        </div>

        {/* Paste Area */}
        {!rawData ? (
          <div
            className="border-2 border-dashed border-border-primary rounded-lg p-8 text-center bg-surface-action-hover-2 cursor-pointer hover:border-surface-action transition-colors"
            onClick={handlePaste}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-text-disabled" />
            <p className="text-sm font-medium text-text-body mb-2">
              Click to paste or drag data here
            </p>
            <p className="text-xs text-text-disabled">
              Supports spreadsheets, email tables, CSV, and more
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Preview */}
            <div className="bg-surface-primary rounded-lg border border-border-primary overflow-hidden">
              <div className="bg-surface-action-hover-2 px-4 py-2 border-b border-border-primary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-text-body" />
                    <span className="text-sm font-medium text-text-body">
                      Parsed Table ({parsedData.length} rows)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRawData('');
                      setParsedData([]);
                      setHasPasted(false);
                    }}
                    className="text-text-disabled hover:text-text-body"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <tbody>
                    {parsedData.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex} className={`border-b border-border-primary last:border-b-0 ${
                        hasHeaders && rowIndex === 0 ? 'bg-surface-action-hover-2 font-medium' : ''
                      }`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 border-r border-border-primary last:border-r-0"
                          >
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <div className="px-3 py-2 text-xs text-text-disabled bg-surface-action-hover-2 text-center border-t border-border-primary">
                    ... and {parsedData.length - 10} more rows
                  </div>
                )}
              </div>
            </div>

            {/* Edit Raw Data (fallback) */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-text-disabled hover:text-text-body">
                Edit raw data manually
              </summary>
              <div className="mt-2">
                <textarea
                  value={rawData}
                  onChange={handleTextareaChange}
                  className="w-full h-32 p-3 border border-border-primary rounded-lg bg-background font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-surface-action focus:border-surface-action"
                  placeholder="Raw data will appear here..."
                />
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Headers Checkbox */}
      {rawData && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-headers"
            checked={hasHeaders}
            onCheckedChange={(checked) => setHasHeaders(checked === true)}
          />
          <Label
            htmlFor="has-headers"
            className="text-sm font-normal cursor-pointer"
          >
            Tick here if your data already has column headings
          </Label>
        </div>
      )}

      {/* Validation */}
      {hasPasted && parsedData.length === 0 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            Could not parse the data. Try adjusting the delimiter or check your data format.
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