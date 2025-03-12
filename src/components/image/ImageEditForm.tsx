"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useImages } from "@/context/ImagesContext";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Toggle from "@/components/form/input/Toggle";

// Define VM type options
type ImageProvider = 'aws' | 'azure' | 'gcp';
type ImageType = 'standard' | 'data_science' | 'devops' | 'image_builder' | 'windows';

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

const EditImageForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { images, updateImage } = useImages();
  const imageIndex = parseInt(params.id as string, 10);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    provider: "aws" as ImageProvider,
    osVersion: "",
    type: "standard" as ImageType,
    poolSize: 0,
    description: "",
    active: true,
    cpu: "2",
    memory: "4",
    storage: "50"
  });
  
  // Load image data
  useEffect(() => {
    if (!isNaN(imageIndex) && images[imageIndex]) {
      const image = images[imageIndex];
      
      // Convert provider name to lowercase for type safety
      const providerKey = image.provider.toLowerCase() as ImageProvider;
      
      setFormData({
        name: image.name,
        provider: providerKey,
        osVersion: image.osVersion,
        type: image.type as ImageType,
        poolSize: image.poolSize,
        description: image.description || "",
        active: image.active,
        cpu: image.configuration.cpu.toString(),
        memory: image.configuration.memory.toString(),
        storage: image.configuration.storage.toString()
      });
    } else {
      // Handle invalid index
      router.push('/images');
    }
  }, [imageIndex, images, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Update the image with the form data
    updateImage(imageIndex, {
      name: formData.name,
      osVersion: formData.osVersion,
      provider: formData.provider.charAt(0).toUpperCase() + formData.provider.slice(1), // Capitalize provider name
      type: formData.type,
      poolSize: parseInt(formData.poolSize.toString()),
      description: formData.description,
      active: formData.active,
      configuration: {
        cpu: parseInt(formData.cpu),
        memory: parseInt(formData.memory),
        storage: parseInt(formData.storage)
      }
    });
    
    router.push('/images');
  };

  const handleToggleChange = (enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      active: enabled
    }));
  };

  const goBack = () => {
    router.push('/images');
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goBack}
          className="mr-4"
        >
          <svg
            className="w-4 h-4 mr-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Image</h2>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/[0.05] p-6">
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information Section */}
            <div className="col-span-full mb-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
                Basic Information
              </h2>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                General information about the image
              </div>
            </div>

            {/* Image Name */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="name">Image Name</Label>
              <Input
                name="name"
                defaultValue={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Cloud Provider (disabled in edit mode) */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="provider">Cloud Provider</Label>
              <Select
                defaultValue={formData.provider}
                options={[
                  { value: "aws", label: "AWS" },
                  { value: "azure", label: "Azure" },
                  { value: "gcp", label: "GCP" }
                ]}
                onChange={(value) => {
                  const provider = value as ImageProvider;
                  setFormData(prev => ({ 
                    ...prev, 
                    provider: provider,
                    type: imageTypes[provider][0].value,
                    osVersion: osVersions[provider][0].value
                  }));
                }}
                // Note: disabled property needs to be implemented in your Select component
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Cloud provider cannot be changed after creation
              </div>
            </div>

            {/* OS Version */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="osVersion">OS Version</Label>
              <Select
                defaultValue={formData.osVersion}
                options={osVersions[formData.provider]}
                onChange={(value) => setFormData(prev => ({ ...prev, osVersion: value }))}
              />
            </div>

            {/* Image Type */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="type">Image Type</Label>
              <Select
                defaultValue={formData.type}
                options={imageTypes[formData.provider]}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value as ImageType }))}
              />
            </div>

            {/* Pool Size */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="poolSize">Pool Size</Label>
              <Input
                name="poolSize"
                type="number"
                defaultValue={formData.poolSize.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData(prev => ({ ...prev, poolSize: parseInt(e.target.value) || 0 }))}
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Number of ready VMs to maintain in the pool
              </div>
            </div>

            {/* Active/Inactive Toggle */}
            <div className="col-span-full md:col-span-1">
              <Label>Status</Label>
              <div className="flex items-center gap-3 mt-2">
                <Toggle enabled={formData.active} setEnabled={handleToggleChange} />
                <Label className="mb-0">
                  {formData.active ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-full">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                defaultValue={formData.cpu}
                options={cpuOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, cpu: value }))}
              />
            </div>

            {/* Memory */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="memory">Memory (GB)</Label>
              <Select
                defaultValue={formData.memory}
                options={memoryOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, memory: value }))}
              />
            </div>

            {/* Storage */}
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="storage">Storage (GB)</Label>
              <Select
                defaultValue={formData.storage}
                options={storageOptions}
                onChange={(value) => setFormData(prev => ({ ...prev, storage: value }))}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={goBack}>
              Cancel
            </Button>
            <Button size="sm" variant="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditImageForm;