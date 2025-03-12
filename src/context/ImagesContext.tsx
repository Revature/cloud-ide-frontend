"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the data being submitted in forms
export interface ImageFormData {
  name: string;
  osVersion: string;
  provider: string;
  type: string;
  poolSize: number;
  active: boolean;
  description: string;
  configuration: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

// Define the interface for VM Image
export interface VMImage {
  icon: string;
  name: string;
  osVersion: string;
  provider: string;
  type: string;
  poolSize: number;
  active: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  // Add configuration fields
  configuration: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

// Define a separate interface for new images
export interface NewVMImage {
  name: string;
  osVersion: string;
  provider: string;
  type: string;
  poolSize: number;
  description: string;
  configuration: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

// Initial data with sample images
const initialImages: VMImage[] = [
  {
    icon: "/icons/ubuntu.svg",
    name: "Ubuntu Developer",
    osVersion: "Ubuntu 22.04 LTS",
    provider: "AWS",
    type: "standard",
    poolSize: 5,
    active: true,
    description: "Standard Ubuntu development environment with common development tools",
    createdAt: "Jan 15, 2025",
    updatedAt: "Feb 20, 2025",
    configuration: {
      cpu: 2,
      memory: 4,
      storage: 50
    }
  },
  {
    icon: "/icons/jupyter.svg",
    name: "Data Science Workbench",
    osVersion: "Ubuntu 22.04 LTS",
    provider: "AWS",
    type: "data_science",
    poolSize: 2,
    active: true,
    description: "Data science environment with Python, R, and Jupyter",
    createdAt: "Jan 20, 2025",
    updatedAt: "Feb 25, 2025",
    configuration: {
      cpu: 4,
      memory: 16,
      storage: 100
    }
  },
  {
    icon: "/icons/windows.svg",
    name: "Windows Development",
    osVersion: "Windows Server 2022",
    provider: "Azure",
    type: "windows",
    poolSize: 3,
    active: false,
    description: "Windows development environment with Visual Studio",
    createdAt: "Feb 01, 2025",
    updatedAt: "Feb 28, 2025",
    configuration: {
      cpu: 4,
      memory: 8,
      storage: 80
    }
  },
  {
    icon: "/icons/builder.svg",
    name: "Image Builder",
    osVersion: "Ubuntu 20.04 LTS",
    provider: "AWS",
    type: "image_builder",
    poolSize: 1,
    active: true,
    description: "Environment for building and customizing other VM images",
    createdAt: "Jan 10, 2025",
    updatedAt: "Feb 10, 2025",
    configuration: {
      cpu: 2,
      memory: 4,
      storage: 100
    }
  },
  {
    icon: "/icons/golang.svg",
    name: "Go Development",
    osVersion: "Alpine Linux 3.18",
    provider: "GCP",
    type: "standard",
    poolSize: 3,
    active: true,
    description: "Lightweight Go development environment",
    createdAt: "Feb 15, 2025",
    updatedAt: "Mar 01, 2025",
    configuration: {
      cpu: 2,
      memory: 4,
      storage: 40
    }
  },
  {
    icon: "/icons/devops.svg",
    name: "DevOps Toolchain",
    osVersion: "Ubuntu 22.04 LTS",
    provider: "AWS",
    type: "devops",
    poolSize: 2,
    active: true,
    description: "Environment with Docker, Kubernetes, Terraform, and CI/CD tools",
    createdAt: "Feb 20, 2025",
    updatedAt: "Mar 05, 2025",
    configuration: {
      cpu: 4,
      memory: 8,
      storage: 80
    }
  }
];

// Create context with default values
interface ImagesContextType {
  images: VMImage[];
  addImage: (image: NewVMImage) => void;
  updateImageStatus: (index: number, active: boolean) => void;
  updateImage: (index: number, updatedData: Partial<VMImage>) => void;
  getImageById: (index: number) => VMImage | undefined;
}

const ImagesContext = createContext<ImagesContextType>({
  images: initialImages,
  addImage: () => {},
  updateImageStatus: () => {},
  updateImage: () => {},
  getImageById: () => undefined
});

// Provider component
interface ImagesProviderProps {
  children: ReactNode;
}

export const ImagesProvider: React.FC<ImagesProviderProps> = ({ children }) => {
  const [images, setImages] = useState<VMImage[]>(initialImages);

  const addImage = (image: NewVMImage) => {
    // Map provider names to their icon paths
    const providerIcons: Record<string, string> = {
      aws: "/icons/aws.svg",
      azure: "/icons/azure.svg",
      gcp: "/icons/gcp.svg"
    };

    // Determine icon based on OS
    const getIcon = (osVersion: string, type: string) => {
      if (osVersion.toLowerCase().includes('ubuntu')) return "/icons/ubuntu.svg";
      if (osVersion.toLowerCase().includes('alpine')) return "/icons/alpine.svg";
      if (osVersion.toLowerCase().includes('windows')) return "/icons/windows.svg";
      if (type === 'data_science') return "/icons/jupyter.svg";
      if (type === 'image_builder') return "/icons/builder.svg";
      if (type === 'devops') return "/icons/devops.svg";
      return "/icons/vm.svg"; // default
    };

    const newImage: VMImage = {
      icon: getIcon(image.osVersion, image.type),
      name: image.name,
      osVersion: image.osVersion,
      provider: image.provider,
      type: image.type,
      poolSize: image.poolSize,
      active: true,
      description: image.description,
      createdAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      updatedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      configuration: {
        cpu: image.configuration.cpu,
        memory: image.configuration.memory,
        storage: image.configuration.storage
      }
    };

    setImages(prev => [...prev, newImage]);
  };

  const updateImageStatus = (index: number, active: boolean) => {
    setImages(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { 
          ...updated[index], 
          active,
          updatedAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      }
      return updated;
    });
  };
  
  // Add function to update multiple properties of an image
  const updateImage = (index: number, updatedData: Partial<VMImage>) => {
    setImages(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { 
          ...updated[index], 
          ...updatedData,
          updatedAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      }
      return updated;
    });
  };

  // Get image by index
  const getImageById = (index: number): VMImage | undefined => {
    return images[index];
  };

  return (
    <ImagesContext.Provider value={{ 
      images, 
      addImage, 
      updateImageStatus,
      updateImage,
      getImageById
    }}>
      {children}
    </ImagesContext.Provider>
  );
};

// Custom hook for using the context
export const useImages = () => useContext(ImagesContext);