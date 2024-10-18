"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";

type Product = {
  id: number;
  name: string;
  stock: number;
  description: string;
};

let Products: Product[];

const getProducts = async () => {
  const { data } = await supabase.from("products").select("*");

  if (data == null) {
    throw "bad";
  }

  console.log("working");
  Products = data;
};

getProducts();

const initialProducts: Product[] = [
  { id: 1, name: "Widget A", stock: 50, description: "A high-quality widget" },
  { id: 2, name: "Gadget B", stock: 30, description: "An innovative gadget" },
  {
    id: 3,
    name: "Doohickey C",
    stock: 20,
    description: "A versatile doohickey",
  },
  {
    id: 4,
    name: "Thingamajig D",
    stock: 40,
    description: "A robust thingamajig",
  },
  {
    id: 5,
    name: "Whatchamacallit E",
    stock: 25,
    description: "An efficient whatchamacallit",
  },
  {
    id: 6,
    name: "Whatchamacallit E",
    stock: 25,
    description: "An efficient whatchamacallit",
  },
  // Add more products as needed
];

const columnHelper = createColumnHelper<Product>();

export function Page() {
  // const getProducts = () => {
  //   const res = await fetch("api/products", {
  //     method: "GET",
  //   });
  // };

  const [products, setProducts] = useState(initialProducts);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const columns = [
    columnHelper.accessor("name", {
      header: "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("stock", {
      header: "Available Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "Desired Quantity",
      cell: (info) => (
        <Input
          type="number"
          min="0"
          max={info.row.original.stock}
          value={quantities[info.getValue()] || 0}
          onChange={(e) => {
            const value = Math.min(
              Number(e.target.value),
              info.row.original.stock
            );
            setQuantities((prev) => ({ ...prev, [info.getValue()]: value }));
          }}
          className="w-20"
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: "Action",
      cell: (info) => (
        <Button
          onClick={() => addToCheckout(info.getValue())}
          disabled={
            !quantities[info.getValue()] || quantities[info.getValue()] === 0
          }
        >
          Add to Checkout
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const addToCheckout = (productId: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, stock: product.stock - quantity }
            : product
        )
      );
      setQuantities((prev) => ({ ...prev, [productId]: 0 }));
      // In a real app, you'd also update the checkout state here
      console.log(`Added ${quantity} of product ${productId} to checkout`);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
