# AUJOLE WATCHDOG V2 - AUTOMATED RESONANCE ENGINE
# Automatically starts/stops engine.exe based on system conditions
# Records comprehensive performance data for engine optimization

$enginePath = "$PSScriptRoot\engine.exe"
$logPath = "$PSScriptRoot\02_THE_FLESH\watchdog.log"
$dataPath = "$PSScriptRoot\02_THE_FLESH\performance_data.json"
$metricsPath = "$PSScriptRoot\02_THE_FLESH\metrics.csv"
$maxRuntime = 3600  # 1 hour max runtime
$checkInterval = 30  # Check every 30 seconds
$dataRetentionDays = 30  # Keep data for 30 days

function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp | $message" | Out-File -FilePath $logPath -Append
    Write-Host "[$timestamp] $message" -ForegroundColor Cyan
}

function Start-Engine {
    if (!(Test-Path $enginePath)) {
        Write-Log "ERROR: engine.exe not found at $enginePath"
        return $false
    }

    if (Get-Process -Name "engine" -ErrorAction SilentlyContinue) {
        Write-Log "Engine already running"
        return $true
    }

    try {
        Start-Process -FilePath $enginePath -NoNewWindow
        Start-Sleep -Seconds 2
        if (Get-Process -Name "engine" -ErrorAction SilentlyContinue) {
            Write-Log "Engine started successfully"
            return $true
        } else {
            Write-Log "ERROR: Failed to start engine"
            return $false
        }
    } catch {
        Write-Log "ERROR: Exception starting engine - $($_.Exception.Message)"
        return $false
    }
}

function Stop-Engine {
    $process = Get-Process -Name "engine" -ErrorAction SilentlyContinue
    if ($process) {
        try {
            Stop-Process -Name "engine" -Force
            Write-Log "Engine stopped successfully"
            return $true
        } catch {
            Write-Log "ERROR: Failed to stop engine - $($_.Exception.Message)"
            return $false
        }
    } else {
        Write-Log "Engine not running"
        return $true
    }
}

function Get-SystemLoad {
    # Enhanced system metrics collection
    try {
        $cpu = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1 -ErrorAction Stop).CounterSamples.CookedValue
        $memory = Get-Counter '\Memory\% Committed Bytes In Use' -SampleInterval 1 -MaxSamples 1
        $memoryPercent = $memory.CounterSamples.CookedValue

        # Get disk usage
        $disk = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
        $diskUsedPercent = [math]::Round(($disk.Size - $disk.FreeSpace) / $disk.Size * 100, 2)

        # Get network activity (basic)
        $networkSent = (Get-Counter '\Network Interface(*)\Bytes Sent/sec' -SampleInterval 1 -MaxSamples 1).CounterSamples | Measure-Object -Property CookedValue -Sum
        $networkReceived = (Get-Counter '\Network Interface(*)\Bytes Received/sec' -SampleInterval 1 -MaxSamples 1).CounterSamples | Measure-Object -Property CookedValue -Sum

        return @{
            CPU = [math]::Round($cpu, 2)
            Memory = [math]::Round($memoryPercent, 2)
            DiskUsed = $diskUsedPercent
            NetworkSent = [math]::Round($networkSent.Sum / 1024, 2)  # KB/s
            NetworkReceived = [math]::Round($networkReceived.Sum / 1024, 2)  # KB/s
        }
    } catch {
        Write-Log "ERROR: Failed to collect system metrics - $($_.Exception.Message)"
        return @{
            CPU = 0
            Memory = 0
            DiskUsed = 0
            NetworkSent = 0
            NetworkReceived = 0
        }
    }
}

function Get-EngineMetrics {
    # Collect detailed engine process metrics
    $process = Get-Process -Name "engine" -ErrorAction SilentlyContinue
    if ($process) {
        try {
            $cpuTime = $process.CPU
            $memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
            $threads = $process.Threads.Count
            $handles = $process.HandleCount

            # Get process I/O if available
            $ioRead = 0
            $ioWrite = 0
            try {
                $ioCounters = Get-Counter "\Process(engine)\IO Read Bytes/sec" -SampleInterval 1 -MaxSamples 1 -ErrorAction SilentlyContinue
                if ($ioCounters) {
                    $ioRead = [math]::Round($ioCounters.CounterSamples.CookedValue / 1024, 2)
                }
                $ioCounters = Get-Counter "\Process(engine)\IO Write Bytes/sec" -SampleInterval 1 -MaxSamples 1 -ErrorAction SilentlyContinue
                if ($ioCounters) {
                    $ioWrite = [math]::Round($ioCounters.CounterSamples.CookedValue / 1024, 2)
                }
            } catch {
                # I/O counters may not be available
            }

            return @{
                CPU = [math]::Round($cpuTime, 2)
                MemoryMB = $memoryMB
                Threads = $threads
                Handles = $handles
                IOReadKB = $ioRead
                IOWriteKB = $ioWrite
                Status = "Running"
            }
        } catch {
            Write-Log "ERROR: Failed to collect engine metrics - $($_.Exception.Message)"
            return @{
                CPU = 0
                MemoryMB = 0
                Threads = 0
                Handles = 0
                IOReadKB = 0
                IOWriteKB = 0
                Status = "Error"
            }
        }
    } else {
        return @{
            CPU = 0
            MemoryMB = 0
            Threads = 0
            Handles = 0
            IOReadKB = 0
            IOWriteKB = 0
            Status = "Stopped"
        }
    }
}

function Write-PerformanceData {
    param([hashtable]$systemMetrics, [hashtable]$engineMetrics, [bool]$engineRunning, [double]$runtime)

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $unixTimestamp = [math]::Round((Get-Date -UFormat %s), 0)

    $dataPoint = @{
        Timestamp = $timestamp
        UnixTime = $unixTimestamp
        Runtime = [math]::Round($runtime, 2)
        EngineRunning = $engineRunning
        System = $systemMetrics
        Engine = $engineMetrics
    }

    # Append to CSV for analysis
    $csvLine = "$timestamp,$unixTimestamp,$([math]::Round($runtime, 2)),$engineRunning,"
    $csvLine += "$($systemMetrics.CPU),$($systemMetrics.Memory),$($systemMetrics.DiskUsed),$($systemMetrics.NetworkSent),$($systemMetrics.NetworkReceived),"
    $csvLine += "$($engineMetrics.CPU),$($engineMetrics.MemoryMB),$($engineMetrics.Threads),$($engineMetrics.Handles),$($engineMetrics.IOReadKB),$($engineMetrics.IOWriteKB),$($engineMetrics.Status)"

    try {
        $csvLine | Out-File -FilePath $metricsPath -Append -Encoding UTF8
    } catch {
        Write-Log "ERROR: Failed to write CSV data - $($_.Exception.Message)"
    }

    # Store structured data for advanced analysis
    try {
        $existingData = @()
        if (Test-Path $dataPath) {
            $existingData = Get-Content $dataPath -Raw | ConvertFrom-Json
        }

        $existingData += $dataPoint

        # Keep only last 30 days of data
        $cutoffDate = (Get-Date).AddDays(-$dataRetentionDays)
        $existingData = $existingData | Where-Object {
            [DateTime]::Parse($_.Timestamp) -gt $cutoffDate
        }

        $existingData | ConvertTo-Json -Depth 10 | Out-File -FilePath $dataPath -Encoding UTF8
    } catch {
        Write-Log "ERROR: Failed to write JSON data - $($_.Exception.Message)"
    }
}

function Analyze-PerformanceTrends {
    # Analyze collected data for optimization insights
    if (!(Test-Path $dataPath)) {
        return
    }

    try {
        $data = Get-Content $dataPath -Raw | ConvertFrom-Json

        if ($data.Count -lt 10) {
            return  # Need minimum data points for analysis
        }

        # Calculate averages and trends
        $runningData = $data | Where-Object { $_.EngineRunning }
        $cpuCorrelation = 0
        $memoryTrend = 0

        if ($runningData.Count -gt 5) {
            $avgSystemCPU = ($runningData | Measure-Object -Property {$_.System.CPU} -Average).Average
            $avgEngineCPU = ($runningData | Measure-Object -Property {$_.Engine.CPU} -Average).Average

            # Simple correlation analysis
            $correlations = $runningData | ForEach-Object {
                @{
                    SystemCPU = $_.System.CPU - $avgSystemCPU
                    EngineCPU = $_.Engine.CPU - $avgEngineCPU
                }
            }

            $numerator = ($correlations | Measure-Object -Property { $_.SystemCPU * $_.EngineCPU } -Sum).Sum
            $denom1 = [math]::Sqrt(($correlations | Measure-Object -Property { $_.SystemCPU * $_.SystemCPU } -Sum).Sum)
            $denom2 = [math]::Sqrt(($correlations | Measure-Object -Property { $_.EngineCPU * $_.EngineCPU } -Sum).Sum)

            if ($denom1 -ne 0 -and $denom2 -ne 0) {
                $cpuCorrelation = $numerator / ($denom1 * $denom2)
            }

            Write-Log "ANALYSIS: CPU correlation coefficient: $([math]::Round($cpuCorrelation, 3))"
        }

        # Memory usage trend
        $recentData = $data | Select-Object -Last 20
        if ($recentData.Count -gt 1) {
            $memoryValues = $recentData | ForEach-Object { $_.System.Memory }
            $memoryTrend = ($memoryValues | Select-Object -Last 1) - ($memoryValues | Select-Object -First 1)
            Write-Log "ANALYSIS: Memory trend (last 20 readings): $([math]::Round($memoryTrend, 2))%"
        }

    } catch {
        Write-Log "ERROR: Failed to analyze performance trends - $($_.Exception.Message)"
    }
}

