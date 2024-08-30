import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
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
  const [users, setUsers] = useState<User[]>([]);

  const { isLoading, error } = useQuery({
    queryKey: ["userdata"],
    queryFn: async () => {
      const response = await axios.get("https://dummyjson.com/users");
      setUsers(response.data.users);
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
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Page not found</h1>;
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Users List</h1>
      <table style={{ width: "50%", borderCollapse: "collapse", border:'1px solid black',marginRight:'auto',marginLeft:'auto'}}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{border:'1px solid black'}}>
                  {header.column.columnDef.header as React.ReactNode}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}style={{border:'1px solid black'}}>{cell.getValue() as React.ReactNode}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
