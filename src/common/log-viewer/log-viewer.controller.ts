import { Controller, Get, Query, Res, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { FileLoggerService } from '../file-logger/file-logger.service';

@ApiTags('logs')
@Controller('logs')
export class LogViewerController {
  constructor(private readonly fileLoggerService: FileLoggerService) {}

  @Get('view')
  @ApiOperation({ summary: 'View logs in web interface' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to display' })
  @ApiQuery({ name: 'level', required: false, type: String, description: 'Filter by log level' })
  @ApiQuery({ name: 'user', required: false, type: String, description: 'Filter by user national number' })
  async viewLogs(
    @Res() res: Response,
    @Query('limit') limit?: number,
    @Query('level') level?: string,
    @Query('user') user?: string
  ) {
    const html = this.generateLogViewerHTML(limit, level, user);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('raw')
  @ApiOperation({ summary: 'Get raw log data as JSON' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to retrieve' })
  @ApiQuery({ name: 'level', required: false, type: String, description: 'Filter by log level' })
  @ApiQuery({ name: 'user', required: false, type: String, description: 'Filter by user national number' })
  async getRawLogs(
    @Query('limit') limit?: number,
    @Query('level') level?: string,
    @Query('user') user?: string
  ) {
    let logs: string[] = [];

    if (level) {
      logs = await this.fileLoggerService.getLogsByLevel(level as any, limit || 50);
    } else if (user) {
      logs = await this.fileLoggerService.getLogsByUser(user, limit || 50);
    } else {
      logs = await this.fileLoggerService.getLogs(limit || 100, 0);
    }

    return {
      logs,
      count: logs.length,
      filters: { limit, level, user }
    };
  }

  @Get('clear')
  @ApiOperation({ summary: 'Clear all logs' })
  async clearLogs() {
    await this.fileLoggerService.clearLogs();
    return { message: 'Logs cleared successfully' };
  }
  //not my best work but it works for now :P
  private generateLogViewerHTML(limit?: number, level?: string, user?: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Logs</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            background-color: #1e1e1e;
            color: #ffffff;
        }
        .header {
            background-color: #2d2d2d;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .filters {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        label {
            font-size: 12px;
            color: #cccccc;
        }
        input, select, button {
            padding: 8px;
            border: 1px solid #555;
            border-radius: 4px;
            background-color: #3d3d3d;
            color: #ffffff;
        }
        button {
            background-color: #007acc;
            border: none;
            cursor: pointer;
            padding: 8px 16px;
        }
        button:hover {
            background-color: #005a9e;
        }
        .log-container {
            background-color: #2d2d2d;
            border-radius: 8px;
            padding: 20px;
            max-height: 70vh;
            overflow-y: auto;
        }
        .log-entry {
            margin-bottom: 8px;
            padding: 8px;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.4;
        }
        .log-entry.INFO {
            background-color: #1a3a1a;
            border-left: 4px solid #4caf50;
        }
        .log-entry.WARN {
            background-color: #3a2a1a;
            border-left: 4px solid #ff9800;
        }
        .log-entry.ERROR {
            background-color: #3a1a1a;
            border-left: 4px solid #f44336;
        }
        .log-entry.DEBUG {
            background-color: #1a1a3a;
            border-left: 4px solid #2196f3;
        }
        .timestamp {
            color: #888;
            font-size: 11px;
        }
        .level {
            font-weight: bold;
            margin: 0 8px;
        }
        .context {
            color: #ffd700;
            margin: 0 8px;
        }
        .user {
            color: #00ff00;
            margin: 0 8px;
        }
        .message {
            color: #ffffff;
        }
        .stats {
            background-color: #2d2d2d;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .refresh-btn {
            background-color: #28a745;
        }
        .refresh-btn:hover {
            background-color: #1e7e34;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Application Logs</h1>
        <div class="stats">
            <div>
                <strong>Log File:</strong> ${this.fileLoggerService.getLogFilePath()}
            </div>
            <button class="refresh-btn" onclick="loadLogs()">🔄 Refresh</button>
        </div>
    </div>

    <div class="filters">
        <div class="filter-group">
            <label>Limit:</label>
            <input type="number" id="limit" value="${limit || 100}" min="1" max="1000">
        </div>
        <div class="filter-group">
            <label>Level:</label>
            <select id="level">
                <option value="">All Levels</option>
                <option value="INFO" ${level === 'INFO' ? 'selected' : ''}>INFO</option>
                <option value="WARN" ${level === 'WARN' ? 'selected' : ''}>WARN</option>
                <option value="ERROR" ${level === 'ERROR' ? 'selected' : ''}>ERROR</option>
                <option value="DEBUG" ${level === 'DEBUG' ? 'selected' : ''}>DEBUG</option>
            </select>
        </div>
        <div class="filter-group">
            <label>User:</label>
            <input type="text" id="user" value="${user || ''}" placeholder="National Number">
        </div>
        <div class="filter-group">
            <label>&nbsp;</label>
            <button onclick="applyFilters()">🔍 Filter</button>
        </div>
        <div class="filter-group">
            <label>&nbsp;</label>
            <button onclick="clearLogs()" style="background-color: #dc3545;">🗑️ Clear Logs</button>
        </div>
    </div>

    <div class="log-container" id="logContainer">
        <div style="text-align: center; color: #888; padding: 20px;">
            Loading logs...
        </div>
    </div>

    <script>
        function loadLogs() {
            const limit = document.getElementById('limit').value;
            const level = document.getElementById('level').value;
            const user = document.getElementById('user').value;
            
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit);
            if (level) params.append('level', level);
            if (user) params.append('user', user);
            
            fetch('/api/logs/raw?' + params.toString())
                .then(response => response.json())
                .then(data => {
                    displayLogs(data.logs);
                })
                .catch(error => {
                    document.getElementById('logContainer').innerHTML = 
                        '<div style="color: #f44336; text-align: center; padding: 20px;">Error loading logs: ' + error.message + '</div>';
                });
        }

        function displayLogs(logs) {
            const container = document.getElementById('logContainer');
            
            if (logs.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">No logs found</div>';
                return;
            }

            const html = logs.map(log => {
                const parts = log.split(' ');
                const timestamp = parts[0] + ' ' + parts[1];
                const level = parts[2];
                const rest = parts.slice(3).join(' ');
                
                let context = '';
                let user = '';
                let message = rest;
                
                const contextMatch = rest.match(/\\[([^\\]]+)\\]/g);
                if (contextMatch) {
                    context = contextMatch[0];
                    message = message.replace(context, '').trim();
                }
                
                const userMatch = rest.match(/\\[([A-Z0-9]+)\\]/g);
                if (userMatch && userMatch.length > 1) {
                    user = userMatch[1];
                }
                
                return \`
                    <div class="log-entry \${level}">
                        <span class="timestamp">\${timestamp}</span>
                        <span class="level">\${level}</span>
                        \${context ? '<span class="context">' + context + '</span>' : ''}
                        \${user ? '<span class="user">[' + user + ']</span>' : ''}
                        <span class="message">\${message}</span>
                    </div>
                \`;
            }).join('');
            
            container.innerHTML = html;
        }

        function applyFilters() {
            const limit = document.getElementById('limit').value;
            const level = document.getElementById('level').value;
            const user = document.getElementById('user').value;
            
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit);
            if (level) params.append('level', level);
            if (user) params.append('user', user);
            
            window.location.href = '/api/logs/view?' + params.toString();
        }

        function clearLogs() {
            if (confirm('Are you sure you want to clear all logs?')) {
                fetch('/api/logs/clear', { method: 'GET' })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        loadLogs();
                    })
                    .catch(error => {
                        alert('Error clearing logs: ' + error.message);
                    });
            }
        }

        // Load logs on page load
        loadLogs();
        
        // Auto-refresh every 30 seconds
        setInterval(loadLogs, 30000);
    </script>
</body>
</html>
    `;
  }
}