# Create data directories if needed
$dataDir = Split-Path $dataPath -Parent
if (!(Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Initialize CSV header if file doesn't exist
if (!(Test-Path $metricsPath)) {
    "Timestamp,UnixTime,Runtime,EngineRunning,SystemCPU,SystemMemory,DiskUsed,NetworkSentKB,NetworkReceivedKB,EngineCPU,EngineMemoryMB,EngineThreads,EngineHandles,EngineIOReadKB,EngineIOWriteKB,EngineStatus" | Out-File -FilePath $metricsPath -Encoding UTF8
}

Write-Log "=== WATCHDOG STARTED ==="
Write-Log "Engine Path: $enginePath"
Write-Log "Data Path: $dataPath"
Write-Log "Metrics Path: $metricsPath"
Write-Log "Max Runtime: $maxRuntime seconds"
Write-Log "Check Interval: $checkInterval seconds"
Write-Log "Data Retention: $dataRetentionDays days"

$startTime = Get-Date
$engineRunning = $false
$analysisCounter = 0

while ($true) {
    $currentTime = Get-Date
    $timeSpan = $currentTime - $startTime
    $runtime = $timeSpan.TotalSeconds

    # Collect comprehensive system and engine metrics
    $systemMetrics = Get-SystemLoad
    $engineMetrics = Get-EngineMetrics

    # Record performance data
    Write-PerformanceData -systemMetrics $systemMetrics -engineMetrics $engineMetrics -engineRunning $engineRunning -runtime $runtime

    # Auto-start conditions (enhanced with memory consideration)
    $shouldStart = ($systemMetrics.CPU -lt 80) -and ($systemMetrics.Memory -lt 90) -and ($runtime -lt $maxRuntime)

    if ($shouldStart -and !$engineRunning) {
        Write-Log "Auto-starting engine (CPU: $($systemMetrics.CPU)%, Memory: $($systemMetrics.Memory)%, Runtime: $([math]::Round($runtime))s)"
        $engineRunning = Start-Engine
    }

    # Auto-stop conditions (enhanced)
    $shouldStop = ($systemMetrics.CPU -gt 95) -or ($systemMetrics.Memory -gt 95) -or ($runtime -gt $maxRuntime)

    if ($shouldStop -and $engineRunning) {
        Write-Log "Auto-stopping engine (CPU: $($systemMetrics.CPU)%, Memory: $($systemMetrics.Memory)%, Runtime: $([math]::Round($runtime))s)"
        $engineRunning = !(Stop-Engine)
    }

    # Enhanced status reporting
    if ($engineRunning) {
        Write-Log "Status: RUNNING (CPU: $($systemMetrics.CPU)%, Memory: $($systemMetrics.Memory)%, Engine CPU: $($engineMetrics.CPU), Engine Memory: $($engineMetrics.MemoryMB)MB, Runtime: $([math]::Round($runtime))s)"
    } else {
        Write-Log "Status: STOPPED (CPU: $($systemMetrics.CPU)%, Memory: $($systemMetrics.Memory)%, Runtime: $([math]::Round($runtime))s)"
    }

    # Periodic performance analysis
    $analysisCounter++
    if ($analysisCounter -ge 20) {  # Analyze every ~10 minutes (20 * 30s)
        Write-Log "Performing performance trend analysis..."
        Analyze-PerformanceTrends
        $analysisCounter = 0
    }

    Start-Sleep -Seconds $checkInterval
}