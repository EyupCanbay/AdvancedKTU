#!/usr/bin/env pwsh
<#
.SYNOPSIS
    AdvancedKTU Multi-Service Docker Build Script
    
.DESCRIPTION
    Bu script ana dizindeki Dockerfile'ı kullanarak tüm mikroservisleri build eder.
    
.PARAMETER Service
    Belirli bir servis build et (authentication-service, waste-service, ai_service, frontend, admin)
    
.PARAMETER All
    Tüm servisleri build et
    
.PARAMETER Registry
    Docker registry adresi (örn: docker.io/username)
    
.PARAMETER Version
    Image version tag'i (default: latest)
    
.EXAMPLE
    # Tüm servisleri build et
    .\build-docker.ps1 -All
    
    # Belirli bir servis build et
    .\build-docker.ps1 -Service authentication-service
    
    # Registry ile build et
    .\build-docker.ps1 -All -Registry docker.io/advancedktu -Version 1.0.0

.AUTHOR
    AdvancedKTU Team
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$Service,
    
    [Parameter(Mandatory = $false)]
    [switch]$All,
    
    [Parameter(Mandatory = $false)]
    [string]$Registry = "advancedktu",
    
    [Parameter(Mandatory = $false)]
    [string]$Version = "latest",
    
    [Parameter(Mandatory = $false)]
    [switch]$Push,
    
    [Parameter(Mandatory = $false)]
    [switch]$NoCache
)

# Renkli çıktı için fonksiyonlar
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Servisler
$services = @{
    "authentication-service" = @{
        name     = "authentication-service"
        port     = 8080
        language = "Go"
    }
    "waste-service"          = @{
        name     = "waste-service"
        port     = 8081
        language = "Go"
    }
    "ai_service"             = @{
        name     = "ai_service"
        port     = 3000
        language = "Node.js"
    }
    "frontend"               = @{
        name     = "frontend"
        port     = 5174
        language = "React"
    }
    "admin"                  = @{
        name     = "admin"
        port     = 5173
        language = "React"
    }
}

# Build seçenekleri
$buildOptions = ""
if ($NoCache) {
    $buildOptions += "--no-cache "
}

# Build fonksiyonu
function Build-Service {
    param(
        [string]$ServiceName,
        [string]$DockerfilePath = "Dockerfile"
    )
    
    $imageName = "$($Registry.ToLower())-$ServiceName"
    $imageTag = "$imageName`:$Version"
    
    Write-Info "Building: $ServiceName"
    Write-Info "Image: $imageTag"
    
    # Build command
    $buildCmd = "docker build $buildOptions" +
                "-f `"$DockerfilePath`" " +
                "--target $ServiceName " +
                "-t $imageTag ."
    
    Write-Info "Running: $buildCmd"
    Invoke-Expression $buildCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$ServiceName build başarılı"
        
        # Latest tag'ini ekle
        if ($Version -ne "latest") {
            docker tag "$imageTag" "$imageName`:latest"
        }
        
        return $true
    }
    else {
        Write-Error "$ServiceName build başarısız (Exit Code: $LASTEXITCODE)"
        return $false
    }
}

# Ana işlem
Write-Info "AdvancedKTU Docker Build Script Başlatılıyor"
Write-Info "Registry: $Registry"
Write-Info "Version: $Version"

if ($All) {
    Write-Info "Mod: TÜM SERVİSLER"
    $servicesToBuild = $services.Keys
}
elseif ($Service) {
    if ($services.ContainsKey($Service)) {
        Write-Info "Mod: TEKIL SERVİS ($Service)"
        $servicesToBuild = @($Service)
    }
    else {
        Write-Error "Bilinmeyen servis: $Service"
        Write-Info "Mevcut servisler: $($services.Keys -join ', ')"
        exit 1
    }
}
else {
    Write-Warning "Ne -All ne de -Service parametresi sağlanmadı"
    Write-Info "Mevcut servisler:"
    foreach ($s in $services.GetEnumerator()) {
        Write-Info "  - $($s.Key) ($($s.Value.language), Port: $($s.Value.port))"
    }
    Write-Info "Kullanım: .\build-docker.ps1 -All"
    exit 0
}

# Build işlemleri
$results = @()
$startTime = Get-Date

foreach ($serviceName in $servicesToBuild) {
    $result = Build-Service -ServiceName $serviceName
    $results += @{
        service = $serviceName
        success = $result
    }
    Write-Host ""
}

# Özet
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "BUILD ÖZETİ" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_.success }).Count
$totalCount = $results.Count
$duration = (Get-Date) - $startTime

Write-Host "Başarılı: $successCount / $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "Süre: $($duration.TotalSeconds) saniye"
Write-Host ""

foreach ($result in $results) {
    $status = $result.success ? "✅" : "❌"
    Write-Host "$status $($result.service)"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Push işlemi (eğer istenirse)
if ($Push -and $successCount -eq $totalCount) {
    Write-Host ""
    Write-Info "Docker Push işlemi başlatılıyor..."
    
    foreach ($serviceName in $servicesToBuild) {
        $imageName = "$($Registry.ToLower())-$serviceName`:$Version"
        Write-Info "Pushing: $imageName"
        docker push $imageName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "$serviceName push başarılı"
        }
        else {
            Write-Error "$serviceName push başarısız"
        }
    }
}

# Sonlandır
if ($successCount -eq $totalCount) {
    Write-Success "Tüm build'ler başarılı!"
    
    # Sonraki adımları göster
    Write-Host ""
    Write-Host "Sonraki Adımlar:" -ForegroundColor Green
    Write-Host "1. Network oluştur:"
    Write-Host "   docker network create advancedktu-network"
    Write-Host ""
    Write-Host "2. Containerları çalıştır:"
    foreach ($serviceName in $servicesToBuild) {
        $port = $services[$serviceName].port
        $imageName = "$($Registry.ToLower())-$serviceName`:$Version"
        Write-Host "   docker run -d -p $port`:$port --network advancedktu-network --name $serviceName $imageName"
    }
    Write-Host ""
    Write-Host "veya docker-compose kullan:"
    Write-Host "   docker-compose up -d"
    
    exit 0
}
else {
    Write-Error "Bazı build'ler başarısız oldu"
    exit 1
}
