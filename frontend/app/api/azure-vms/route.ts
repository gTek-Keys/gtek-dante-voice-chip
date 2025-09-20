import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// ☁️ Azure Local VM Management API
// Dedicated endpoint for Azure VM operations with Ubuntu philosophy
export async function GET(request: NextRequest) {
  try {
    // Check for Azure CLI availability
    const azureAvailable = await checkAzureCLI()
    
    if (!azureAvailable.available) {
      return NextResponse.json({
        error: "Azure CLI not available",
        message: "🔧 Ubuntu guidance: Azure CLI installation required",
        install_command: "brew install azure-cli",
        ubuntu_message: "Community tools help us grow together",
        status: "azure_cli_missing"
      }, { status: 503 })
    }

    // Check authentication
    const authStatus = await checkAzureAuth()
    if (!authStatus.authenticated) {
      return NextResponse.json({
        error: "Azure authentication required",
        message: "🔑 Ubuntu trust: Please authenticate with Azure",
        auth_command: "az login --use-device-code",
        ubuntu_message: "Trust builds community connections",
        status: "authentication_required"
      }, { status: 401 })
    }

    // Get VM list
    const vms = await listAzureVMs()
    
    return NextResponse.json({
      service: "gTek Global Terminal Monitor - Azure VM Management",
      ubuntu_message: "☁️ Ubuntu community extends to the cloud",
      azure_account: authStatus.account,
      vms: vms,
      cultural_message: "🖥️ Each VM strengthens our Ubuntu infrastructure"
    })

  } catch (error) {
    console.error('Azure VM API Error:', error);
    
    return NextResponse.json({
      error: "Azure VM service error",
      message: "🚨 Ubuntu resilience: Overcoming cloud challenges together",
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "☁️ Ubuntu spirit persists through all difficulties"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, vmName, vmOs = 'ubuntu', vmSize = 'Standard_B2s', resourceGroup } = await request.json()

    // Validate input
    if (!action) {
      return NextResponse.json({
        error: "Action required",
        message: "🎯 Ubuntu purpose: Specify your VM action",
        available_actions: ["create", "delete", "start", "stop", "restart", "status"],
        cultural_message: "Clear intentions guide Ubuntu success"
      }, { status: 400 })
    }

    // Check Azure availability
    const azureAvailable = await checkAzureCLI()
    if (!azureAvailable.available) {
      return NextResponse.json({
        error: "Azure CLI not available",
        message: "🔧 Ubuntu community: Install Azure CLI to manage VMs",
        install_guide: "brew install azure-cli",
        cultural_message: "Tools unite us in Ubuntu cooperation"
      }, { status: 503 })
    }

    // Check authentication
    const authStatus = await checkAzureAuth()
    if (!authStatus.authenticated) {
      return NextResponse.json({
        error: "Azure authentication required",
        message: "🔑 Ubuntu trust: Authenticate first",
        auth_command: "az login",
        cultural_message: "Trust enables Ubuntu collaboration"
      }, { status: 401 })
    }

    let result;
    
    switch (action.toLowerCase()) {
      case 'create':
      case 'provision':
        result = await createVM(vmName, vmOs, vmSize, resourceGroup);
        break;
        
      case 'delete':
      case 'destroy':
        result = await deleteVM(vmName, resourceGroup);
        break;
        
      case 'start':
        result = await startVM(vmName, resourceGroup);
        break;
        
      case 'stop':
        result = await stopVM(vmName, resourceGroup);
        break;
        
      case 'restart':
        result = await restartVM(vmName, resourceGroup);
        break;
        
      case 'status':
        result = await getVMStatus(vmName, resourceGroup);
        break;
        
      default:
        return NextResponse.json({
          error: "Unknown action",
          message: `🤔 Ubuntu wisdom: '${action}' not recognized`,
          available_actions: ["create", "delete", "start", "stop", "restart", "status"],
          cultural_message: "Ubuntu teaches patience with all learning"
        }, { status: 400 })
    }

    return NextResponse.json({
      service: "gTek Azure VM Management",
      action: action,
      ubuntu_timestamp: new Date().toISOString(),
      cultural_message: "☁️ Ubuntu wisdom guides cloud operations",
      ...result
    })

  } catch (error) {
    console.error('Azure VM POST Error:', error);
    
    return NextResponse.json({
      error: "VM operation failed",
      message: "🚨 Ubuntu resilience: Learning from cloud challenges",
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "☁️ Ubuntu community supports us through difficulties"
    }, { status: 500 })
  }
}

// 🔍 Check Azure CLI availability
async function checkAzureCLI(): Promise<{ available: boolean; version?: string }> {
  try {
    const { stdout } = await execAsync('az --version', { timeout: 5000 })
    const versionMatch = stdout.match(/azure-cli\s+([\d.]+)/)
    
    return {
      available: true,
      version: versionMatch ? versionMatch[1] : 'unknown'
    }
  } catch {
    return { available: false }
  }
}

// 🔑 Check Azure authentication
async function checkAzureAuth(): Promise<{ authenticated: boolean; account?: any }> {
  try {
    const { stdout } = await execAsync('az account show', { timeout: 5000 })
    const account = JSON.parse(stdout)
    
    return {
      authenticated: true,
      account: {
        name: account.name,
        id: account.id,
        tenantId: account.tenantId,
        state: account.state
      }
    }
  } catch {
    return { authenticated: false }
  }
}

// 📊 List Azure VMs
async function listAzureVMs(): Promise<any[]> {
  try {
    // Try to get Arc-enabled machines first
    let arcMachines = [];
    try {
      const { stdout: arcStdout } = await execAsync('az connectedmachine list --query "[].{name:name, status:status, location:location, osName:osName, resourceGroup:resourceGroup}" -o json', { timeout: 15000 });
      arcMachines = JSON.parse(arcStdout) || [];
    } catch {
      // Arc machines not available
    }

    // Get traditional VMs
    let traditionalVMs = [];
    try {
      const { stdout: vmStdout } = await execAsync('az vm list --query "[].{name:name, powerState:powerState, size:hardwareProfile.vmSize, location:location, resourceGroup:resourceGroup, osType:storageProfile.osDisk.osType}" -o json', { timeout: 15000 });
      traditionalVMs = JSON.parse(vmStdout) || [];
    } catch {
      // Traditional VMs not available
    }

    // Combine results with Ubuntu context
    const allVMs = [
      ...arcMachines.map(vm => ({
        ...vm,
        type: 'Arc-enabled',
        ubuntu_context: 'Ubuntu community member via Azure Arc'
      })),
      ...traditionalVMs.map(vm => ({
        ...vm,
        type: 'Traditional VM',
        ubuntu_context: 'Ubuntu virtual community member'
      }))
    ];

    return allVMs;
  } catch (error) {
    console.error('Error listing VMs:', error);
    return [];
  }
}

// 🚀 Create new VM
async function createVM(vmName: string, vmOs: string, vmSize: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🏷️ Ubuntu identity: Every VM needs a meaningful name",
      cultural_message: "Names carry Ubuntu spirit and purpose"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    let createCommand;
    
    switch (vmOs.toLowerCase()) {
      case 'ubuntu':
        createCommand = `az vm create --resource-group "${rg}" --name "${vmName}" --image "Ubuntu2204" --size "${vmSize}" --generate-ssh-keys --public-ip-sku Standard --admin-username azureuser --tags "gTekMonitor=true" "UbuntuPhilosophy=true" "CreatedBy=gTek-Monitor" --output json`;
        break;
        
      case 'windows':
        createCommand = `az vm create --resource-group "${rg}" --name "${vmName}" --image "Win2022Datacenter" --size "${vmSize}" --admin-username azureuser --admin-password "gTek@Ubuntu2025!" --tags "gTekMonitor=true" "UbuntuPhilosophy=true" "CreatedBy=gTek-Monitor" --output json`;
        break;
        
      default:
        return {
          error: "Unsupported OS",
          message: `🔧 Ubuntu guidance: '${vmOs}' not supported`,
          supported_os: ["ubuntu", "windows"],
          cultural_message: "Ubuntu embraces diversity within supported systems"
        };
    }

    console.log('Creating VM with command:', createCommand);
    
    const { stdout } = await execAsync(createCommand, { timeout: 300000 }); // 5 minute timeout
    const vmData = JSON.parse(stdout);
    
    return {
      success: true,
      message: `🚀 Ubuntu celebration: VM '${vmName}' created with community spirit!`,
      vm_details: {
        name: vmName,
        os: vmOs,
        size: vmSize,
        resource_group: rg,
        public_ip: vmData.publicIpAddress,
        private_ip: vmData.privateIpAddress,
        fqdn: vmData.fqdns?.[0]
      },
      ubuntu_welcome: `Welcome ${vmName} to our Ubuntu cloud community!`,
      cultural_message: "☁️ Every new VM strengthens our Ubuntu infrastructure"
    };
    
  } catch (error) {
    return {
      error: "VM creation failed",
      message: `🚨 Ubuntu patience: VM '${vmName}' creation encountered challenges`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "🌱 Ubuntu teaches growth through perseverance"
    };
  }
}

