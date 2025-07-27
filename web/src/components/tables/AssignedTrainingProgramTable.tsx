"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FullAssignedTrainingProgram } from "@/types/trainingProgram";

const columnHelper = createColumnHelper<FullAssignedTrainingProgram>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue().slice(0, 8),
  }),
  columnHelper.accessor("weeksDuration", {
    header: "Duration (weeks)",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("client", {
    header: "Client",
    cell: (info) => {
      const client = info.getValue();
      return client ? `${client.firstName || ""} ${client.lastName || ""}`.trim() || client.email : "N/A";
    },
  }),
  columnHelper.accessor("trainer", {
    header: "Trainer",
    cell: (info) => {
      const trainer = info.getValue();
      return trainer ? `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() || trainer.email : "N/A";
    },
  }),
  columnHelper.accessor("days", {
    header: "Days",
    cell: (info) => {
      const days = info.getValue();
      return days ? days.length : 0;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit
        </button>
        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    ),
  }),
];

interface AssignedTrainingProgramTableProps {
  data: FullAssignedTrainingProgram[];
  onEdit?: (program: FullAssignedTrainingProgram) => void;
  onDelete?: (id: string) => void;
}

export function AssignedTrainingProgramTable({
  data,
  onEdit,
  onDelete,
}: AssignedTrainingProgramTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No training programs assigned yet.
        </div>
      )}
    </div>
  );
}