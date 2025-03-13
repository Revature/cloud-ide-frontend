// src/components/image/ImageFormWithTerminal.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DynamicTerminal } from "@/hooks/useXterm";

// Define your machine type interface
interface Machine {
  identifier: string;
  name: string;
  cpu_count: number;
  memory_size: number;
  storage_size: number;
}

// Define your cloud connector interface
interface CloudConnector {
  name: string;
  image: string;
  region: string;
  type: string;
  active: boolean;
}

// Define the shape of the data being submitted
export interface ImageFormData {
  name: string;
  description: string;
  machine: Machine;
  active: boolean;
  cloudConnector?: CloudConnector;
}

interface ImageFormWithTerminalProps {
  onSubmit?: (data: ImageFormData) => void;
  onCancel: () => void;
  machineTypes: Machine[];
  cloudConnectors: CloudConnector[];
  addImage: (image: ImageFormData) => void;
}

const ImageFormWithTerminal: React.FC<ImageFormWithTerminalProps> = ({ 
  onSubmit, 
  onCancel, 
  machineTypes, 
  cloudConnectors, 
  addImage 
}) => {
  const router = useRouter();
  const [active, setActive] = useState(true);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalCommandsCompleted, setTerminalCommandsCompleted] = useState(false);

  // Form data state
  const [selectedMachine, setSelectedMachine] = useState(
    machineTypes.length > 0 ? machineTypes[1].identifier : ""
  );
  const [selectedConnector, setSelectedConnector] = useState(
    cloudConnectors.filter(c => c.active).length > 0 
      ? cloudConnectors.filter(c => c.active)[0].name 
      : ""
  );
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  // Helper functions to get selected objects
  const getSelectedMachineObject = (): Machine => {
    return machineTypes.find(m => m.identifier === selectedMachine) || machineTypes[0];
  };

  const getSelectedConnectorObject = (): CloudConnector | undefined => {
    return cloudConnectors.find(c => c.name === selectedConnector);
  };

  // Function to simulate command execution in the terminal
  const simulateTerminalCommands = async () => {
    const selectedConnector = getSelectedConnectorObject();
    const machine = getSelectedMachineObject();
    
    // Clear previous logs
    setTerminalLogs([]);
    setTerminalCommandsCompleted(false);
    
    // Initial setup
    setTerminalLogs(prev => [...prev, `Welcome to Cloud IDE Image Builder`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTerminalLogs(prev => [...prev, `Terminal session started at ${new Date().toLocaleString()}`]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTerminalLogs(prev => [...prev, `$ cd ~/image-builder`]);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Start the image creation process
    setTerminalLogs(prev => [...prev, `$ ./create-image.sh --name="${name}" --provider="${selectedConnector?.name || 'unknown'}" --region="${selectedConnector?.region || 'unknown'}" --type="${selectedConnector?.type || 'unknown'}"`]);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Authentication and connection
    setTerminalLogs(prev => [...prev, `[INFO] Authenticating with ${selectedConnector?.name || 'cloud provider'}...`]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTerminalLogs(prev => [...prev, `[INFO] Using credentials from secure vault`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTerminalLogs(prev => [...prev, `[INFO] Connection established to ${selectedConnector?.region || 'unknown'} region`]);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Resource validation
    setTerminalLogs(prev => [...prev, `$ ./validate-resources.sh --cpu=${machine.cpu_count} --memory=${machine.memory_size} --storage=${machine.storage_size}`]);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setTerminalLogs(prev => [...prev, `[INFO] CPU: ${machine.cpu_count} core${machine.cpu_count > 1 ? 's' : ''} - VALIDATED`]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalLogs(prev => [...prev, `[INFO] Memory: ${machine.memory_size}GB - VALIDATED`]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalLogs(prev => [...prev, `[INFO] Storage: ${machine.storage_size}GB - VALIDATED`]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalLogs(prev => [...prev, `[INFO] Resource validation complete. Proceeding with image creation.`]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Base image setup
    setTerminalLogs(prev => [...prev, `$ sudo ./setup-base-image.sh`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTerminalLogs(prev => [...prev, `[INFO] Downloading base image template...`]);
    
    // Progress simulation for download
    for (let i = 0; i <= 100; i += 10) {
      setTerminalLogs(prev => [...prev, `Progress: ${i}% - Downloading base image`]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // System dependencies
    setTerminalLogs(prev => [...prev, `[INFO] Base image downloaded successfully`]);
    await new Promise(resolve => setTimeout(resolve, 600));
    setTerminalLogs(prev => [...prev, `$ sudo apt-get update && sudo apt-get install -y build-essential git curl wget`]);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show some package installation logs
    const packages = [
      'build-essential', 'git', 'curl', 'wget', 'python3', 'python3-pip', 
      'nodejs', 'npm', 'docker.io', 'java-11-openjdk'
    ];
    
    for (const pkg of packages) {
      setTerminalLogs(prev => [...prev, `[INFO] Installing ${pkg}...`]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setTerminalLogs(prev => [...prev, `[INFO] All system dependencies installed successfully`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Configuration progress
    setTerminalLogs(prev => [...prev, `$ ./configure-environment.sh --ide=code-server --start-on-boot=true`]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Progress for configuration
    for (let i = 0; i <= 100; i += 20) {
      setTerminalLogs(prev => [...prev, `Progress: ${i}% - Configuring environment`]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Final steps
    setTerminalLogs(prev => [...prev, `[INFO] Environment configuration completed`]);
    await new Promise(resolve => setTimeout(resolve, 600));
    setTerminalLogs(prev => [...prev, `$ ./finalize-image.sh --name="${name}" --description="${description || 'No description provided'}"`]);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setTerminalLogs(prev => [...prev, `[SUCCESS] Image configuration completed successfully!`]);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTerminalLogs(prev => [...prev, `[INFO] Image "${name}" is ready to be created`]);
    await new Promise(resolve => setTimeout(resolve, 600));
    setTerminalLogs(prev => [...prev, `[INFO] Click 'Create Image' to finalize and save to your ${selectedConnector?.name || 'cloud'} account`]);
    
    // Mark commands as completed
    setTerminalCommandsCompleted(true);
  };

  // This will be called after validating the form on step 1
  const handleContinueToTerminal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!name || (!selectedConnector && cloudConnectors.filter(c => c.active).length > 0)) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Move to terminal step
    setCurrentStep(2);
    
    // Start terminal simulation after a brief delay
    setTimeout(() => {
      simulateTerminalCommands();
    }, 500);
  };

  // Final submission after terminal preview
  const handleFinalSubmit = () => {
    // Create new image object using state values
    const newImage: ImageFormData = {
      name: name,
      description: description,
      machine: getSelectedMachineObject(),
      active: active,
      cloudConnector: getSelectedConnectorObject()
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

  // Go back to the form step
  const handleBackToForm = () => {
    setCurrentStep(1);
  };

  // Get the current machine details for display
  const currentMachine = getSelectedMachineObject();

  // Create options for select components
  const machineOptions = machineTypes.map(machine => ({
    value: machine.identifier,
    label: `${machine.name} (${machine.cpu_count} CPU, ${machine.memory_size} GB RAM, ${machine.storage_size} GB Storage)`
  }));

  // Create options for cloud connectors dropdown
  const cloudConnectorOptions = cloudConnectors
    .filter(connector => connector.active)
    .map(connector => ({
      value: connector.name,
      label: `${connector.name} (${connector.region})`
    }));

  return (
    <div className="container mx-auto">
      {currentStep === 1 && (
        <form onSubmit={handleContinueToTerminal}>
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
              <label htmlFor="name" className="mb-2.5 block font-medium text-black dark:text-white">
                Image Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Ubuntu Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Cloud Provider */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="cloudConnector" className="mb-2.5 block font-medium text-black dark:text-white">
                Cloud Provider
              </label>
              {cloudConnectors.filter(c => c.active).length > 0 ? (
                <select
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={selectedConnector}
                  onChange={(e) => setSelectedConnector(e.target.value)}
                  required
                >
                  <option value="">Select Cloud Provider</option>
                  {cloudConnectorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center h-[54px] px-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No active cloud connectors available. 
                    <a href="/cloud-connectors" className="text-primary ml-1 hover:underline">
                      Add a connector
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Machine Type */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="machine" className="mb-2.5 block font-medium text-black dark:text-white">
                Machine Type
              </label>
              <select
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
              >
                {machineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Active/Inactive Toggle */}
            <div className="col-span-full md:col-span-1">
              <label className="mb-2.5 block font-medium text-black dark:text-white">Status</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => setActive(!active)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium">
                    {active ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label htmlFor="description" className="mb-2.5 block font-medium text-black dark:text-white">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description of the image and its purpose"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary h-24"
              />
            </div>

            {/* Selected Cloud Provider Info */}
            {selectedConnector && (
              <div className="col-span-full mb-4 mt-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
                  Cloud Provider Information
                </h2>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Details of the selected cloud provider
                </div>
                <div className="mt-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  {getSelectedConnectorObject() && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 relative flex-shrink-0">
                            <img 
                              src={getSelectedConnectorObject()?.image} 
                              alt={getSelectedConnectorObject()?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-base font-medium dark:text-gray-200">
                            {getSelectedConnectorObject()?.name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</p>
                        <p className="text-base font-medium dark:text-gray-200">
                          {getSelectedConnectorObject()?.region}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                        <p className="text-base font-medium dark:text-gray-200">
                          {getSelectedConnectorObject()?.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <p className="text-base font-medium dark:text-gray-200">
                          {getSelectedConnectorObject()?.active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Machine Configuration Section */}
            <div className="col-span-full mb-4 mt-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
                Machine Configuration
              </h2>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Resource specifications for VM instances
              </div>
            </div>

            {/* Machine Details */}
            <div className="col-span-full p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU</p>
                  <p className="text-base font-medium dark:text-gray-200">{currentMachine.cpu_count} {currentMachine.cpu_count === 1 ? "Core" : "Cores"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</p>
                  <p className="text-base font-medium dark:text-gray-200">{currentMachine.memory_size} GB</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</p>
                  <p className="text-base font-medium dark:text-gray-200">{currentMachine.storage_size} GB</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Instance Type</p>
                <p className="text-base font-medium dark:text-gray-200">{currentMachine.identifier}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedConnector || cloudConnectors.filter(c => c.active).length === 0 || !name}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!selectedConnector || cloudConnectors.filter(c => c.active).length === 0 
                ? <span title="You need an active cloud connector to create an image">Continue</span>
                : "Continue"
              }
            </button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-white/80">
              Image Configuration Terminal
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Creating image: <span className="font-medium">{name}</span>
            </p>
          </div>

          {/* Terminal Component */}
          <div className="border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-900 text-white p-1 font-mono terminal-shadow">
            <DynamicTerminal logs={terminalLogs} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleBackToForm}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={!terminalCommandsCompleted}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFormWithTerminal;