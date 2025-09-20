#!/bin/bash
# 🌐 gTek Global Terminal Monitor (powered by Dante)
# Advanced REPL Dispatcher with Azure Local VM Management
# Ubuntu-powered infrastructure control tower with smart orchestration
set -e

# 🔍 Smart project directory detection
detect_project_root() {
    local current_dir="$(pwd)"
    
    # Check current directory first
    if [ -f "./launch.sh" ]; then
        echo "$(pwd)"
        return 0
    fi
    
    # Check parent directory
    if [ -f "../launch.sh" ]; then
        echo "$(cd .. && pwd)"
        return 0
    fi
    
    # Check grandparent directory
    if [ -f "../../launch.sh" ]; then
        echo "$(cd ../.. && pwd)"
        return 0
    fi
    
    # Look for the project in common locations
    if [ -f "/Users/bfh/gtek-dante-voice-chip/launch.sh" ]; then
        echo "/Users/bfh/gtek-dante-voice-chip"
        return 0
    fi
    
    echo "❌ Could not find gTek Global Terminal Monitor project directory" >&2
    echo "   Please navigate to the project directory first" >&2
    echo "   Current directory: $current_dir" >&2
    echo "💡 Try: cd /Users/bfh/gtek-dante-voice-chip" >&2
    return 1
}

# 🌍 Auto-detect project root
PROJECT_ROOT="$(detect_project_root)"
if [ $? -ne 0 ]; then
    exit 1
fi

# Change to project directory
cd "$PROJECT_ROOT"

# 🎨 Enhanced Ubuntu color palette
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
MAGENTA='\033[0;95m'
BRIGHT_GREEN='\033[1;32m'
BRIGHT_BLUE='\033[1;34m'
BRIGHT_YELLOW='\033[1;33m'
BRIGHT_CYAN='\033[1;36m'
BRIGHT_PURPLE='\033[1;35m'
NC='\033[0m' # No Color

# 🌍 Configuration
GTEK_LOG_DIR="$HOME/.gtek-monitor/logs"
GTEK_LOG_FILE="$GTEK_LOG_DIR/gtek-commands.log"
GTEK_HISTORY_FILE="$GTEK_LOG_DIR/gtek-history.txt"
GTEK_CONFIG_DIR="$HOME/.gtek-monitor/config"
AZURE_CONFIG_DIR="$HOME/.gtek-monitor/azure"

# 📊 Session tracking
SESSION_ID=$(date +%Y%m%d_%H%M%S)
COMMAND_COUNT=0

# 🔧 Initialize gTek Monitor environment
init_gtek_monitor() {
    mkdir -p "$GTEK_LOG_DIR" "$GTEK_CONFIG_DIR" "$AZURE_CONFIG_DIR"
    touch "$GTEK_LOG_FILE" "$GTEK_HISTORY_FILE"
    
    # Log session start
    echo "$(date '+%Y-%m-%d %H:%M:%S') - gTek Monitor Session $SESSION_ID started" >> "$GTEK_LOG_FILE"
    
    # Check Azure CLI availability
    if command -v az >/dev/null 2>&1; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Azure CLI detected" >> "$GTEK_LOG_FILE"
    else
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Azure CLI not found - VM management limited" >> "$GTEK_LOG_FILE"
    fi
}

# 📝 Enhanced logging with Ubuntu context
log_command() {
    local command="$1"
    local result="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    ((COMMAND_COUNT++))
    
    echo "$timestamp - [$SESSION_ID:$COMMAND_COUNT] Command: '$command' | Result: $result" >> "$GTEK_LOG_FILE"
    echo "$command" >> "$GTEK_HISTORY_FILE"
}

# 🔍 Azure CLI Helper Functions
check_azure_auth() {
    if ! command -v az >/dev/null 2>&1; then
        echo -e "${RED}❌ Azure CLI not installed. Install with: brew install azure-cli${NC}"
        return 1
    fi
    
    if ! az account show >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Azure authentication required${NC}"
        echo -e "${CYAN}🔑 Run: az login${NC}"
        return 1
    fi
    
    return 0
}

