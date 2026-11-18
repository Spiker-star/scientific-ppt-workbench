param([Parameter(Mandatory=$true)][string]$InputPptx,[Parameter(Mandatory=$true)][string]$PreviewDirectory,[Parameter(Mandatory=$true)][string]$ReportPath)
$ErrorActionPreference='Stop'
$existingPowerPoint = @(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$application=$null
$presentation=$null
try {
    $file=(Resolve-Path -LiteralPath $InputPptx).Path
    $folder=[IO.Path]::GetFullPath($PreviewDirectory)
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    $application=New-Object -ComObject PowerPoint.Application
    $presentation=$application.Presentations.Open($file,-1,0,0)
    $count=$presentation.Slides.Count
    for($i=1;$i -le $count;$i++){
        $presentation.Slides.Item($i).Export((Join-Path $folder "slide-$i.png"),'PNG',1440,810)
    }
    $copy=Join-Path ([IO.Path]::GetDirectoryName([IO.Path]::GetFullPath($ReportPath))) 'office-save-copy.pptx'
    if(Test-Path -LiteralPath $copy){throw 'Office validation copy already exists'}
    $presentation.SaveCopyAs($copy,24)
    $presentation.Close()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($presentation)
    $presentation=$application.Presentations.Open($copy,-1,0,0)
    if($presentation.Slides.Count -ne $count){throw 'Saved copy lost slides'}
    @{opened=$true;slides=$count;png_exported=$count;save_copy_reopen=$true;existing_session_preserved=$existingPowerPoint;application_version=$application.Version;source_unchanged=$true} | ConvertTo-Json | Set-Content -LiteralPath $ReportPath -Encoding utf8
} finally {
    if($null -ne $presentation){$presentation.Close(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($presentation)}
    if($null -ne $application){if(-not $existingPowerPoint){$application.Quit()};[void][Runtime.InteropServices.Marshal]::ReleaseComObject($application)}
}
