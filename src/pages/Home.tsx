import React, { useEffect } from "react";
import "../App.css";
import { Guest, Invitation, getAllInvitations } from "../api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

const partecipantsColumnHelper = createColumnHelper<Guest>();

const partecipantsColumns = [
  partecipantsColumnHelper.display({
    header: "#",
    cell: (info) => info.row.index + 1,
    footer: (info) => info.column.id,
  }),
  partecipantsColumnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  partecipantsColumnHelper.accessor("menu", {
    header: "Menu",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  partecipantsColumnHelper.accessor("notes", {
    header: "Note",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];
const invitationsColumnHelper = createColumnHelper<Invitation>();

const invitationsColumns = [
  invitationsColumnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  invitationsColumnHelper.accessor("can_add", {
    header: "Può aggiungere invitati",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  invitationsColumnHelper.accessor("contact", {
    header: "Contatto",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  invitationsColumnHelper.accessor("partecipation", {
    header: "Partecipazione",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  invitationsColumnHelper.group({
    id: "partecipants",
    header: () => <span>Invitati</span>,
    columns: [
      invitationsColumnHelper.accessor("partecipants.name", {
        header: "Nome",
        cell: ({ row }) =>
          row.original.partecipants.map((p, i) => (
            <>
              <span key={i}>{p.name}</span>
              <br />
            </>
          )),
        footer: (info) => info.column.id,
      }),
      invitationsColumnHelper.accessor("partecipants.menu", {
        header: "Menu",
        cell: ({ row }) =>
          row.original.partecipants.map((p, i) => (
            <>
              <span key={i}>{p.menu}</span>
              <br />
            </>
          )),
        footer: (info) => info.column.id,
      }),
      invitationsColumnHelper.accessor("partecipants.notes", {
        header: "Note",
        cell: ({ row }) =>
          row.original.partecipants.map((p, i) => (
            <>
              <span key={i}>{p.notes}</span>
              <br />
            </>
          )),
        footer: (info) => info.column.id,
      }),
    ],
  }),
  invitationsColumnHelper.display({
    header: "Link",
    cell: (info) => (
      <a href={`https://bandinotofani.it/invitation/${info.row.original.id}`}>
        Link
      </a>
    ),
  }),
  invitationsColumnHelper.display({
    header: "Azione",
    cell: (info) => <Link to={`/${info.row.original.id}`}>Modifica</Link>,
  }),
];
type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
};

const TableComponent = <T,>({ table }: TableComponentProps<T>) => (
  <table>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} colSpan={header.colSpan}>
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
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

function Home() {
  const [invitations, setInvitations] = React.useState<Invitation[]>([]);
  const [partecipants, setPartecipants] = React.useState<Guest[]>([]);
  const [viewPartecipants, setViewPartecipants] =
    React.useState<boolean>(false);

  useEffect(() => {
    getAllInvitations()
      .then((i) => {
        setInvitations(i);
        const accepted = i.filter((i) => i.partecipation === "Y");
        setPartecipants(accepted.flatMap((i) => i.partecipants));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const invitationsTable = useReactTable({
    data: invitations,
    columns: invitationsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const partecipantsTable = useReactTable({
    data: partecipants,
    columns: partecipantsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setViewPartecipants((v) => !v);
        }}
      >
        {viewPartecipants ? "Vedi inviti" : "Vedi partecipanti"}
      </button>
      {viewPartecipants ? (
        <TableComponent table={partecipantsTable} />
      ) : (
        <TableComponent table={invitationsTable} />
      )}
    </div>
  );
}

export default Home;
