<#
    Espera a que el servidor local responda y recien ahi abre el navegador.
    Se ejecuta en segundo plano desde iniciar-lynex.ps1.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $Url,
    [int] $SegundosMaximos = 180
)

$limite = (Get-Date).AddSeconds($SegundosMaximos)

while ((Get-Date) -lt $limite) {
    try {
        Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3 | Out-Null
        Start-Process $Url
        exit 0
    } catch [System.Net.WebException] {
        if ($null -ne $_.Exception.Response) {
            # El servidor ya contesta, aunque sea con un error de aplicacion.
            Start-Process $Url
            exit 0
        }
    } catch {
        # Todavia no levanto: se reintenta.
    }

    Start-Sleep -Milliseconds 600
}

exit 1
