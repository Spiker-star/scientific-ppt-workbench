param([switch]$FetchUpstreams)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
Push-Location $repoRoot
try {
    $tools = Join-Path $repoRoot '.tools'
    $cache = Join-Path $repoRoot '.cache'
    New-Item -ItemType Directory -Force $tools,$cache | Out-Null
    $uvZip = Join-Path $tools 'uv.zip'
    $uvPath = Join-Path $tools 'uv/uv.exe'
    if (-not (Test-Path -LiteralPath $uvPath)) {
        Invoke-WebRequest 'https://github.com/astral-sh/uv/releases/download/0.9.5/uv-x86_64-pc-windows-msvc.zip' -OutFile $uvZip
        $expected = '515dc53d7553f1357d0abc1f70acd921fbb9e30230b1d9a08737236daa6ee920'
        if ((Get-FileHash -LiteralPath $uvZip -Algorithm SHA256).Hash -ne $expected) { throw 'uv archive checksum mismatch' }
        Expand-Archive -LiteralPath $uvZip -DestinationPath (Join-Path $tools 'uv') -Force
    }
    # These values apply only to this PowerShell process; no persistent PATH/registry changes.
    $env:UV_CACHE_DIR = $cache
    $env:UV_PYTHON_INSTALL_DIR = Join-Path $repoRoot '.runtime/python'
    $env:UV_NO_MODIFY_PATH = '1'
    & $uvPath python install 3.12.12 --no-bin --no-registry --no-config
    if ($LASTEXITCODE -ne 0) { throw 'Python download failed' }
    $python = Join-Path $repoRoot '.venv312/Scripts/python.exe'
    if (-not (Test-Path -LiteralPath $python)) {
        & $uvPath venv .venv312 --python .runtime/python/cpython-3.12.12-windows-x86_64-none/python.exe --no-config
        if ($LASTEXITCODE -ne 0) { throw 'Virtual environment creation failed' }
    }
    # Uses the committed hashed lock. Does not re-resolve or upgrade dependencies.
    & $uvPath pip sync env/requirements-win-py312.lock --python $python --require-hashes --only-binary :all: --index-url https://pypi.org/simple --no-config
    if ($LASTEXITCODE -ne 0) { throw 'Locked dependency installation failed' }
    if ($FetchUpstreams) {
        $auditDir = Join-Path (Split-Path $repoRoot -Parent) '.audit'
        New-Item -ItemType Directory -Force $auditDir | Out-Null
        $lock = Get-Content -LiteralPath (Join-Path $repoRoot 'skills.lock.json') -Raw | ConvertFrom-Json
        foreach ($skill in $lock.skills) {
            $name = ($skill.repo -split '/')[-1]
            $target = Join-Path $auditDir "$name-$($skill.commit)"
            if (-not (Test-Path -LiteralPath $target)) {
                $zip = Join-Path $cache "$name-$($skill.commit).zip"
                Invoke-WebRequest "https://codeload.github.com/$($skill.repo)/zip/$($skill.commit)" -OutFile $zip
                Expand-Archive -LiteralPath $zip -DestinationPath $auditDir
            }
        }
        & $python qa/verify_upstream.py
        if ($LASTEXITCODE -ne 0) { throw 'Pinned source verification failed' }
        & $python compat/prepare_academic.py
        if ($LASTEXITCODE -ne 0) { throw 'Compatibility preparation failed' }
    }
} finally { Pop-Location }
