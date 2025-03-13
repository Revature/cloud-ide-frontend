"use client";
import React from "react";
import { useRouter } from "next/navigation";
import RunnersTable from "@/components/tables/BasicTables/RunnersTable";
import Button from "@/components/ui/button/Button";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb";

export default function RunnersPage() {
  const router = useRouter();
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Runners" }
  ];
  
  const handleAddRunner = () => {
    router.push("/runners/add");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb items={breadcrumbItems} variant="withIcon" />
        </div>
        <Button 
          size="sm" 
          variant="primary" 
          onClick={handleAddRunner}
        >
          Add Runner
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Runners
              </h1>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 8L20 4M20 4L16 0M20 4V8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 16L4 20M4 20L8 24M4 20V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
            <RunnersTable />
          </div>
        </div>
      </div>
    </div>
  );
}