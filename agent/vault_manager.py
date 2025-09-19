#!/usr/bin/env python3
"""
Dante Voice Chip - Vault Manager
Manages encrypted storage and data access
"""

import os
import json
import sqlite3
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import hashlib
import base64

class VaultManager:
    def __init__(self, vault_dir, encryption_key_path):
        self.vault_dir = vault_dir
        self.db_path = os.path.join(vault_dir, 'sessions.db')
        
        # Load encryption key
        with open(encryption_key_path, 'rb') as f:
            key = f.read()
        self.cipher = Fernet(key)
        
    def get_daily_stats(self, date=None):
        """Get statistics for a specific date"""
        if date is None:
            date = datetime.now().date()
            
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute('''
            SELECT command_count, error_count, active_minutes, unique_directories
            FROM daily_stats WHERE date = ?
        ''', (date,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                'commands_today': result[0],
                'errors_today': result[1],
                'active_minutes': result[2],
                'unique_directories': result[3]
            }
        return {
            'commands_today': 0,
            'errors_today': 0,
            'active_minutes': 0,
            'unique_directories': 0
        }
        
    def get_recent_commands(self, limit=50):
        """Get recent commands"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute('''
            SELECT timestamp, command, exit_code, working_directory, encrypted_output
            FROM commands 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        commands = []
        for row in cursor.fetchall():
            timestamp, command, exit_code, working_dir, encrypted_output = row
            
            # Decrypt output if available
            output = ""
            if encrypted_output:
                try:
                    output = self.cipher.decrypt(encrypted_output).decode()
                except Exception:
                    output = "[DECRYPTION_ERROR]"
                    
            commands.append({
                'id': hashlib.md5(f"{timestamp}{command}".encode()).hexdigest()[:8],
                'timestamp': timestamp,
                'command': command,
                'exit_code': exit_code,
                'directory': working_dir,
                'output': output[:500] if output else ""  # Truncate for API
            })
            
        conn.close()
        return commands
        
    def search_commands(self, query, date_range=None):
        """Search commands by query"""
        conn = sqlite3.connect(self.db_path)
        
        sql = '''
            SELECT timestamp, command, exit_code, working_directory
            FROM commands 
            WHERE command LIKE ?
        '''
        params = [f'%{query}%']
        
        if date_range:
            sql += ' AND timestamp BETWEEN ? AND ?'
            params.extend(date_range)
            
        sql += ' ORDER BY timestamp DESC LIMIT 100'
        
        cursor = conn.execute(sql, params)
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                'timestamp': row[0],
                'command': row[1],
                'exit_code': row[2],
                'directory': row[3]
            }
            for row in results
        ]
        
    def export_data(self, start_date, end_date, output_file):
        """Export data for a date range"""
        conn = sqlite3.connect(self.db_path)
        
        # Export commands
        cursor = conn.execute('''
            SELECT * FROM commands 
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp
        ''', (start_date, end_date))
        
        commands = cursor.fetchall()
        
        # Export daily stats
        cursor = conn.execute('''
            SELECT * FROM daily_stats 
            WHERE date BETWEEN ? AND ?
            ORDER BY date
        ''', (start_date.date(), end_date.date()))
        
        stats = cursor.fetchall()
        conn.close()
        
        # Create export data
        export_data = {
            'export_date': datetime.now().isoformat(),
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'commands': commands,
            'daily_stats': stats
        }
        
        # Write to file
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2, default=str)
            
        return len(commands)
        
    def get_command_frequency(self, days=7):
        """Get command frequency analysis"""
        start_date = datetime.now() - timedelta(days=days)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute('''
            SELECT command, COUNT(*) as frequency
            FROM commands 
            WHERE timestamp > ?
            GROUP BY command
            ORDER BY frequency DESC
            LIMIT 20
        ''', (start_date,))
        
        results = cursor.fetchall()
        conn.close()
        
        return [{'command': row[0], 'frequency': row[1]} for row in results]
        
    def get_error_analysis(self, days=7):
        """Get error analysis"""
        start_date = datetime.now() - timedelta(days=days)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute('''
            SELECT command, COUNT(*) as error_count
            FROM commands 
            WHERE timestamp > ? AND exit_code != 0
            GROUP BY command
            ORDER BY error_count DESC
            LIMIT 10
        ''', (start_date,))
        
        results = cursor.fetchall()
        conn.close()
        
        return [{'command': row[0], 'error_count': row[1]} for row in results]

if __name__ == "__main__":
    vault_dir = os.path.expanduser("~/.dante-voice-chip/vault")
    key_path = os.path.expanduser("~/.dante-voice-chip/encryption.key")
    
    vault = VaultManager(vault_dir, key_path)
    
    # Example usage
    print("Today's stats:", vault.get_daily_stats())
    print("Recent commands:", len(vault.get_recent_commands()))
    print("Command frequency:", vault.get_command_frequency())