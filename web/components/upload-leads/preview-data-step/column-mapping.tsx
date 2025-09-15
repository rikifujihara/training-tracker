import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const FIELD_OPTIONS = [
  { value: "fullName", label: "Full Name" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "joinDate", label: "Join Date" },
  { value: "yearOfBirth", label: "Year of Birth" },
  { value: "dateOfBirth", label: "Date of Birth" },
  { value: "age", label: "Age" },
  { value: "birthday", label: "Birthday" },
  { value: "leadType", label: "Lead Type" },
  { value: "gender", label: "Gender" },
  { value: "email", label: "Email" },
  { value: "goals", label: "Goals" },
  { value: "", label: "Skip this column" },
];

interface ColumnMappingProps {
  headers: string[];
  columnMapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
}

export function ColumnMapping({
  headers,
  columnMapping,
  onMappingChange,
}: ColumnMappingProps) {
  const handleFieldChange = (columnIndex: string, fieldName: string) => {
    const newMapping = { ...columnMapping };
    if (fieldName === "") {
      // Remove mapping if "Skip this column" is selected
      delete newMapping[columnIndex];
    } else {
      newMapping[columnIndex] = fieldName;
    }
    onMappingChange(newMapping);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Map Your Columns</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us what each column contains so we can import your data correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {headers.map((header, index) => {
          const columnIndex = index.toString();
          const selectedField = columnMapping[columnIndex] || "";

          return (
            <div key={index} className="space-y-2">
              <Label htmlFor={`column-${index}`} className="text-sm font-medium">
                Column {index + 1}: {header}
              </Label>
              <Select
                value={selectedField}
                onValueChange={(value) => handleFieldChange(columnIndex, value)}
              >
                <SelectTrigger>
                  <span>
                    {selectedField
                      ? FIELD_OPTIONS.find((opt) => opt.value === selectedField)?.label
                      : "Select field..."}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </div>
  );
}