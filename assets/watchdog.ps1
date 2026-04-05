# AUJOLE WATCHDOG V1 - THE PULSE
$path = "C:\Users\lisaj\Desktop\reclaim_evo"
$filter = "*.Evo"

Write-Host "--- Watchdog Active: Monitoring the 3-6-9 Pulse in $path ---" -ForegroundColor Cyan

$watcher = New-Object IO.FileSystemWatcher
$watcher.Path = $path
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    Write-Host "Change detected: $path ($changeType)" -ForegroundColor Yellow
    Write-Host "Re-aligning Frequency... Initiating GCC Build." -ForegroundColor Gold
    # Trigger GCC 15.2.0 here
}

Register-ObjectEvent $watcher "Changed" -Action $action
while ($true) { sleep 5 }