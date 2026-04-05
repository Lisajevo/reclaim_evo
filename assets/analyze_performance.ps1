# Engine Performance Analysis Tool
# Analyzes watchdog data to provide optimization recommendations

param(
    [string]$DataPath = "$PSScriptRoot\02_THE_FLESH\performance_data.json",
    [string]$OutputPath = "$PSScriptRoot\02_THE_FLESH\analysis_report.txt"
)

function Analyze-EnginePerformance {
    if (!(Test-Path $DataPath)) {
        Write-Host "No performance data found at $DataPath" -ForegroundColor Red
        return
    }

    try {
        $data = Get-Content $DataPath -Raw | ConvertFrom-Json
        Write-Host "Loaded $($data.Count) data points for analysis" -ForegroundColor Green

        # Basic statistics
        $totalRuntime = ($data | Measure-Object -Property Runtime -Maximum).Maximum
        $engineUptime = ($data | Where-Object { $_.EngineRunning } | Measure-Object).Count
        $totalSamples = $data.Count
        $uptimePercentage = [math]::Round(($engineUptime / $totalSamples) * 100, 2)

        # Performance correlations
        $runningData = $data | Where-Object { $_.EngineRunning -and $_.Engine.CPU -gt 0 }

        $analysis = @"
ENGINE PERFORMANCE ANALYSIS REPORT
==================================

Data Overview:
- Total monitoring time: $([math]::Round($totalRuntime / 3600, 2)) hours
- Total data points: $totalSamples
- Engine uptime: $uptimePercentage%

System Resource Analysis:
"@

        if ($runningData.Count -gt 0) {
            $avgSystemCPU = ($runningData | Measure-Object -Property {$_.System.CPU} -Average).Average
            $avgEngineCPU = ($runningData | Measure-Object -Property {$_.Engine.CPU} -Average).Average
            $avgEngineMemory = ($runningData | Measure-Object -Property {$_.Engine.MemoryMB} -Average).Average
            $maxEngineMemory = ($runningData | Measure-Object -Property {$_.Engine.MemoryMB} -Maximum).Maximum

            $analysis += @"

Average System CPU during engine operation: $([math]::Round($avgSystemCPU, 2))%
Average Engine CPU usage: $([math]::Round($avgEngineCPU, 2))%
Average Engine Memory usage: $([math]::Round($avgEngineMemory, 2)) MB
Peak Engine Memory usage: $([math]::Round($maxEngineMemory, 2)) MB

Optimization Recommendations:
"@

            # CPU optimization suggestions
            if ($avgEngineCPU -gt 80) {
                $analysis += "- HIGH CPU USAGE: Consider optimizing engine algorithms or increasing CPU allocation`n"
            } elseif ($avgEngineCPU -lt 20) {
                $analysis += "- LOW CPU USAGE: Engine may be underutilized, consider increasing computational load`n"
            } else {
                $analysis += "- CPU USAGE OPTIMAL: Current CPU utilization is well-balanced`n"
            }

            # Memory optimization suggestions
            if ($maxEngineMemory -gt 1000) {
                $analysis += "- HIGH MEMORY USAGE: Consider implementing memory pooling or reducing data structures`n"
            } elseif ($avgEngineMemory -lt 100) {
                $analysis += "- LOW MEMORY USAGE: Memory allocation appears efficient`n"
            }

            # System correlation analysis
            $highLoadData = $runningData | Where-Object { $_.System.CPU -gt 90 }
            if ($highLoadData.Count -gt 0) {
                $analysis += "- SYSTEM CONTENTION: Engine performance may be affected by high system load`n"
                $analysis += "  Consider scheduling engine runs during low system usage periods`n"
            }

            # Runtime analysis
            $longRunningSessions = $data | Where-Object { $_.Runtime -gt 1800 } # 30+ minutes
            if ($longRunningSessions.Count -gt 0) {
                $analysis += "- LONG RUNNING SESSIONS: Engine benefits from extended runtime`n"
                $analysis += "  Consider increasing max runtime limit for better performance`n"
            }
        } else {
            $analysis += "`nNo engine runtime data available for detailed analysis`n"
        }

        $analysis += @"

Data Collection:
- Raw data stored in: $DataPath
- CSV metrics available in: $($DataPath -replace '\.json','.csv')
- Analysis generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Recommendations:
1. Review CPU/memory usage patterns to optimize resource allocation
2. Analyze correlation between system load and engine performance
3. Consider adjusting runtime limits based on performance data
4. Monitor for memory leaks or performance degradation over time
5. Use collected data to fine-tune engine parameters

"@

        $analysis | Out-File -FilePath $OutputPath -Encoding UTF8
        Write-Host "Analysis report saved to: $OutputPath" -ForegroundColor Green
        Write-Host $analysis

    } catch {
        Write-Host "ERROR: Failed to analyze performance data - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Run analysis
Analyze-EnginePerformance