# 🖥️ Azure Local VM Management Functions
azure_list_vms() {
    if ! check_azure_auth; then return 1; fi
    
    echo -e "${BRIGHT_CYAN}🔍 Scanning Azure Local VMs...${NC}"
    
    # List connected machines (Azure Arc)
    echo -e "${CYAN}📊 Arc-enabled machines:${NC}"
    az connectedmachine list --query "[].{Name:name, Status:status, Location:location, OS:osName}" -o table 2>/dev/null || echo "No Arc machines found"
    
    # List traditional VMs if resource group specified
    if [ ! -z "$AZURE_RESOURCE_GROUP" ]; then
        echo -e "${CYAN}📊 Traditional VMs in $AZURE_RESOURCE_GROUP:${NC}"
        az vm list --resource-group "$AZURE_RESOURCE_GROUP" --query "[].{Name:name, PowerState:powerState, Size:hardwareProfile.vmSize, Location:location}" -o table 2>/dev/null || echo "No VMs found in resource group"
    fi
}

azure_vm_status() {
    local vm_name="$1"
    if [ -z "$vm_name" ]; then
        echo -e "${RED}❌ VM name required${NC}"
        return 1
    fi
    
    if ! check_azure_auth; then return 1; fi
    
    echo -e "${BRIGHT_CYAN}🔍 Checking status of VM: $vm_name${NC}"
    
    # Check Arc machine first
    local arc_status=$(az connectedmachine show --name "$vm_name" --resource-group "${AZURE_RESOURCE_GROUP:-MyLocalCluster}" --query "status" -o tsv 2>/dev/null)
    if [ ! -z "$arc_status" ]; then
        echo -e "${GREEN}🖥️  Arc Machine: $vm_name - Status: $arc_status${NC}"
        return 0
    fi
    
    # Check traditional VM
    if [ ! -z "$AZURE_RESOURCE_GROUP" ]; then
        local vm_status=$(az vm get-instance-view --name "$vm_name" --resource-group "$AZURE_RESOURCE_GROUP" --query "instanceView.statuses[?code=='PowerState/*'].displayStatus" -o tsv 2>/dev/null)
        if [ ! -z "$vm_status" ]; then
            echo -e "${GREEN}🖥️  VM: $vm_name - Status: $vm_status${NC}"
        else
            echo -e "${YELLOW}⚠️  VM '$vm_name' not found${NC}"
        fi
    fi
}

azure_provision_vm() {
    local vm_name="$1"
    local vm_os="${2:-ubuntu}"
    local vm_size="${3:-Standard_B2s}"
    
    if [ -z "$vm_name" ]; then
        echo -e "${RED}❌ VM name required${NC}"
        return 1
    fi
    
    if ! check_azure_auth; then return 1; fi
    
    echo -e "${BRIGHT_GREEN}🚀 Provisioning VM: $vm_name (OS: $vm_os, Size: $vm_size)${NC}"
    
    # Use default resource group or prompt
    local rg="${AZURE_RESOURCE_GROUP:-gtek-local-vms}"
    
    # Provision VM based on OS
    case "$vm_os" in
        "ubuntu"|"Ubuntu")
            echo -e "${CYAN}🐧 Creating Ubuntu VM...${NC}"
            az vm create \
                --resource-group "$rg" \
                --name "$vm_name" \
                --image "Ubuntu2204" \
                --size "$vm_size" \
                --generate-ssh-keys \
                --public-ip-sku Standard \
                --admin-username azureuser \
                --tags "gTekMonitor=true" "CreatedBy=gTek-Monitor" \
                --output table
            ;;
        "windows"|"Windows")
            echo -e "${CYAN}🪟 Creating Windows VM...${NC}"
            az vm create \
                --resource-group "$rg" \
                --name "$vm_name" \
                --image "Win2022Datacenter" \
                --size "$vm_size" \
                --admin-username azureuser \
                --admin-password "gTek@2025!" \
                --tags "gTekMonitor=true" "CreatedBy=gTek-Monitor" \
                --output table
            ;;
        *)
            echo -e "${RED}❌ Unsupported OS: $vm_os (use: ubuntu, windows)${NC}"
            return 1
            ;;
    esac
}

azure_delete_vm() {
    local vm_name="$1"
    if [ -z "$vm_name" ]; then
        echo -e "${RED}❌ VM name required${NC}"
        return 1
    fi
    
    if ! check_azure_auth; then return 1; fi
    
    echo -e "${ORANGE}🗑️  Deleting VM: $vm_name${NC}"
    echo -e "${YELLOW}⚠️  This will permanently delete the VM and associated resources${NC}"
    
    local rg="${AZURE_RESOURCE_GROUP:-gtek-local-vms}"
    
    # Confirm deletion
    read -p "Are you sure you want to delete $vm_name? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        az vm delete --resource-group "$rg" --name "$vm_name" --yes --output table
        echo -e "${GREEN}✅ VM '$vm_name' deletion initiated${NC}"
    else
        echo -e "${CYAN}🛡️  VM deletion cancelled${NC}"
    fi
}

azure_scale_vm() {
    local vm_name="$1"
    local new_size="$2"
    
    if [ -z "$vm_name" ] || [ -z "$new_size" ]; then
        echo -e "${RED}❌ VM name and size required${NC}"
        echo -e "${CYAN}💡 Example: scale vm web01 Standard_B4ms${NC}"
        return 1
    fi
    
    if ! check_azure_auth; then return 1; fi
    
    echo -e "${BRIGHT_PURPLE}⚡ Scaling VM: $vm_name to $new_size${NC}"
    
    local rg="${AZURE_RESOURCE_GROUP:-gtek-local-vms}"
    
    # Stop VM first
    echo -e "${YELLOW}🛑 Stopping VM for resize...${NC}"
    az vm deallocate --resource-group "$rg" --name "$vm_name"
    
    # Resize VM
    echo -e "${CYAN}📏 Resizing VM...${NC}"
    az vm resize --resource-group "$rg" --name "$vm_name" --size "$new_size"
    
    # Start VM
    echo -e "${GREEN}🚀 Starting resized VM...${NC}"
    az vm start --resource-group "$rg" --name "$vm_name"
    
    echo -e "${BRIGHT_GREEN}✅ VM '$vm_name' scaled to $new_size${NC}"
}

# 🎯 Enhanced command aliases with Azure VM support
get_command_mapping() {
    local input="$1"
    local clean_input=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/gtek[,]*[ ]*//' | sed 's/dante[,]*[ ]*//' | xargs)
    
    # Comprehensive command mapping with Azure VM commands
    case "$clean_input" in
        # Azure VM Management Commands
        "provision vm"*|"create vm"*|"new vm"*|"vm create"*)
            echo "azure_vm_provision"
            ;;
        "delete vm"*|"remove vm"*|"vm delete"*|"destroy vm"*)
            echo "azure_vm_delete"
            ;;
        "show vms"|"list vms"|"vms"|"vm list"|"azure vms"|"all vms")
            echo "azure_vm_list"
            ;;
        "vm status"*|"status vm"*|"check vm"*|"vm health"*)
            echo "azure_vm_status"
            ;;
        "scale vm"*|"resize vm"*|"vm scale"*|"vm resize"*)
            echo "azure_vm_scale"
            ;;
        "azure login"|"az login"|"azure auth"|"login azure")
            echo "azure_login"
            ;;
        "azure status"|"azure info"|"az status"|"azure account")
            echo "azure_status"
            ;;
        # Container and Infrastructure Commands
        "rebuild frontend"|"build frontend"|"frontend build"|"front build"|"fe build"|"rebuild fe"|"build fe")
            echo "frontend_build"
            ;;
        "rebuild backend"|"build backend"|"backend build"|"back build"|"be build"|"rebuild be"|"build be")
            echo "backend_build"
            ;;
        "start orchestra"|"start all"|"up"|"start"|"orchestra up"|"compose up"|"docker up")
            echo "orchestra_start"
            ;;
        "stop orchestra"|"stop all"|"down"|"stop"|"orchestra down"|"compose down"|"docker down")
            echo "orchestra_stop"
            ;;
        "restart orchestra"|"restart all"|"restart"|"orchestra restart"|"compose restart")
            echo "orchestra_restart"
            ;;
        "show containers"|"list containers"|"containers"|"ps"|"docker ps"|"ls containers")
            echo "containers_show"
            ;;
        "container logs"|"logs containers"|"docker logs")
            echo "containers_logs"
            ;;
        # Development commands
        "run tests"|"test"|"tests"|"test all"|"run test"|"testing")
            echo "tests_run"
            ;;
        "build all"|"build"|"build everything"|"full build"|"complete build")
            echo "build_all"
            ;;
        "dev mode"|"dev"|"development"|"start dev"|"dev server"|"serve")
            echo "dev_start"
            ;;
        "deploy"|"deployment"|"ship"|"release"|"go live")
            echo "deploy_run"
            ;;
        "clean workspace"|"cleanup"|"clean all"|"reset"|"cleanse")
            echo "clean_run"
            ;;
        # Information commands
        "git status"|"status"|"repo status"|"git state"|"git info")
            echo "git_status"
            ;;
        "show logs"|"logs"|"view logs"|"log files"|"system logs"|"monitor logs")
            echo "logs_show"
            ;;
        "api logs"|"backend logs"|"server logs"|"app logs")
            echo "logs_api"
            ;;
        # Help and wisdom
        "help"|"commands"|"what can you do"|"available commands"|"list commands")
            echo "help_show"
            ;;
        "wisdom"|"ubuntu"|"philosophy"|"quote"|"inspiration"|"proverb")
            echo "wisdom_show"
            ;;
        "stats"|"statistics"|"session stats"|"command stats"|"monitor stats")
            echo "stats_show"
            ;;
        "history"|"command history"|"recent commands"|"past commands")
            echo "history_show"
            ;;
        # System commands
        "health check"|"health"|"system health"|"check health"|"monitor health")
            echo "health_check"
            ;;
        "clear screen"|"cls"|"clear terminal")
            echo "screen_clear"
            ;;
        "exit"|"quit"|"bye"|"farewell"|"goodbye"|"logout"|"end")
            echo "exit_monitor"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# 🎯 Enhanced command execution with Azure VM support
execute_enhanced_command() {
    local input="$1"
    local command_type=$(get_command_mapping "$input")
    local start_time=$(date +%s)
    
    case "$command_type" in
        # Azure VM Commands
        "azure_vm_provision")
            # Extract VM name and OS from input
            local vm_name=$(echo "$input" | sed -n 's/.*vm \([a-zA-Z0-9-]*\).*/\1/p')
            local vm_os=$(echo "$input" | grep -o "ubuntu\|windows\|Ubuntu\|Windows" | head -1)
            azure_provision_vm "$vm_name" "$vm_os"
            log_command "$input" $?
            ;;
        "azure_vm_delete")
            local vm_name=$(echo "$input" | sed -n 's/.*vm \([a-zA-Z0-9-]*\).*/\1/p')
            azure_delete_vm "$vm_name"
            log_command "$input" $?
            ;;
        "azure_vm_list")
            azure_list_vms
            log_command "$input" $?
            ;;
        "azure_vm_status")
            local vm_name=$(echo "$input" | sed -n 's/.*\(status\|check\) vm \([a-zA-Z0-9-]*\).*/\2/p')
            azure_vm_status "$vm_name"
            log_command "$input" $?
            ;;
        "azure_vm_scale")
            local vm_name=$(echo "$input" | sed -n 's/.*vm \([a-zA-Z0-9-]*\).*/\1/p')
            local vm_size=$(echo "$input" | grep -o "Standard_[A-Za-z0-9]*" | head -1)
            azure_scale_vm "$vm_name" "$vm_size"
            log_command "$input" $?
            ;;
        "azure_login")
            echo -e "${BRIGHT_CYAN}🔑 Initiating Azure authentication...${NC}"
            az login --use-device-code
            log_command "$input" $?
            ;;
        "azure_status")
            echo -e "${BRIGHT_CYAN}☁️  Azure Account Information${NC}"
            if check_azure_auth; then
                az account show --query "{Name:name, ID:id, TenantID:tenantId, State:state}" -o table
                echo -e "${CYAN}📊 Resource Groups:${NC}"
                az group list --query "[].{Name:name, Location:location}" -o table
            fi
            log_command "$input" $?
            ;;
        # Existing container/infrastructure commands
        "frontend_build")
            echo -e "${BRIGHT_GREEN}🌐 Rebuilding gTek Frontend with Ubuntu excellence...${NC}"
            echo -e "${CYAN}🔄 Executing: cd frontend && docker compose build dante-frontend${NC}"
            if cd frontend && docker compose build dante-frontend; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ gTek Frontend symphony composed with Ubuntu excellence!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Frontend build encountered Ubuntu wisdom needed${NC}"
                return 1
            fi
            ;;
        "backend_build")
            echo -e "${BRIGHT_BLUE}🔧 Harmonizing gTek Backend services with Ubuntu spirit...${NC}"
            echo -e "${CYAN}🔄 Executing: cd backend && docker compose build dante-backend${NC}"
            if cd backend && docker compose build dante-backend; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ gTek Backend harmony achieved through collective wisdom!${NC}"
                return 0
            else
                log_command "$input" "FAILED"  
                echo -e "${RED}❌ Backend build needs Ubuntu guidance forward${NC}"
                return 1
            fi
            ;;
        "orchestra_start")
            echo -e "${BRIGHT_YELLOW}🚀 Conducting the gTek Global Terminal Monitor orchestra...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose up -d${NC}"
            if docker compose up -d; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ gTek Monitor orchestra playing in perfect Ubuntu harmony!${NC}"
                echo -e "${BRIGHT_CYAN}🌐 Access your gTek Global Terminal Monitor at: http://localhost:3000${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Orchestra needs tuning - Ubuntu patience guides us${NC}"
                return 1
            fi
            ;;
        "orchestra_stop")
            echo -e "${ORANGE}🛑 Gracefully ending the gTek Monitor symphony...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose down${NC}"
            if docker compose down; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ gTek Monitor orchestra concluded with Ubuntu respect!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Symphony ending needs Ubuntu wisdom${NC}"
                return 1
            fi
            ;;
        "health_check")
            echo -e "${BRIGHT_PURPLE}🏥 gTek Global Terminal Monitor Health Assessment${NC}"
            echo -e "${CYAN}🔍 Checking system components...${NC}"
            
            # Check Docker
            if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Docker: Operational${NC}"
            else
                echo -e "${RED}❌ Docker: Issues detected${NC}"
            fi
            
            # Check Azure CLI
            if command -v az >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Azure CLI: Installed${NC}"
                if az account show >/dev/null 2>&1; then
                    echo -e "${GREEN}✅ Azure Authentication: Active${NC}"
                else
                    echo -e "${YELLOW}⚠️  Azure Authentication: Required${NC}"
                fi
            else
                echo -e "${YELLOW}⚠️  Azure CLI: Not installed${NC}"
            fi
            
            # Check project files
            if [ -f "docker-compose.yml" ]; then
                echo -e "${GREEN}✅ Docker Compose: Configuration found${NC}"
            else
                echo -e "${RED}❌ Docker Compose: Configuration missing${NC}"
            fi
            
            # Check port availability
            if ! netstat -an | grep -q ":3000.*LISTEN"; then
                echo -e "${GREEN}✅ Port 3000: Available${NC}"
            else
                echo -e "${YELLOW}⚠️  Port 3000: In use${NC}"
            fi
            
            log_command "$input" "SUCCESS"
            ;;
        "help_show")
            show_enhanced_help
            log_command "$input" "SUCCESS"
            ;;
        "wisdom_show")
            show_ubuntu_wisdom
            log_command "$input" "SUCCESS"
            ;;
        "stats_show")
            show_session_stats
            log_command "$input" "SUCCESS"
            ;;
        "screen_clear")
            clear
            show_gtek_banner
            log_command "$input" "SUCCESS"
            ;;
        "exit_monitor")
            echo -e "${BRIGHT_CYAN}🌍 Ubuntu wisdom: 'I am because we are'${NC}"
            echo -e "${GREEN}✅ gTek Global Terminal Monitor session concluded with gratitude${NC}"
            echo -e "${YELLOW}📊 Session stats: $COMMAND_COUNT commands executed${NC}"
            log_command "$input" "SUCCESS"
            exit 0
            ;;
        "git_status")
            echo -e "${BRIGHT_BLUE}📊 gTek Repository Status with Ubuntu Perspective${NC}"
            git status --porcelain | while read status file; do
                case "$status" in
                    "M "*) echo -e "${YELLOW}📝 Modified: $file${NC}" ;;
                    "A "*) echo -e "${GREEN}➕ Added: $file${NC}" ;;
                    "D "*) echo -e "${RED}➖ Deleted: $file${NC}" ;;
                    "??") echo -e "${CYAN}❓ Untracked: $file${NC}" ;;
                esac
            done
            echo -e "${PURPLE}🌱 Ubuntu wisdom guides our collaborative development${NC}"
            log_command "$input" "SUCCESS"
            ;;
        *)
            echo -e "${RED}❓ Command not recognized: '$input'${NC}"
            echo -e "${CYAN}💡 Try 'help' to see available commands${NC}"
            echo -e "${YELLOW}🌍 Ubuntu spirit: Let's learn together${NC}"
            log_command "$input" "UNKNOWN"
            return 1
            ;;
    esac
}

