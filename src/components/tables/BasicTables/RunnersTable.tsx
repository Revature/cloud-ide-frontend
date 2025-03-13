"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRunners, Runner, RunnerState } from "@/context/RunnersContext";
import Button from "@/components/ui/button/Button";

const getStateColor = (state: RunnerState) => {
  switch (state) {
    case "active":
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case "ready":
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case "awaiting_client":
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case "starting":
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case "terminated":
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStateLabel = (state: RunnerState) => {
  switch (state) {
    case "active":
      return 'Active';
    case "ready":
      return 'Ready';
    case "awaiting_client":
      return 'Awaiting Client';
    case "starting":
      return 'Starting';
    case "terminated":
      return 'Terminated';
    default:
      return state;
  }
};

const RunnersTable: React.FC = () => {
  const { runners, terminateRunner } = useRunners();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(runners.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleRunners = runners.slice(startIndex, startIndex + itemsPerPage);

  const handleViewRunner = (index: number) => {
    router.push(`/runners/view/${index}`);
  };

  const handleTerminate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click from triggering
    terminateRunner(id);
  };

  const handleConnect = (runner: Runner, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click from triggering
    if (runner.url) {
      // In a real app, this would redirect to the runner URL or open a connection
      window.open(runner.url, '_blank');
    }
  };

  const canConnect = (runner: Runner) => {
    return runner.state === 'active' || runner.state === 'awaiting_client';
  };

  const canTerminate = (runner: Runner) => {
    return runner.state !== 'terminated';
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]">
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60">ID</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60">Image</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60">User</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60">State</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60">Session</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-white/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRunners.map((runner, index) => (
              <tr
                key={runner.id}
                className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  <a 
                    onClick={() => handleViewRunner(startIndex + index)}
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500 cursor-pointer"
                  >
                    {runner.id}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium">{runner.image.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {runner.image.machine.name} ({runner.image.machine.cpu_count} CPU, {runner.image.machine.memory_size} GB)
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {runner.user || "In pool (no user assigned)"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(runner.state)}`}>
                    {getStateLabel(runner.state)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {runner.sessionStart ? (
                    <div>
                      <p>Start: {runner.sessionStart}</p>
                      <p>End: {runner.sessionEnd}</p>
                    </div>
                  ) : (
                    "Not started"
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={(e) => handleConnect(runner, e)}
                      size="sm"
                      variant="secondary"
                      className={canConnect(runner) ? "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30" : ""}
                      disabled={!canConnect(runner)}
                    >
                      Connect
                    </Button>
                    <Button
                      onClick={(e) => handleTerminate(runner.id, e)}
                      size="sm"
                      variant="destructive"
                      disabled={!canTerminate(runner)}
                    >
                      Terminate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleRunners.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No runners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-4 py-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, runners.length)}
              </span>{" "}
              of <span className="font-medium">{runners.length}</span> runners
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnersTable;