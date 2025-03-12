"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useImages } from "@/context/ImagesContext";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Toggle from "@/components/form/input/Toggle";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";

// Define VM type options
type ImageProvider = 'aws' | 'azure' | 'gcp';
type ImageType = 'standard' | 'data_science' | 'devops' | 'image_builder' | 'windows';

// Define the provider options
const cloudProviders = [
  { value: "aws", label: "Amazon Web Services (AWS)" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "gcp", label: "Google Cloud Platform (GCP)" }
];

// Define hardware configuration options
const cpuOptions = [
  { value: "1", label: "1 Core" },
  { value: "2", label: "2 Cores" },
  { value: "4", label: "4 Cores" },
  { value: "8", label: "8 Cores" },
  { value: "16", label: "16 Cores" }
];

const memoryOptions = [
  { value: "2", label: "2 GB" },
  { value: "4", label: "4 GB" },
  { value: "8", label: "8 GB" },
  { value: "16", label: "16 GB" },
  { value: "32", label: "32 GB" },
  { value: "64", label: "64 GB" }
];

const storageOptions = [
  { value: "20", label: "20 GB" },
  { value: "50", label: "50 GB" },
  { value: "100", label: "100 GB" },
  { value: "200", label: "200 GB" },
  { value: "500", label: "500 GB" }
];

// Define types for each provider
const imageTypes: Record<ImageProvider, { value: ImageType, label: string }[]> = {
  aws: [
    { value: "standard", label: "Standard Development" },
    { value: "data_science", label: "Data Science" },
    { value: "devops", label: "DevOps Toolchain" },
    { value: "image_builder", label: "Image Builder" }
  ],
  azure: [
    { value: "standard", label: "Standard Development" },
    { value: "windows", label: "Windows Development" },
    { value: "data_science", label: "Data Science" }
  ],
  gcp: [
    { value: "standard", label: "Standard Development" },
    { value: "data_science", label: "Data Science" },
    { value: "devops", label: "DevOps Toolchain" }
  ]
};

// Define OS versions for each provider
const osVersions: Record<ImageProvider, { value: string, label: string }[]> = {
  aws: [
    { value: "Ubuntu 22.04 LTS", label: "Ubuntu 22.04 LTS" },
    { value: "Ubuntu 20.04 LTS", label: "Ubuntu 20.04 LTS" },
    { value: "Amazon Linux 2", label: "Amazon Linux 2" },
    { value: "Red Hat Enterprise Linux 9", label: "Red Hat Enterprise Linux 9" }
  ],
  azure: [
    { value: "Ubuntu 22.04 LTS", label: "Ubuntu 22.04 LTS" },
    { value: "Windows Server 2022", label: "Windows Server 2022" },
    { value: "Windows 11", label: "Windows 11" },
    { value: "CentOS 8", label: "CentOS 8" }
  ],
  gcp: [
    { value: "Ubuntu 22.04 LTS", label: "Ubuntu 22.04 LTS" },
    { value: "Ubuntu 20.04 LTS", label: "Ubuntu 20.04 LTS" },
    { value: "Debian 11", label: "Debian 11" },
    { value: "Alpine Linux 3.18", label: "Alpine Linux 3.18" }
  ]
};

// Define the shape of the data being submitted
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

interface ImageFormProps {
  onSubmit?: (data: ImageFormData) => void;
  onCancel: () => void;
}

const ImageForm: React.FC<ImageFormProps> = ({ onSubmit, onCancel }) => {
  const { addImage } = useImages();
  const router = useRouter();
  const [active, setActive] = useState(true);

  // State for form data with default values
  const [selectedProvider, setSelectedProvider] = useState<ImageProvider>("aws");
  const [selectedOsVersion, setSelectedOsVersion] = useState(osVersions.aws[0].value);
  const [selectedType, setSelectedType] = useState<ImageType>("standard");
  const [selectedCpu, setSelectedCpu] = useState("2");
  const [selectedMemory, setSelectedMemory] = useState("4");
  const [selectedStorage, setSelectedStorage] = useState("50");
  const [poolSize, setPoolSize] = useState(3);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const handleProviderChange = (value: string) => {
    const provider = value as ImageProvider;
    setSelectedProvider(provider);
    setSelectedOsVersion(osVersions[provider][0].value);
    setSelectedType("standard");
  };

  // Create a manual form submission handler
  const manualSubmit = () => {
    console.log("Manual form submission");
    
    // Create new image object using state values
    const newImage: ImageFormData = {
      name: name,
      osVersion: selectedOsVersion,
      provider: selectedProvider.toUpperCase(),
      type: selectedType,
      poolSize: poolSize,
      active: active,
      description: description,
      configuration: {
        cpu: parseInt(selectedCpu),
        memory: parseInt(selectedMemory),
        storage: parseInt(selectedStorage)
      }
    };
    
    console.log("Submitting new image:", newImage);
    
    // Add the image using context
    addImage(newImage);
    
    // Call optional onSubmit prop
    if (onSubmit) {
      onSubmit(newImage);
    }
    
    // Navigate back to images list
    router.push('/images');
  };

  // This will be called by the Form component
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // The default prevention is handled by the Form component
    console.log("Form onSubmit called");
    manualSubmit();
    console.log(e);
  };

  return (
    <div className="container mx-auto">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information Section */}
          <div className="col-span-full mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
              Basic Information
            </h2>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              General information about the VM image
            </div>
          </div>

          {/* Image Name */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="name">Image Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Ubuntu Developer"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Cloud Provider */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="provider">Cloud Provider</Label>
            <Select
              options={cloudProviders}
              defaultValue={selectedProvider}
              onChange={handleProviderChange}
            />
          </div>

          {/* OS Version */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="osVersion">OS Version</Label>
            <Select
              options={osVersions[selectedProvider]}
              defaultValue={selectedOsVersion}
              onChange={(value) => setSelectedOsVersion(value)}
            />
          </div>

          {/* Image Type */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="type">Image Type</Label>
            <Select
              options={imageTypes[selectedProvider]}
              defaultValue={selectedType}
              onChange={(value) => setSelectedType(value as ImageType)}
            />
          </div>

          {/* Pool Size */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="poolSize">Pool Size</Label>
            <Input
              id="poolSize"
              name="poolSize"
              type="number"
              placeholder="Number of pre-provisioned VMs"
              defaultValue={poolSize.toString()}
              onChange={(e) => setPoolSize(parseInt(e.target.value) || 0)}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Number of ready VMs to maintain in the pool
            </div>
          </div>

          {/* Active/Inactive Toggle */}
          <div className="col-span-full md:col-span-1">
            <Label>Status</Label>
            <div className="flex items-center gap-3 mt-2">
              <Toggle enabled={active} setEnabled={setActive} />
              <Label className="mb-0">
                {active ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-full">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Description of the image and its purpose"
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
              className="dark:bg-dark-900 h-24 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          {/* Hardware Configuration Section */}
          <div className="col-span-full mb-4 mt-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
              Hardware Configuration
            </h2>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Resource specifications for VM instances
            </div>
          </div>

          {/* CPU Cores */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="cpu">CPU Cores</Label>
            <Select
              options={cpuOptions}
              defaultValue={selectedCpu}
              onChange={(value) => setSelectedCpu(value)}
            />
          </div>

          {/* Memory */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="memory">Memory (GB)</Label>
            <Select
              options={memoryOptions}
              defaultValue={selectedMemory}
              onChange={(value) => setSelectedMemory(value)}
            />
          </div>

          {/* Storage */}
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="storage">Storage (GB)</Label>
            <Select
              options={storageOptions}
              defaultValue={selectedStorage}
              onChange={(value) => setSelectedStorage(value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {/* Use a regular button that manually triggers the form submission */}
          <Button 
            size="sm" 
            variant="primary" 
          >
            Create Image
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ImageForm;