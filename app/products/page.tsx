"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: number;
  product_name: string;
  stock: number;
  description: string;
};

const columnHelper = createColumnHelper<Product>();

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const getProducts = async () => {
      const { data } = await supabase.from("products").select("*");

      if (data == null) {
        throw "data fetching error";
      }

      setProducts(data);

      const initialQuantities: { [key: number]: number } = {};
      data.forEach((product: Product) => {
        initialQuantities[product.id] = 0;
      });
      setQuantities(initialQuantities);
    };

    getProducts();
  }, []);

  const columns = [
    columnHelper.accessor("product_name", {
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
          value={quantities[info.getValue() || 0]}
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
      header: "Add To Checkout",
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
        pageSize: 8,
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
};

export default page;