# 🎨 Enhanced banner with gTek branding
show_gtek_banner() {
    echo -e "${BRIGHT_CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                   🌐 gTek Global Terminal Monitor                           ║"
    echo "║                           (powered by Dante)                                ║"
    echo "║                                                                              ║"
    echo "║  🐳 Docker + ☁️  Azure Local + 🚀 Vercel + 📊 Supabase + 🎤 Voice Control   ║"
    echo "║                                                                              ║"
    echo "║  🌍 Ubuntu Philosophy: 'I am because we are'                                ║"
    echo "║  🎯 Infrastructure Control Tower with African Wisdom                        ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${BRIGHT_YELLOW}⚡ Type 'help' for commands, 'wisdom' for Ubuntu guidance⚡${NC}"
    echo
}

# 📚 Enhanced help with Azure VM commands
show_enhanced_help() {
    echo -e "${BRIGHT_CYAN}🌐 gTek Global Terminal Monitor - Available Commands${NC}"
    echo
    echo -e "${BRIGHT_PURPLE}☁️  Azure Local VM Management:${NC}"
    echo -e "${CYAN}   provision vm ubuntu <name>  ${NC} - Create new Ubuntu VM"
    echo -e "${CYAN}   provision vm windows <name> ${NC} - Create new Windows VM"
    echo -e "${CYAN}   delete vm <name>            ${NC} - Delete VM and resources"
    echo -e "${CYAN}   show vms                    ${NC} - List all VMs and Arc machines"
    echo -e "${CYAN}   vm status <name>            ${NC} - Check specific VM status"
    echo -e "${CYAN}   scale vm <name> <size>      ${NC} - Resize VM (e.g., Standard_B4ms)"
    echo -e "${CYAN}   azure login                 ${NC} - Authenticate with Azure"
    echo -e "${CYAN}   azure status                ${NC} - Show Azure account info"
    echo
    echo -e "${BRIGHT_GREEN}🐳 Container Management:${NC}"
    echo -e "${CYAN}   start orchestra             ${NC} - Launch all services"
    echo -e "${CYAN}   stop orchestra              ${NC} - Stop all services"
    echo -e "${CYAN}   restart orchestra           ${NC} - Restart all services"
    echo -e "${CYAN}   show containers             ${NC} - List running containers"
    echo -e "${CYAN}   container logs              ${NC} - View container logs"
    echo
    echo -e "${BRIGHT_BLUE}🔨 Build Commands:${NC}"
    echo -e "${CYAN}   build frontend              ${NC} - Rebuild frontend container"
    echo -e "${CYAN}   build backend               ${NC} - Rebuild backend container"
    echo -e "${CYAN}   build all                   ${NC} - Full system build"
    echo -e "${CYAN}   dev mode                    ${NC} - Start development server"
    echo
    echo -e "${BRIGHT_YELLOW}📊 Information:${NC}"
    echo -e "${CYAN}   git status                  ${NC} - Repository status"
    echo -e "${CYAN}   health check                ${NC} - System health assessment"
    echo -e "${CYAN}   show logs                   ${NC} - View system logs"
    echo -e "${CYAN}   stats                       ${NC} - Session statistics"
    echo -e "${CYAN}   wisdom                      ${NC} - Ubuntu philosophy"
    echo -e "${CYAN}   help                        ${NC} - Show this help"
    echo
    echo -e "${PURPLE}🌍 Ubuntu wisdom: 'Umuntu ngumuntu ngabantu' - A person is a person through other persons${NC}"
}

