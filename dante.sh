#!/bin/bash
# 🎼 Dante Voice Chip Advanced REPL Dispatcher
# Ubuntu-powered interactive development environment
set -e

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
NC='\033[0m' # No Color

# 🌍 Configuration
DANTE_LOG_DIR="$HOME/.dante-voice-chip/logs"
DANTE_LOG_FILE="$DANTE_LOG_DIR/dante-commands.log"
DANTE_HISTORY_FILE="$DANTE_LOG_DIR/dante-history.txt"
DANTE_CONFIG_DIR="$HOME/.dante-voice-chip/config"

# 📊 Session tracking
SESSION_ID=$(date +%Y%m%d_%H%M%S)
COMMAND_COUNT=0

# 🔧 Initialize Dante environment
init_dante() {
    mkdir -p "$DANTE_LOG_DIR" "$DANTE_CONFIG_DIR"
    touch "$DANTE_LOG_FILE" "$DANTE_HISTORY_FILE"
    
    # Log session start
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Session $SESSION_ID started" >> "$DANTE_LOG_FILE"
}

# 📝 Enhanced logging with Ubuntu context
log_command() {
    local command="$1"
    local result="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    ((COMMAND_COUNT++))
    
    echo "$timestamp - [$SESSION_ID:$COMMAND_COUNT] Command: '$command' | Result: $result" >> "$DANTE_LOG_FILE"
    echo "$command" >> "$DANTE_HISTORY_FILE"
}

# 🎯 Enhanced command aliases with fuzzy matching
get_command_mapping() {
    local input="$1"
    local clean_input=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/dante[,]*[ ]*//' | xargs)
    
    # Comprehensive command mapping with aliases
    case "$clean_input" in
        # Frontend commands
        "rebuild frontend"|"build frontend"|"frontend build"|"front build"|"fe build"|"rebuild fe"|"build fe")
            echo "frontend_build"
            ;;
        # Backend commands  
        "rebuild backend"|"build backend"|"backend build"|"back build"|"be build"|"rebuild be"|"build be")
            echo "backend_build"
            ;;
        # Docker orchestration
        "start orchestra"|"start all"|"up"|"start"|"orchestra up"|"compose up"|"docker up")
            echo "orchestra_start"
            ;;
        "stop orchestra"|"stop all"|"down"|"stop"|"orchestra down"|"compose down"|"docker down")
            echo "orchestra_stop"
            ;;
        "restart orchestra"|"restart all"|"restart"|"orchestra restart"|"compose restart")
            echo "orchestra_restart"
            ;;
        # Container management
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
        "show logs"|"logs"|"view logs"|"log files"|"dante logs"|"system logs")
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
        "stats"|"statistics"|"session stats"|"command stats"|"dante stats")
            echo "stats_show"
            ;;
        "history"|"command history"|"recent commands"|"past commands")
            echo "history_show"
            ;;
        # REPL commands
        "clear screen"|"cls"|"clear terminal")
            echo "screen_clear"
            ;;
        "exit"|"quit"|"bye"|"farewell"|"goodbye"|"logout"|"end")
            echo "exit_dante"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# 🎯 Enhanced command execution with rich feedback
execute_enhanced_command() {
    local input="$1"
    local command_type=$(get_command_mapping "$input")
    local start_time=$(date +%s)
    
    case "$command_type" in
        "frontend_build")
            echo -e "${BRIGHT_GREEN}🎼 Rebuilding frontend with Afrocentric excellence...${NC}"
            echo -e "${CYAN}🔄 Executing: cd frontend && docker compose build dante-frontend${NC}"
            if cd frontend && docker compose build dante-frontend; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Frontend symphony composed with Ubuntu excellence!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Frontend build encountered Ubuntu wisdom needed${NC}"
                return 1
            fi
            ;;
        "backend_build")
            echo -e "${BRIGHT_BLUE}🎵 Harmonizing backend services with Ubuntu spirit...${NC}"
            echo -e "${CYAN}🔄 Executing: cd backend && docker compose build dante-backend${NC}"
            if cd backend && docker compose build dante-backend; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Backend harmony achieved through collective wisdom!${NC}"
                return 0
            else
                log_command "$input" "FAILED"  
                echo -e "${RED}❌ Backend build needs Ubuntu guidance forward${NC}"
                return 1
            fi
            ;;
        "orchestra_start")
            echo -e "${BRIGHT_YELLOW}🚀 Conducting the full development orchestra...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose up -d${NC}"
            if docker compose up -d; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Orchestra playing in perfect Ubuntu harmony!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Orchestra needs tuning - Ubuntu patience guides us${NC}"
                return 1
            fi
            ;;
        "orchestra_stop")
            echo -e "${ORANGE}🛑 Gracefully ending the symphony...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose down${NC}"
            if docker compose down; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Orchestra concluded with Ubuntu respect!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Symphony ending needs Ubuntu wisdom${NC}"
                return 1
            fi
            ;;
        "orchestra_restart")
            echo -e "${MAGENTA}🔄 Restarting the Ubuntu development symphony...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose restart${NC}"
            if docker compose restart; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Orchestra retuned with Ubuntu excellence!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Orchestra restart needs collective wisdom${NC}"
                return 1
            fi
            ;;
        "containers_show")
            echo -e "${BRIGHT_BLUE}📊 Displaying container ensemble status...${NC}"
            echo -e "${CYAN}🔄 Executing: docker ps${NC}"
            if docker ps; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Container status revealed with Ubuntu clarity!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Container status needs Ubuntu investigation${NC}"
                return 1
            fi
            ;;
        "containers_logs")
            echo -e "${BRIGHT_YELLOW}📜 Revealing container chronicles...${NC}"
            echo -e "${CYAN}🔄 Executing: docker compose logs --tail=50${NC}"
            if docker compose logs --tail=50; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Container wisdom shared through Ubuntu logs!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Log access needs Ubuntu permissions${NC}"
                return 1
            fi
            ;;
        "tests_run")
            echo -e "${BRIGHT_GREEN}🧪 Testing with collective Ubuntu wisdom...${NC}"
            echo -e "${CYAN}🔄 Executing: npm run test:all${NC}"
            if npm run test:all; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Tests passed through Ubuntu excellence!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Tests reveal Ubuntu learning opportunities${NC}"
                return 1
            fi
            ;;
        "git_status")
            echo -e "${BRIGHT_BLUE}📋 Checking repository harmony...${NC}"
            echo -e "${CYAN}🔄 Executing: git status${NC}"
            if git status; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ Repository harmony achieved through Ubuntu!${NC}"
                return 0
            else
                log_command "$input" "FAILED"
                echo -e "${RED}❌ Repository needs Ubuntu guidance${NC}"
                return 1
            fi
            ;;
        "logs_show")
            echo -e "${BRIGHT_YELLOW}📜 Revealing the chronicles of our Ubuntu journey...${NC}"
            echo -e "${CYAN}🔄 Executing: find ~/.dante-voice-chip/logs -name '*.log'${NC}"
            find ~/.dante-voice-chip/logs -name '*.log' 2>/dev/null | head -10 | xargs ls -lh 2>/dev/null || echo -e "${YELLOW}💡 No logs found - start the agent to create chronicles of Ubuntu excellence${NC}"
            log_command "$input" "SUCCESS"
            echo -e "${GREEN}✅ Log chronicles revealed with Ubuntu wisdom!${NC}"
            return 0
            ;;
        "logs_api")
            echo -e "${BRIGHT_CYAN}🌐 Fetching API chronicles with Ubuntu spirit...${NC}"
            echo -e "${CYAN}🔄 Executing: curl -s http://localhost:3001/api/logs${NC}"
            if curl -s http://localhost:3001/api/logs | jq '.logs[] | {file, lines, lastModified}' 2>/dev/null; then
                log_command "$input" "SUCCESS"
                echo -e "${GREEN}✅ API logs shared through Ubuntu connectivity!${NC}"
                return 0
            else
                echo -e "${YELLOW}💡 API server not running - start dev server for Ubuntu logs${NC}"
                log_command "$input" "NO_SERVER"
                return 1
            fi
            ;;
        "help_show")
            show_enhanced_help
            log_command "$input" "SUCCESS"
            return 0
            ;;
        "wisdom_show")
            show_ubuntu_wisdom
            log_command "$input" "SUCCESS"
            return 0
            ;;
        "stats_show")
            show_session_stats
            log_command "$input" "SUCCESS"
            return 0
            ;;
        "history_show")
            show_command_history
            log_command "$input" "SUCCESS"
            return 0
            ;;
        "screen_clear")
            clear
            show_ubuntu_banner
            log_command "$input" "SUCCESS"
            echo -e "${GREEN}✅ Screen cleared with Ubuntu freshness!${NC}"
            return 0
            ;;
        "exit_dante")
            show_ubuntu_farewell
            log_command "$input" "EXIT"
            exit 0
            ;;
        *)
            echo -e "${RED}🤔 Dante didn't recognize: '${input}'${NC}"
            echo -e "${CYAN}💡 Try 'help' to see available Ubuntu commands${NC}"
            log_command "$input" "UNKNOWN"
            return 1
            ;;
    esac
}

# 🎨 Ubuntu banner display
show_ubuntu_banner() {
    echo -e "${BRIGHT_YELLOW}🌍 Welcome to Ubuntu Development Excellence${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════${NC}"
    echo -e "${CYAN}    'I am because we are' - Ubuntu Philosophy${NC}"
    echo -e "${GREEN}      Dante Command Dispatcher v2.0${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════${NC}"
    echo ""
}

# 📚 Enhanced help with categories and aliases
show_enhanced_help() {
    echo -e "${BRIGHT_YELLOW}🎯 Ubuntu Development Commands - Enhanced REPL${NC}"
    echo ""
    echo -e "${BRIGHT_BLUE}🐳 Docker Orchestra Commands:${NC}"
    echo -e "${GREEN}  • rebuild frontend${NC} | ${CYAN}build frontend, fe build, frontend build${NC}"
    echo -e "${GREEN}  • rebuild backend${NC}  | ${CYAN}build backend, be build, backend build${NC}"
    echo -e "${GREEN}  • start orchestra${NC}  | ${CYAN}start all, up, compose up${NC}"
    echo -e "${GREEN}  • stop orchestra${NC}   | ${CYAN}stop all, down, compose down${NC}"
    echo -e "${GREEN}  • restart orchestra${NC}| ${CYAN}restart all, restart${NC}"
    echo -e "${GREEN}  • show containers${NC}  | ${CYAN}containers, ps, docker ps${NC}"
    echo -e "${GREEN}  • container logs${NC}   | ${CYAN}docker logs, logs containers${NC}"
    echo ""
    echo -e "${BRIGHT_GREEN}💻 Development Commands:${NC}"
    echo -e "${GREEN}  • run tests${NC}        | ${CYAN}test, tests, testing${NC}"
    echo -e "${GREEN}  • build all${NC}        | ${CYAN}build, full build, complete build${NC}"
    echo -e "${GREEN}  • dev mode${NC}         | ${CYAN}dev, development, serve${NC}"
    echo -e "${GREEN}  • deploy${NC}           | ${CYAN}deployment, ship, release${NC}"
    echo -e "${GREEN}  • clean workspace${NC}  | ${CYAN}cleanup, clean all, reset${NC}"
    echo ""
    echo -e "${BRIGHT_CYAN}📊 Information & Logs:${NC}"
    echo -e "${GREEN}  • git status${NC}       | ${CYAN}status, repo status${NC}"
    echo -e "${GREEN}  • show logs${NC}        | ${CYAN}logs, view logs, system logs${NC}"
    echo -e "${GREEN}  • api logs${NC}         | ${CYAN}backend logs, server logs${NC}"
    echo -e "${GREEN}  • stats${NC}            | ${CYAN}session stats, command stats${NC}"
    echo -e "${GREEN}  • history${NC}          | ${CYAN}command history, recent commands${NC}"
    echo ""
    echo -e "${BRIGHT_MAGENTA}🎭 Ubuntu Wisdom & REPL:${NC}"
    echo -e "${GREEN}  • wisdom${NC}           | ${CYAN}ubuntu, philosophy, quote${NC}"
    echo -e "${GREEN}  • help${NC}             | ${CYAN}commands, what can you do${NC}"
    echo -e "${GREEN}  • clear screen${NC}     | ${CYAN}cls, clear terminal${NC}"
    echo -e "${GREEN}  • exit${NC}             | ${CYAN}quit, bye, farewell${NC}"
    echo ""
    echo -e "${PURPLE}💡 Natural Language: Type commands naturally - 'Dante,' prefix optional${NC}"
    echo -e "${PURPLE}🌍 Ubuntu Spirit: Every command carries collective wisdom${NC}"
}