// 🗑️ Delete VM
async function deleteVM(vmName: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🎯 Ubuntu purpose: Specify which VM to remove",
      cultural_message: "Clear intentions guide Ubuntu actions"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    const deleteCommand = `az vm delete --resource-group "${rg}" --name "${vmName}" --yes --output json`;
    
    await execAsync(deleteCommand, { timeout: 180000 }); // 3 minute timeout
    
    return {
      success: true,
      message: `🗑️ Ubuntu farewell: VM '${vmName}' gracefully removed`,
      vm_name: vmName,
      resource_group: rg,
      cultural_message: "Even in deletion, Ubuntu respect guides our actions"
    };
    
  } catch (error) {
    return {
      error: "VM deletion failed",
      message: `🚨 Ubuntu guidance: VM '${vmName}' deletion needs attention`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "Ubuntu teaches patience through all challenges"
    };
  }
}

// ▶️ Start VM
async function startVM(vmName: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🎯 Ubuntu direction: Specify which VM to start"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    const startCommand = `az vm start --resource-group "${rg}" --name "${vmName}" --output json`;
    
    await execAsync(startCommand, { timeout: 120000 }); // 2 minute timeout
    
    return {
      success: true,
      message: `▶️ Ubuntu energy: VM '${vmName}' awakened with community spirit!`,
      vm_name: vmName,
      status: "Starting",
      cultural_message: "🌅 Ubuntu community celebrates each VM awakening"
    };
    
  } catch (error) {
    return {
      error: "VM start failed",
      message: `🚨 Ubuntu support: VM '${vmName}' needs assistance starting`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "Ubuntu community helps overcome startup challenges"
    };
  }
}

