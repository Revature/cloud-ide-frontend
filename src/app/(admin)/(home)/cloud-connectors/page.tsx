import CloudConnectorsTable from "@/components/tables/BasicTables/CloudConnectorsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cloud Connectors | Cloud IDE",
  description: "Manage your cloud provider connections",
};

export default function CloudConnectors() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CloudConnectorsTable />
      </div>
    </div>
  );
}