# 🌍 Enhanced Ubuntu wisdom with rotation
show_ubuntu_wisdom() {
    local WISDOM=(
        "🌍 'I am because we are' - Our code strengthens through collaboration"
        "🤝 'A person is a person through other persons' - Community-driven development"
        "🎼 'When spider webs unite, they can tie up a lion' - Collective coding power"
        "🌱 'However far the stream flows, it never forgets its source' - Honor our roots"
        "✊🏿 'If you want to go fast, go alone. If you want to go far, go together' - Team excellence"
        "🎯 'Unity is strength, division is weakness' - Monorepo philosophy"
        "🚀 'The best time to plant a tree was 20 years ago. The second best time is now' - Start coding!"
        "🔥 'A single bracelet does not jingle' - Collaboration makes the music"
        "🎨 'The wise create proverbs for fools to learn, not to repeat' - Innovation through tradition"
        "💡 'Knowledge is like a garden: if it is not cultivated, it cannot be harvested' - Continuous learning"
        "🌟 'He who learns, teaches' - Share your Ubuntu knowledge"
        "🎵 'When the roots of a tree begin to decay, it spreads death to the branches' - Strong foundations matter"
    )
    
    local RANDOM_INDEX=$((RANDOM % ${#WISDOM[@]}))
    echo -e "${PURPLE}${WISDOM[$RANDOM_INDEX]}${NC}"
    echo ""
    echo -e "${CYAN}Ubuntu Philosophy guides our development with wisdom and excellence.${NC}"
}

# 📊 Session statistics display
show_session_stats() {
    local session_time=$(($(date +%s) - $(date -j -f "%Y%m%d_%H%M%S" "$SESSION_ID" "+%s" 2>/dev/null || echo "0")))
    local session_minutes=$((session_time / 60))
    
    echo -e "${BRIGHT_YELLOW}📊 Ubuntu Development Session Statistics${NC}"
    echo ""
    echo -e "${CYAN}🎯 Session ID:${NC} $SESSION_ID"
    echo -e "${CYAN}⏱️  Active Time:${NC} ${session_minutes} minutes"
    echo -e "${CYAN}🎼 Commands Run:${NC} $COMMAND_COUNT"
    echo -e "${CYAN}📝 Log Location:${NC} $DANTE_LOG_FILE"
    echo ""
    if [ -f "$DANTE_LOG_FILE" ]; then
        echo -e "${GREEN}Recent Ubuntu Command Activity:${NC}"
        tail -5 "$DANTE_LOG_FILE" | sed 's/^/  /'
    fi
    echo ""
    echo -e "${PURPLE}� Ubuntu productivity through collective excellence!${NC}"
}

# 📚 Command history with Ubuntu context
show_command_history() {
    echo -e "${BRIGHT_CYAN}📚 Ubuntu Command History - Recent Wisdom${NC}"
    echo ""
    if [ -f "$DANTE_HISTORY_FILE" ]; then
        echo -e "${GREEN}Last 10 Ubuntu Commands:${NC}"
        tail -10 "$DANTE_HISTORY_FILE" | nl -s '. ' | sed 's/^/  /'
    else
        echo -e "${YELLOW}💡 No command history yet - start your Ubuntu journey!${NC}"
    fi
    echo ""
    echo -e "${PURPLE}�🎼 'I am because we are' - Our shared command history builds collective wisdom${NC}"
}

# 👋 Ubuntu farewell with session summary
show_ubuntu_farewell() {
    echo ""
    echo -e "${PURPLE}🌍 Ubuntu Development Session Complete${NC}"
    echo ""
    echo -e "${CYAN}📊 Session Summary:${NC}"
    echo -e "${GREEN}  • Commands Executed: $COMMAND_COUNT${NC}"
    echo -e "${GREEN}  • Session Duration: $(($(date +%s) - $(date -j -f "%Y%m%d_%H%M%S" "$SESSION_ID" "+%s" 2>/dev/null || echo "0"))) seconds${NC}"
    echo -e "${GREEN}  • Ubuntu Wisdom Shared: Together we achieved excellence${NC}"
    echo ""
    echo -e "${BRIGHT_YELLOW}🎼 'Until we meet again - Ubuntu guides our path forward!'${NC}"
    echo -e "${PURPLE}    May your code flourish with collective wisdom${NC}"
    echo ""
}

# 🌍 Ubuntu greeting
show_banner() {
    echo -e "${PURPLE}🎼═══════════════════════════════════════════════════════🎼${NC}"
    echo -e "${YELLOW}          Dante Voice Chip Command Dispatcher${NC}"
    echo -e "${CYAN}     'I am because we are' - Ubuntu Development Excellence${NC}"
    echo -e "${PURPLE}🎼═══════════════════════════════════════════════════════🎼${NC}"
}

# 🎯 Command execution with cultural responses
execute_command() {
    local INPUT="$1"
    local SUCCESS_MSG=""
    local COMMAND=""
    
    case "$INPUT" in
        "Dante, rebuild frontend"|"rebuild frontend"|"build frontend")
            SUCCESS_MSG="🎼 Rebuilding frontend with Afrocentric excellence..."
            COMMAND="cd frontend && docker compose build dante-frontend"
            ;;
        "Dante, rebuild backend"|"rebuild backend"|"build backend")
            SUCCESS_MSG="🎵 Harmonizing backend services with Ubuntu spirit..."
            COMMAND="cd backend && docker compose build dante-backend"
            ;;
        "Dante, start orchestra"|"start orchestra"|"start all"|"up")
            SUCCESS_MSG="🚀 Conducting the full development orchestra..."
            COMMAND="docker compose up -d"
            ;;
        "Dante, stop orchestra"|"stop orchestra"|"stop all"|"down")
            SUCCESS_MSG="🛑 Gracefully ending the symphony..."
            COMMAND="docker compose down"
            ;;
        "Dante, show containers"|"show containers"|"containers"|"ps")
            SUCCESS_MSG="📊 Displaying container ensemble status..."
            COMMAND="docker ps"
            ;;
        "Dante, run tests"|"run tests"|"test"|"tests")
            SUCCESS_MSG="🧪 Testing with collective wisdom..."
            COMMAND="npm run test:all"
            ;;
        "Dante, git status"|"git status"|"status")
            SUCCESS_MSG="📋 Checking repository harmony..."
            COMMAND="git status"
            ;;
        "Dante, show logs"|"show logs"|"logs")
            SUCCESS_MSG="📜 Revealing the chronicles of our journey..."
            COMMAND="find ~/.dante-voice-chip/logs -name '*.log' 2>/dev/null | head -10 | xargs ls -lh 2>/dev/null || echo 'No logs found - start the agent to create logs'"
            ;;
        "Dante, build all"|"build all"|"build")
            SUCCESS_MSG="🔨 Building entire project with Ubuntu excellence..."
            COMMAND="npm run build:all"
            ;;
        "Dante, dev mode"|"dev"|"development"|"start dev")
            SUCCESS_MSG="💻 Starting development environment..."
            COMMAND="npm run dev"
            ;;
        "Dante, deploy"|"deploy")
            SUCCESS_MSG="🌐 Deploying with cultural pride to the world..."
            COMMAND="npm run deploy"
            ;;
        "Dante, clean"|"clean")
            SUCCESS_MSG="🧹 Cleansing workspace with Ubuntu mindfulness..."
            COMMAND="npm run clean"
            ;;
        "Dante, help"|"help"|"commands"|"what can you do")
            show_help
            return 0
            ;;
        "Dante, wisdom"|"wisdom"|"ubuntu")
            show_ubuntu_wisdom
            return 0
            ;;
        "exit"|"quit"|"bye"|"farewell")
            echo -e "${PURPLE}🌍 Until we meet again - Ubuntu guides our path forward!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}🤔 Dante didn't recognize: '${INPUT}'${NC}"
            echo -e "${CYAN}💡 Try 'help' to see available commands${NC}"
            return 1
            ;;
    esac
    
    echo -e "${GREEN}${SUCCESS_MSG}${NC}"
    echo -e "${BLUE}🔄 Executing: ${COMMAND}${NC}"
    echo ""
    
    # Execute the command
    eval "$COMMAND"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Command completed with Ubuntu excellence!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Challenge encountered - Ubuntu wisdom guides us forward${NC}"
    fi
}

