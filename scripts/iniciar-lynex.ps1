<#
    Arranca el sitio Lynex en esta computadora y abre la portada.

    Prepara lo que falte (dependencias y .env.local), elige un puerto libre,
    levanta el servidor de desarrollo y abre el navegador cuando ya responde.
    Cerrar esta ventana o pulsar Ctrl+C detiene el servidor.
#>

[CmdletBinding()]
param(
    [int] $Puerto = 3000,
    [switch] $SinNavegador
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$Host.UI.RawUI.WindowTitle = 'Lynex - servidor local'

function Escribir($texto, $color = 'Gray') {
    Write-Host $texto -ForegroundColor $color
}

function Responde($url) {
    try {
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 | Out-Null
        return $true
    } catch [System.Net.WebException] {
        # Un 4xx/5xx también significa que hay un servidor escuchando.
        return $null -ne $_.Exception.Response
    } catch {
        return $false
    }
}

function PuertoOcupado($puerto) {
    $enUso = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
    return ($enUso | Where-Object { $_.Port -eq $puerto }).Count -gt 0
}

function TextoAleatorio($largo) {
    $alfabeto = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    $bytes = New-Object byte[] $largo
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    -join ($bytes | ForEach-Object { $alfabeto[$_ % $alfabeto.Length] })
}

Escribir ''
Escribir '  LYNEX' 'Cyan'
Escribir "  $raiz" 'DarkGray'
Escribir ''

# 1. Node.js -------------------------------------------------------------
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Escribir '  No se encontro Node.js.' 'Red'
    Escribir '  Instalalo desde https://nodejs.org (version 20.9 o superior) y volve a abrir este acceso directo.' 'Yellow'
    Read-Host '  Enter para cerrar'
    exit 1
}

$version = [int](((& node -v) -replace '^v', '') -split '\.')[0]
if ($version -lt 20) {
    Escribir "  Node.js $(& node -v) es demasiado antiguo. Se necesita 20.9 o superior." 'Red'
    Read-Host '  Enter para cerrar'
    exit 1
}
Escribir "  Node.js $(& node -v)" 'DarkGray'

# 2. Dependencias --------------------------------------------------------
if (-not (Test-Path (Join-Path $raiz 'node_modules'))) {
    Escribir '  Instalando dependencias (solo la primera vez, puede tardar unos minutos)...' 'Yellow'
    if (Test-Path (Join-Path $raiz 'package-lock.json')) { & npm ci } else { & npm install }
    if ($LASTEXITCODE -ne 0) {
        Escribir '  Fallo la instalacion de dependencias.' 'Red'
        Read-Host '  Enter para cerrar'
        exit 1
    }
}
Escribir '  Dependencias listas' 'DarkGray'

# 3. Variables de entorno ------------------------------------------------
$envLocal = Join-Path $raiz '.env.local'
$envEjemplo = Join-Path $raiz '.env.example'
$claveAdmin = $null

if (-not (Test-Path $envLocal) -and (Test-Path $envEjemplo)) {
    $claveAdmin = TextoAleatorio 20
    $contenido = [System.IO.File]::ReadAllText($envEjemplo, [System.Text.Encoding]::UTF8)
    $contenido = $contenido -replace '(?m)^NEXT_PUBLIC_SITE_URL=.*$', "NEXT_PUBLIC_SITE_URL=http://localhost:$Puerto"
    $contenido = $contenido -replace '(?m)^ADMIN_PASSWORD=.*$', "ADMIN_PASSWORD=$claveAdmin"
    $contenido = $contenido -replace '(?m)^ADMIN_SESSION_SECRET=.*$', "ADMIN_SESSION_SECRET=$(TextoAleatorio 48)"
    $contenido = $contenido -replace '(?m)^RATE_LIMIT_SECRET=.*$', "RATE_LIMIT_SECRET=$(TextoAleatorio 48)"
    # Sin BOM: el lector de .env de Next.js no lo tolera en la primera clave.
    [System.IO.File]::WriteAllText($envLocal, $contenido, (New-Object System.Text.UTF8Encoding($false)))
    Escribir '  Se creo .env.local con secretos nuevos' 'DarkGray'
}

# 4. Puerto --------------------------------------------------------------
$url = "http://localhost:$Puerto/"

if (PuertoOcupado $Puerto) {
    if (Responde $url) {
        Escribir "  Ya hay un servidor en $url; se abre el navegador y listo." 'Green'
        if (-not $SinNavegador) { Start-Process $url }
        Start-Sleep -Seconds 2
        exit 0
    }

    $libre = $null
    foreach ($candidato in ($Puerto + 1)..($Puerto + 20)) {
        if (-not (PuertoOcupado $candidato)) { $libre = $candidato; break }
    }
    if (-not $libre) {
        Escribir "  No hay puertos libres entre $Puerto y $($Puerto + 20)." 'Red'
        Read-Host '  Enter para cerrar'
        exit 1
    }
    Escribir "  El puerto $Puerto esta ocupado por otro programa; se usa el $libre." 'Yellow'
    $Puerto = $libre
    $url = "http://localhost:$Puerto/"
}

# 5. Navegador -----------------------------------------------------------
if (-not $SinNavegador) {
    $esperar = Join-Path $PSScriptRoot 'abrir-navegador.ps1'
    Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -ArgumentList @(
        '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$esperar`"", '-Url', $url
    ) | Out-Null
}

Escribir ''
Escribir "  Portada       $url" 'Cyan'
Escribir "  Panel privado $($url)admin/pedidos" 'Cyan'
if ($claveAdmin) {
    Escribir "  Contrasena del panel: $claveAdmin" 'Yellow'
    Escribir '  (queda guardada en .env.local, que no se sube al repositorio)' 'DarkGray'
}
Escribir ''
Escribir '  Ctrl+C o cerrar esta ventana detiene el servidor.' 'DarkGray'
Escribir ''

# 6. Servidor ------------------------------------------------------------
& npm run dev -- --port $Puerto

Escribir ''
Escribir '  Servidor detenido.' 'DarkGray'
Start-Sleep -Seconds 2
