# 🎼 Dante Usage Guide - Ubuntu Excellence

## ✅ **CORRECT Usage Examples**

### **Direct Script Usage** 
```bash
# Single commands with quotes
./dante.sh "Dante, show containers"
./dante.sh "rebuild frontend"
./dante.sh "git status"
./dante.sh wisdom

# Alternative phrasings work
./dante.sh "build frontend"         # Same as "rebuild frontend"
./dante.sh "containers"             # Same as "show containers"  
./dante.sh "ps"                     # Same as "show containers"
./dante.sh "status"                 # Same as "git status"
```

### **NPM Script Usage**
```bash
# Use these npm commands (NO comments in terminal!)
npm run dante:help
npm run dante:wisdom
npm run dante:interactive

# Pass commands through npm run dante
npm run dante -- "show containers"
npm run dante -- "rebuild frontend"
```

### **Interactive Mode**
```bash
# Start interactive session
./dante.sh
# OR
npm run dante:interactive

# Then type commands without quotes:
🎼 Dante> help
🎼 Dante> show containers
🎼 Dante> rebuild frontend
🎼 Dante> wisdom
🎼 Dante> exit
```

---

## ❌ **Common Mistakes to Avoid**

### **DON'T put comments after npm commands**
```bash
# ❌ WRONG - Shell tries to execute comments as commands
npm run dante:help # Show commands
npm run dante:wisdom # Ubuntu philosophy

# ✅ CORRECT - No comments in terminal
npm run dante:help
npm run dante:wisdom
```

### **DON'T run natural language directly in shell**
```bash
# ❌ WRONG - Shell doesn't understand natural language
Dante, rebuild frontend
show containers

# ✅ CORRECT - Use the dispatcher
./dante.sh "Dante, rebuild frontend"
./dante.sh "show containers"
```

### **DON'T forget quotes for multi-word commands**
```bash
# ❌ WRONG - Shell treats as separate arguments
./dante.sh Dante, rebuild frontend

# ✅ CORRECT - Quote the full command
./dante.sh "Dante, rebuild frontend"
```

---

## 🎯 **Quick Reference**

### **Most Common Commands**
```bash
./dante.sh "show containers"        # List Docker containers
./dante.sh "rebuild frontend"       # Build frontend container
./dante.sh "git status"            # Check repository status
./dante.sh wisdom                  # Ubuntu philosophy
./dante.sh help                    # Show all commands
```

### **NPM Shortcuts**
```bash
npm run dante:help                 # Show help
npm run dante:wisdom               # Ubuntu wisdom
npm run dante:interactive          # Start chat mode
```

### **Command Variations**
```bash
# These all do the same thing:
./dante.sh "Dante, rebuild frontend"
./dante.sh "rebuild frontend"  
./dante.sh "build frontend"

# These all show containers:
./dante.sh "Dante, show containers"
./dante.sh "show containers"
./dante.sh "containers"
./dante.sh "ps"
```

---

## 🌍 **Ubuntu Spirit Usage**

Remember: Every command carries Ubuntu wisdom!

```bash
./dante.sh "rebuild frontend"
# Output: 🎼 Rebuilding frontend with Afrocentric excellence...
# Result: ✅ Command completed with Ubuntu excellence!

./dante.sh wisdom
# Output: 🌍 'I am because we are' - Our code strengthens through collaboration
```

---

## 🎤 **Integration with Voice Control**

The Dante dispatcher works seamlessly with voice commands:

1. **Speak**: "Dante, rebuild frontend"
2. **Voice API**: Processes natural language
3. **Dispatcher**: Executes `./dante.sh "rebuild frontend"`
4. **Ubuntu Response**: Cultural excellence achieved!

---

**Ubuntu guides our development excellence!** 🎼🌍✊🏿