# 📚 Help system with cultural context
show_help() {
    echo -e "${YELLOW}🎯 Available Dante Commands (Ubuntu Excellence):${NC}"
    echo ""
    echo -e "${CYAN}🐳 Docker Orchestra:${NC}"
    echo "  • rebuild frontend    → Build frontend container"
    echo "  • rebuild backend     → Build backend container" 
    echo "  • start orchestra     → Start all services"
    echo "  • stop orchestra      → Stop all services"
    echo "  • show containers     → List running containers"
    echo ""
    echo -e "${CYAN}💻 Development:${NC}"
    echo "  • run tests          → Execute test suite"
    echo "  • build all          → Build entire project"
    echo "  • dev mode           → Start development server"
    echo "  • deploy             → Deploy to production"
    echo "  • clean              → Clean workspace"
    echo ""
    echo -e "${CYAN}📊 Information:${NC}"
    echo "  • git status         → Check repository status"
    echo "  • show logs          → Display recent logs"
    echo "  • help               → Show this help"
    echo "  • wisdom             → Ubuntu philosophy"
    echo ""
    echo -e "${PURPLE}💡 Usage: Type naturally - 'Dante, ' prefix optional${NC}"
    echo -e "${PURPLE}🌍 Ubuntu Spirit: 'I am because we are'${NC}"
}

