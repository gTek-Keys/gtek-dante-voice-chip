#!/usr/bin/env python3
"""
Dante Voice Chip - Terminal Monitor
Real-time terminal session monitoring with encryption and analysis
"""

import os
import json
import sqlite3
import subprocess
import psutil
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from cryptography.fernet import Fernet
import logging

class TerminalMonitor:
    def __init__(self, config_path="config.json"):
        self.config = self.load_config(config_path)
        self.setup_logging()
        self.setup_encryption()
        self.setup_database()
        self.running = True
        
    def load_config(self, config_path):
        """Load configuration from JSON file"""
        with open(config_path, 'r') as f:
            return json.load(f)
            
    def setup_logging(self):
        """Setup logging configuration"""
        log_file = os.path.join(self.config['log_directory'], 'monitor.log')
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def setup_encryption(self):
        """Setup encryption for sensitive data"""
        key_file = os.path.join(os.path.dirname(self.config['vault_directory']), 'encryption.key')
        with open(key_file, 'rb') as f:
            key = f.read()
        self.cipher = Fernet(key)
        
    def setup_database(self):
        """Initialize SQLite database for logs"""
        db_path = os.path.join(self.config['vault_directory'], 'sessions.db')
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        
        # Create tables
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE,
                start_time TIMESTAMP,
                end_time TIMESTAMP,
                terminal_type TEXT,
                working_directory TEXT,
                user_name TEXT,
                encrypted_data BLOB
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS commands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                timestamp TIMESTAMP,
                command TEXT,
                exit_code INTEGER,
                working_directory TEXT,
                output_hash TEXT,
                encrypted_output BLOB,
                FOREIGN KEY (session_id) REFERENCES sessions (session_id)
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS daily_stats (
                date DATE PRIMARY KEY,
                command_count INTEGER,
                error_count INTEGER,
                active_minutes INTEGER,
                unique_directories INTEGER
            )
        ''')
        
        self.conn.commit()
        
    def get_active_terminal_sessions(self):
        """Get list of active terminal sessions"""
        sessions = []
        for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'create_time']):
            try:
                if proc.info['name'] in ['Terminal', 'iTerm2', 'zsh', 'bash', 'fish']:
                    sessions.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name'],
                        'cmdline': proc.info['cmdline'],
                        'start_time': datetime.fromtimestamp(proc.info['create_time'])
                    })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return sessions
        
    def monitor_command_execution(self):
        """Monitor command execution in real-time"""
        try:
            # Get shell history
            history_file = os.path.expanduser('~/.zsh_history')
            if not os.path.exists(history_file):
                history_file = os.path.expanduser('~/.bash_history')
                
            if os.path.exists(history_file):
                self.process_history_file(history_file)
                
        except Exception as e:
            self.logger.error(f"Error monitoring commands: {e}")
            
    def process_history_file(self, history_file):
        """Process shell history file for new commands"""
        try:
            with open(history_file, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                
            # Process recent commands (last 100)
            for line in lines[-100:]:
                line = line.strip()
                if line and not self.should_ignore_command(line):
                    self.record_command(line)
                    
        except Exception as e:
            self.logger.error(f"Error processing history: {e}")
            
    def should_ignore_command(self, command):
        """Check if command should be ignored"""
        ignored_commands = self.config.get('commands_to_ignore', [])
        return any(cmd in command.lower() for cmd in ignored_commands)
        
    def contains_sensitive_data(self, text):
        """Check if text contains sensitive information"""
        sensitive_patterns = self.config.get('sensitive_patterns', [])
        return any(pattern.lower() in text.lower() for pattern in sensitive_patterns)
        
    def record_command(self, command, exit_code=0, output=""):
        """Record a command execution"""
        try:
            session_id = self.get_current_session_id()
            timestamp = datetime.now()
            working_dir = os.getcwd()
            
            # Hash output for comparison
            output_hash = hashlib.sha256(output.encode()).hexdigest() if output else ""
            
            # Encrypt sensitive output
            encrypted_output = None
            if output and self.config.get('encryption_enabled', True):
                if self.contains_sensitive_data(output):
                    encrypted_output = self.cipher.encrypt(output.encode())
                    output = "[ENCRYPTED]"
                    
            # Store in database
            self.conn.execute('''
                INSERT INTO commands 
                (session_id, timestamp, command, exit_code, working_directory, output_hash, encrypted_output)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (session_id, timestamp, command, exit_code, working_dir, output_hash, encrypted_output))
            
            self.conn.commit()
            
            # Update daily stats
            self.update_daily_stats(timestamp, exit_code != 0)
            
            self.logger.info(f"Recorded command: {command[:50]}...")
            
        except Exception as e:
            self.logger.error(f"Error recording command: {e}")
            
    def get_current_session_id(self):
        """Generate or retrieve current session ID"""
        # Simple session ID based on terminal PID and start time
        return f"session_{os.getpid()}_{int(time.time())}"
        
    def update_daily_stats(self, timestamp, is_error):
        """Update daily statistics"""
        try:
            date = timestamp.date()
            
            # Get existing stats
            cursor = self.conn.execute(
                'SELECT command_count, error_count, active_minutes FROM daily_stats WHERE date = ?',
                (date,)
            )
            result = cursor.fetchone()
            
            if result:
                command_count, error_count, active_minutes = result
                command_count += 1
                if is_error:
                    error_count += 1
                    
                self.conn.execute('''
                    UPDATE daily_stats 
                    SET command_count = ?, error_count = ?, active_minutes = ?
                    WHERE date = ?
                ''', (command_count, error_count, active_minutes, date))
            else:
                self.conn.execute('''
                    INSERT INTO daily_stats (date, command_count, error_count, active_minutes, unique_directories)
                    VALUES (?, 1, ?, 1, 1)
                ''', (date, 1 if is_error else 0))
                
            self.conn.commit()
            
        except Exception as e:
            self.logger.error(f"Error updating daily stats: {e}")
            
    def cleanup_old_logs(self):
        """Remove old log entries based on retention policy"""
        try:
            retention_days = self.config.get('retention_days', 30)
            cutoff_date = datetime.now() - timedelta(days=retention_days)
            
            # Remove old commands
            self.conn.execute('DELETE FROM commands WHERE timestamp < ?', (cutoff_date,))
            
            # Remove old daily stats
            self.conn.execute('DELETE FROM daily_stats WHERE date < ?', (cutoff_date.date(),))
            
            self.conn.commit()
            self.logger.info(f"Cleaned up logs older than {retention_days} days")
            
        except Exception as e:
            self.logger.error(f"Error cleaning up logs: {e}")
            
    def run(self):
        """Main monitoring loop"""
        self.logger.info("Starting Dante Voice Chip Terminal Monitor")
        
        last_cleanup = datetime.now()
        
        while self.running:
            try:
                # Monitor command execution
                self.monitor_command_execution()
                
                # Cleanup old logs daily
                if (datetime.now() - last_cleanup).days >= 1:
                    self.cleanup_old_logs()
                    last_cleanup = datetime.now()
                    
                # Sleep before next check
                time.sleep(5)
                
            except KeyboardInterrupt:
                self.logger.info("Received interrupt signal, shutting down...")
                self.running = False
            except Exception as e:
                self.logger.error(f"Unexpected error in main loop: {e}")
                time.sleep(10)  # Wait before retrying
                
        self.cleanup()
        
    def cleanup(self):
        """Cleanup resources"""
        if hasattr(self, 'conn'):
            self.conn.close()
        self.logger.info("Terminal Monitor stopped")

if __name__ == "__main__":
    monitor = TerminalMonitor()
    monitor.run()