// ⏹️ Stop VM
async function stopVM(vmName: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🎯 Ubuntu clarity: Specify which VM to stop"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    const stopCommand = `az vm deallocate --resource-group "${rg}" --name "${vmName}" --output json`;
    
    await execAsync(stopCommand, { timeout: 120000 }); // 2 minute timeout
    
    return {
      success: true,
      message: `⏹️ Ubuntu rest: VM '${vmName}' peacefully stopped`,
      vm_name: vmName,
      status: "Stopped",
      cultural_message: "🌙 Ubuntu wisdom: Rest strengthens our community"
    };
    
  } catch (error) {
    return {
      error: "VM stop failed",
      message: `🚨 Ubuntu patience: VM '${vmName}' stop needs attention`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "Ubuntu teaches graceful handling of all situations"
    };
  }
}

// 🔄 Restart VM
async function restartVM(vmName: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🎯 Ubuntu focus: Specify which VM to restart"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    const restartCommand = `az vm restart --resource-group "${rg}" --name "${vmName}" --output json`;
    
    await execAsync(restartCommand, { timeout: 180000 }); // 3 minute timeout
    
    return {
      success: true,
      message: `🔄 Ubuntu renewal: VM '${vmName}' refreshed with community energy!`,
      vm_name: vmName,
      status: "Restarting",
      cultural_message: "🌱 Ubuntu growth: Renewal brings fresh possibilities"
    };
    
  } catch (error) {
    return {
      error: "VM restart failed",
      message: `🚨 Ubuntu resilience: VM '${vmName}' restart needs support`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "Ubuntu community supports renewal efforts"
    };
  }
}

// ℹ️ Get VM Status
async function getVMStatus(vmName: string, resourceGroup?: string): Promise<any> {
  if (!vmName) {
    return {
      error: "VM name required",
      message: "🎯 Ubuntu inquiry: Specify which VM to check"
    };
  }

  const rg = resourceGroup || process.env.AZURE_RESOURCE_GROUP || 'gtek-ubuntu-vms';
  
  try {
    const statusCommand = `az vm get-instance-view --resource-group "${rg}" --name "${vmName}" --query "instanceView.statuses" --output json`;
    
    const { stdout } = await execAsync(statusCommand, { timeout: 30000 });
    const statuses = JSON.parse(stdout);
    
    const powerState = statuses.find((s: any) => s.code?.startsWith('PowerState/'))?.displayStatus || 'Unknown';
    const provisioningState = statuses.find((s: any) => s.code?.startsWith('ProvisioningState/'))?.displayStatus || 'Unknown';
    
    return {
      success: true,
      vm_name: vmName,
      power_state: powerState,
      provisioning_state: provisioningState,
      resource_group: rg,
      ubuntu_health: powerState === 'VM running' ? "Ubuntu spirit flowing" : "Ubuntu patience needed",
      cultural_message: "📊 Ubuntu monitoring connects us to VM wellbeing"
    };
    
  } catch (error) {
    return {
      error: "VM status check failed",
      message: `🚨 Ubuntu support: Cannot check VM '${vmName}' status`,
      details: error instanceof Error ? error.message : 'Unknown error',
      cultural_message: "Ubuntu community persists through monitoring challenges"
    };
  }
}