# 🌍 Enhanced Ubuntu wisdom with rotation
show_ubuntu_wisdom() {
    local WISDOM=(
        "🌍 'I am because we are' - Our code strengthens through collaboration"
        "🤝 'A person is a person through other persons' - Community-driven development"
        "🎼 'When spider webs unite, they can tie up a lion' - Collective coding power"
        "🌱 'However far the stream flows, it never forgets its source' - Honor our roots"
        "✊🏿 'If you want to go fast, go alone. If you want to go far, go together' - Team excellence"
        "🎯 'Unity is strength, division is weakness' - Monorepo philosophy"
        "🚀 'The best time to plant a tree was 20 years ago. The second best time is now' - Start coding!"
        "🔥 'A single bracelet does not jingle' - Collaboration makes the music"
        "🎨 'The wise create proverbs for fools to learn, not to repeat' - Innovation through tradition"
        "💡 'Knowledge is like a garden: if it is not cultivated, it cannot be harvested' - Continuous learning"
        "🌟 'He who learns, teaches' - Share your Ubuntu knowledge"
        "🎵 'When the roots of a tree begin to decay, it spreads death to the branches' - Strong foundations matter"
    )
    
    local RANDOM_INDEX=$((RANDOM % ${#WISDOM[@]}))
    echo -e "${PURPLE}${WISDOM[$RANDOM_INDEX]}${NC}"
    echo ""
    echo -e "${CYAN}Ubuntu Philosophy guides our development with wisdom and excellence.${NC}"
}
# 📊 Session statistics display
show_session_stats() {
    local session_time=$(($(date +%s) - $(date -j -f "%Y%m%d_%H%M%S" "$SESSION_ID" "+%s" 2>/dev/null || echo "0")))
    local session_minutes=$((session_time / 60))
    
    echo -e "${BRIGHT_YELLOW}📊 Ubuntu Development Session Statistics${NC}"
    echo ""
    echo -e "${CYAN}🎯 Session ID:${NC} $SESSION_ID"
    echo -e "${CYAN}⏱️  Active Time:${NC} ${session_minutes} minutes"
    echo -e "${CYAN}🎼 Commands Run:${NC} $COMMAND_COUNT"
    echo -e "${CYAN}📝 Log Location:${NC} $DANTE_LOG_FILE"
    echo ""
    if [ -f "$DANTE_LOG_FILE" ]; then
        echo -e "${GREEN}Recent Ubuntu Command Activity:${NC}"
        tail -5 "$DANTE_LOG_FILE" | sed 's/^/  /'
    fi
    echo ""
    echo -e "${PURPLE}🌍 Ubuntu productivity through collective excellence!${NC}"
}

# 📚 Command history with Ubuntu context
show_command_history() {
    echo -e "${BRIGHT_CYAN}📚 Ubuntu Command History - Recent Wisdom${NC}"
    echo ""
    if [ -f "$DANTE_HISTORY_FILE" ]; then
        echo -e "${GREEN}Last 10 Ubuntu Commands:${NC}"
        tail -10 "$DANTE_HISTORY_FILE" | nl -s '. ' | sed 's/^/  /'
    else
        echo -e "${YELLOW}💡 No command history yet - start your Ubuntu journey!${NC}"
    fi
    echo ""
    echo -e "${PURPLE}🎼 'I am because we are' - Our shared command history builds collective wisdom${NC}"
}

# 👋 Ubuntu farewell with session summary
show_ubuntu_farewell() {
    echo ""
    echo -e "${PURPLE}🌍 Ubuntu Development Session Complete${NC}"
    echo ""
    echo -e "${CYAN}📊 Session Summary:${NC}"
    echo -e "${GREEN}  • Commands Executed: $COMMAND_COUNT${NC}"
    echo -e "${GREEN}  • Session Duration: $(($(date +%s) - $(date -j -f "%Y%m%d_%H%M%S" "$SESSION_ID" "+%s" 2>/dev/null || echo "0"))) seconds${NC}"
    echo -e "${GREEN}  • Ubuntu Wisdom Shared: Together we achieved excellence${NC}"
    echo ""
    echo -e "${BRIGHT_YELLOW}🎼 'Until we meet again - Ubuntu guides our path forward!'${NC}"
    echo -e "${PURPLE}    May your code flourish with collective wisdom${NC}"
    echo ""
}

# 🎮 Enhanced Interactive REPL with Ubuntu Excellence
enhanced_interactive_mode() {
    show_ubuntu_banner
    echo -e "${CYAN}🎼 Starting Enhanced Ubuntu Development REPL...${NC}"
    echo -e "${GREEN}💡 Type 'help' for commands, 'wisdom' for Ubuntu philosophy, 'exit' to leave${NC}"
    echo ""
    
    while true; do
        # Ubuntu-styled prompt with color
        echo -n -e "${BRIGHT_YELLOW}ubuntu@dante${NC}:${BRIGHT_BLUE}$(basename $(pwd))${NC}$ "
        read -r user_input
        
        # Handle empty input
        if [[ -z "$user_input" ]]; then
            continue
        fi
        
        # Clean input and convert to lowercase for matching
        local clean_input=$(echo "$user_input" | tr '[:upper:]' '[:lower:]' | sed 's/dante,\s*//' | sed 's/^\s*//; s/\s*$//')
        
        # Log the command
        log_command "$user_input"
        
        # Handle exit commands
        case "$clean_input" in
            "exit"|"quit"|"bye"|"farewell")
                show_ubuntu_farewell
                return 0
                ;;
            "clear"|"cls"|"clear screen")
                clear
                show_ubuntu_banner
                continue
                ;;
            "help"|"commands"|"what can you do")
                show_enhanced_help
                continue
                ;;
            "wisdom"|"ubuntu"|"philosophy"|"quote")
                show_ubuntu_wisdom
                continue
                ;;
            "stats"|"session stats"|"command stats")
                show_session_stats
                continue
                ;;
            "history"|"command history"|"recent commands")
                show_command_history
                continue
                ;;
        esac
        
        # Execute command through enhanced processor
        execute_enhanced_command "$user_input"
        echo ""
    done
}

# 🚀 Enhanced main execution with auto-detection
main() {
    init_dante
    
    if [[ $# -eq 0 ]]; then
        # No arguments - start enhanced interactive mode
        enhanced_interactive_mode
    else
        # Arguments provided - execute single command
        local user_input="$*"
        log_command "$user_input"
        execute_enhanced_command "$user_input"
    fi
}

# � Ubuntu Excellence - Execute the main function
main "$@"