# 🌍 Ubuntu wisdom display
show_ubuntu_wisdom() {
    local wisdoms=(
        "🌍 Ubuntu: 'I am because we are' - Our collective strength builds great systems"
        "🤝 Ubuntu: 'Umuntu ngumuntu ngabantu' - A person is a person through other persons"
        "🌱 Ubuntu: When we work together, our infrastructure grows stronger"
        "💚 Ubuntu: Share knowledge freely - your wisdom strengthens the community"
        "🌟 Ubuntu: Every contribution matters, no matter how small"
        "🔄 Ubuntu: Continuous learning and teaching - the Ubuntu way"
        "🌈 Ubuntu: Diversity in skills creates robust systems"
        "⚡ Ubuntu: Technology serves humanity best when guided by Ubuntu values"
    )
    
    local random_wisdom=${wisdoms[$RANDOM % ${#wisdoms[@]}]}
    echo -e "${BRIGHT_PURPLE}$random_wisdom${NC}"
}

# 📊 Session statistics
show_session_stats() {
    local end_time=$(date +%s)
    local session_duration=$((end_time - start_time))
    
    echo -e "${BRIGHT_CYAN}📊 gTek Global Terminal Monitor Session Statistics${NC}"
    echo -e "${CYAN}Session ID: $SESSION_ID${NC}"
    echo -e "${CYAN}Commands executed: $COMMAND_COUNT${NC}"
    echo -e "${CYAN}Session duration: ${session_duration}s${NC}"
    echo -e "${CYAN}Project root: $PROJECT_ROOT${NC}"
    
    if [ -f "$GTEK_HISTORY_FILE" ]; then
        local recent_commands=$(tail -5 "$GTEK_HISTORY_FILE" | nl)
        echo -e "${CYAN}Recent commands:${NC}"
        echo "$recent_commands"
    fi
    
    echo -e "${PURPLE}🌍 Ubuntu principle: Your contributions strengthen our collective wisdom${NC}"
}

# 🚀 Main REPL loop
main_repl() {
    local start_time=$(date +%s)
    
    # Initialize environment
    init_gtek_monitor
    
    # Show banner
    show_gtek_banner
    
    # Check for Azure CLI and suggest installation if missing
    if ! command -v az >/dev/null 2>&1; then
        echo -e "${YELLOW}💡 Install Azure CLI for VM management: ${CYAN}brew install azure-cli${NC}"
        echo
    fi
    
    # Main command loop
    while true; do
        echo -e "${BRIGHT_GREEN}gTek Monitor${NC}${CYAN}>${NC} \c"
        read -r user_input
        
        # Skip empty input
        if [ -z "$user_input" ]; then
            continue
        fi
        
        # Process command
        execute_enhanced_command "$user_input"
        echo
    done
}

# 🎯 Entry point
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main_repl
fi