interface DataPreviewTableProps {
  headers: string[];
  parsedData: string[][];
  columnMapping: Record<string, string>;
}

export function DataPreviewTable({
  headers,
  parsedData,
  columnMapping,
}: DataPreviewTableProps) {
  // Show only first 5 rows for preview
  const previewData = parsedData.slice(0, 5);

  // Get mapped field names for display
  const getMappedFieldName = (columnIndex: number): string => {
    const fieldName = columnMapping[columnIndex.toString()];
    if (!fieldName) return "Not mapped";

    const fieldLabels: Record<string, string> = {
      "fullName": "Full Name",
      "firstName": "First Name",
      "lastName": "Last Name",
      "phoneNumber": "Phone Number",
      "joinDate": "Join Date",
      "yearOfBirth": "Year of Birth",
      "dateOfBirth": "Date of Birth",
      "age": "Age",
      "birthday": "Birthday",
      "leadType": "Lead Type",
      "gender": "Gender",
      "email": "Email",
      "goals": "Goals",
    };

    return fieldLabels[fieldName] || fieldName;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Data Preview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Here&apos;s how your data will look after import (showing first 5 rows).
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{header}</div>
                      <div className="text-xs">{getMappedFieldName(index)}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm text-foreground"
                    >
                      <div className="max-w-xs truncate" title={cell}>
                        {cell || "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {parsedData.length > 5 && (
        <p className="text-sm text-muted-foreground text-center">
          ... and {parsedData.length - 5} more rows
        </p>
      )}
    </div>
  );
}