<#
.SYNOPSIS
  Builds and starts Audio Electronics Store in Docker.

.EXAMPLE
  .\scripts\docker-setup.ps1              # production build (nginx) on http://localhost:8080
  .\scripts\docker-setup.ps1 -Dev         # Vite dev server with hot reload on http://localhost:5173
  .\scripts\docker-setup.ps1 -Port 3000
  .\scripts\docker-setup.ps1 -Stop        # stop and remove containers
  .\scripts\docker-setup.ps1 -Logs        # follow container logs
#>
param(
  [switch]$Dev,
  [int]$Port,
  [switch]$Stop,
  [switch]$Logs
)

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

function Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "OK  $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "ERR $msg" -ForegroundColor Red; exit 1 }

# --- Prerequisites ---
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Fail 'Docker is not installed. Get Docker Desktop from https://docs.docker.com/get-docker/'
}
docker info *> $null
if ($LASTEXITCODE -ne 0) { Fail 'Docker daemon is not running. Start Docker Desktop and try again.' }
docker compose version *> $null
if ($LASTEXITCODE -ne 0) { Fail "Docker Compose v2 is required ('docker compose'). Update Docker Desktop." }
Ok "Docker $(docker version --format '{{.Server.Version}}') is ready"

$compose = @('compose', '--profile', 'dev')

if ($Stop) {
  Info 'Stopping containers...'
  docker @compose down
  Ok 'Stopped'
  exit 0
}
if ($Logs) {
  docker @compose logs -f
  exit $LASTEXITCODE
}

# --- Start ---
if ($Dev) {
  $service = 'dev'
  if ($Port) { $env:DEV_PORT = $Port } elseif (-not $env:DEV_PORT) { $env:DEV_PORT = 5173 }
  $url = "http://localhost:$($env:DEV_PORT)"
} else {
  $service = 'app'
  if ($Port) { $env:APP_PORT = $Port } elseif (-not $env:APP_PORT) { $env:APP_PORT = 8080 }
  $url = "http://localhost:$($env:APP_PORT)"
}

Info "Building and starting '$service' (this can take a few minutes the first time)..."
docker @compose up -d --build $service
if ($LASTEXITCODE -ne 0) { Fail 'docker compose up failed. See the output above.' }

Info "Waiting for $url ..."
for ($i = 0; $i -lt 60; $i++) {
  try {
    Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 | Out-Null
    Ok "Audio Electronics Store is running at $url"
    Write-Host '   Logs: .\scripts\docker-setup.ps1 -Logs'
    Write-Host '   Stop: .\scripts\docker-setup.ps1 -Stop'
    exit 0
  } catch {
    Start-Sleep -Seconds 2
  }
}

docker @compose logs --tail 50 $service
Fail "The app did not respond at $url within 2 minutes. See the logs above."
