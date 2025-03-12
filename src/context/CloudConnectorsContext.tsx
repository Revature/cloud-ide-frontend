"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the interface for cloud connector
export interface CloudConnector {
  image: string;
  name: string;
  added: string;
  region: string;
  type: string;
  active: boolean;
}

// Initial data
const initialConnectors: CloudConnector[] = [
  {
    image: "/images/brand/aws-logo.svg", 
    name: "AWS", 
    added: "Jan 15, 2025", 
    region: "us-west-2",
    type: "EC2",
    active: true,
  },
  {
    image: "/images/brand/azure-logo.svg",
    name: "Azure", 
    added: "Feb 02, 2025", 
    region: "West US 2",
    type: "VM",
    active: true,
  },
  {
    image: "/images/brand/gcp-logo.svg",
    name: "GCP", 
    added: "Jan 28, 2025", 
    region: "us-central1",
    type: "Compute Engine",
    active: true,
  },
  {
    image: "/images/brand/digitalocean-logo.svg",
    name: "DigitalOcean", 
    added: "Mar 05, 2025", 
    region: "NYC1",
    type: "Droplet",
    active: false,
  }
];

// Create context with default values
interface CloudConnectorsContextType {
  connectors: CloudConnector[];
  addConnector: (connector: Partial<CloudConnector>) => void;
  updateConnectorStatus: (index: number, active: boolean) => void;
}

const CloudConnectorsContext = createContext<CloudConnectorsContextType>({
  connectors: initialConnectors,
  addConnector: () => {},
  updateConnectorStatus: () => {},
});

// Provider component
interface CloudConnectorsProviderProps {
  children: ReactNode;
}

export const CloudConnectorsProvider: React.FC<CloudConnectorsProviderProps> = ({ children }) => {
  const [connectors, setConnectors] = useState<CloudConnector[]>(initialConnectors);

  const addConnector = (connector: Partial<CloudConnector>) => {
    // Map provider names to their image paths
    const providerImages: Record<string, string> = {
      aws: "/images/brand/aws-logo.svg",
      azure: "/images/brand/azure-logo.svg",
      gcp: "/images/brand/gcp-logo.svg",
    };

    // Map provider values to display names
    const providerNames: Record<string, string> = {
      aws: "AWS",
      azure: "Azure",
      gcp: "GCP",
    };

    const newConnector: CloudConnector = {
      image: providerImages[connector.provider as string] || "/images/brand/cloud-generic.svg",
      name: providerNames[connector.provider as string] || connector.provider as string,
      added: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      region: connector.region as string,
      type: connector.type as string,
      active: connector.status || false,
    };

    setConnectors(prev => [...prev, newConnector]);
  };

  const updateConnectorStatus = (index: number, active: boolean) => {
    setConnectors(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], active };
      }
      return updated;
    });
  };

  return (
    <CloudConnectorsContext.Provider value={{ connectors, addConnector, updateConnectorStatus }}>
      {children}
    </CloudConnectorsContext.Provider>
  );
};

// Custom hook for using the context
export const useCloudConnectors = () => useContext(CloudConnectorsContext);