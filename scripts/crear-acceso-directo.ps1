<#
    Crea el acceso directo "Lynex" en el escritorio.

    Genera tambien el icono de marca (.ico) que usa el acceso directo.
    Se puede volver a ejecutar cuando haga falta: reemplaza lo anterior.
#>

[CmdletBinding()]
param(
    [string] $Nombre = 'Lynex'
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$lanzador = Join-Path $PSScriptRoot 'iniciar-lynex.ps1'

if (-not (Test-Path $lanzador)) {
    throw "No se encontro el lanzador en $lanzador"
}

# --- Icono de marca -----------------------------------------------------
Add-Type -AssemblyName System.Drawing

$lado = 256
$mapa = New-Object System.Drawing.Bitmap($lado, $lado)
$lienzo = [System.Drawing.Graphics]::FromImage($mapa)
$lienzo.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$fondo = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 13, 29))
$lienzo.FillRectangle($fondo, 0, 0, $lado, $lado)

$borde = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 29, 44, 67), 6)
$lienzo.DrawRectangle($borde, 3, 3, $lado - 6, $lado - 6)

# La L del wordmark, con el mismo trazo escuadrado del logotipo.
$trazo = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 231, 235, 239), 26)
$trazo.StartCap = [System.Drawing.Drawing2D.LineCap]::Square
$trazo.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
$lienzo.DrawLine($trazo, 80, 62, 80, 190)
$lienzo.DrawLine($trazo, 67, 190, 190, 190)

$acento = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 114, 230, 255))
$lienzo.FillRectangle($acento, 158, 62, 32, 32)

$lienzo.Dispose()

$flujo = New-Object System.IO.MemoryStream
$mapa.Save($flujo, [System.Drawing.Imaging.ImageFormat]::Png)
$png = $flujo.ToArray()
$flujo.Dispose()
$mapa.Dispose()

# Contenedor ICO con un unico PNG de 256x256 (soportado desde Windows Vista).
$ico = New-Object System.IO.MemoryStream
$escritor = New-Object System.IO.BinaryWriter($ico)
$escritor.Write([uint16]0)          # reservado
$escritor.Write([uint16]1)          # tipo: icono
$escritor.Write([uint16]1)          # cantidad de imagenes
$escritor.Write([byte]0)            # ancho 0 = 256
$escritor.Write([byte]0)            # alto 0 = 256
$escritor.Write([byte]0)            # colores de paleta
$escritor.Write([byte]0)            # reservado
$escritor.Write([uint16]1)          # planos
$escritor.Write([uint16]32)         # bits por pixel
$escritor.Write([uint32]$png.Length)
$escritor.Write([uint32]22)         # desplazamiento de los datos
$escritor.Write($png)
$escritor.Flush()

$rutaIcono = Join-Path $PSScriptRoot 'lynex.ico'
[System.IO.File]::WriteAllBytes($rutaIcono, $ico.ToArray())
$escritor.Dispose()
$ico.Dispose()

# --- Acceso directo -----------------------------------------------------
$escritorio = [Environment]::GetFolderPath('Desktop')
$rutaAcceso = Join-Path $escritorio "$Nombre.lnk"

$shell = New-Object -ComObject WScript.Shell
$acceso = $shell.CreateShortcut($rutaAcceso)
$acceso.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$acceso.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$lanzador`""
$acceso.WorkingDirectory = $raiz
$acceso.IconLocation = "$rutaIcono,0"
$acceso.Description = 'Inicia el sitio Lynex en esta computadora y abre la portada'
$acceso.WindowStyle = 1
$acceso.Save()

Write-Host ''
Write-Host "  Acceso directo creado: $rutaAcceso" -ForegroundColor Green
Write-Host "  Icono:                 $rutaIcono" -ForegroundColor DarkGray
Write-Host ''
