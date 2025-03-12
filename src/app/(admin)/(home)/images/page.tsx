import { Metadata } from "next";
import React from "react";
import ImagesTable from "@/components/tables/BasicTables/ImagesTable";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";

export const metadata: Metadata = {
  title: "Cloud Connectors | Cloud IDE",
  description: "Manage your cloud provider connections",
};

export default function CloudConnectors() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cloud Connectors" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} variant="withIcon" />
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ImagesTable />
        </div>
      </div>
    </div>
  );
}