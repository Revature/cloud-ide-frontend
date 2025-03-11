import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CloudConnectorsTable from "@/components/tables/BasicTables/CloudConnectorsTable";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cloud Connectors Table",
  description:
    "Cloud Connectors Table",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Task Kanban" />
      <div className="space-y-6">
        <ComponentCard title="Cloud Connectors Table">
          <CloudConnectorsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
