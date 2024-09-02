import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

const Users = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const pageSize = 10;

  const { isLoading, error, data } = useQuery({
    queryKey: ["userdata", pageIndex, pageSize],
    queryFn: async () => {
      const response = await axios.get("https://dummyjson.com/users", {
        params: {
          limit: pageSize,
          skip: pageIndex * pageSize,
        },
      });
      setTotalCount(response.data.total);
      return response.data.users;
    },
  });

  const columns: ColumnDef<User>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "First Name",
      accessorKey: "firstName",
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
    },
    {
      header: "Age",
      accessorKey: "age",
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  if (error) {
    return (
      <h1 style={{ textAlign: "center", color: "red" }}>Page not found</h1>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Users List</h1>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      <table
        style={{
          width: "50%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "10px",
                    backgroundColor: "#f4f4f4",
                    cursor: "pointer",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pageIndex + 1} of {Math.ceil(totalCount / pageSize)}
        </span>
        <button
          onClick={() =>
            setPageIndex((prev) =>
              Math.min(prev + 1, Math.ceil(totalCount / pageSize) - 1)
            )
          }
          disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Users;
