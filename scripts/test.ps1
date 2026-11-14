# Run the Python test suite in a Linux container (HA does not support
# running its test harness on Windows). Usage: pwsh scripts/test.ps1 [pytest args]

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path "$PSScriptRoot/..").Path
$image = 'ghcr.io/astral-sh/uv:python3.14-bookworm'

$inner = 'uv sync --locked && uv run --locked ruff check . && uv run --locked pytest ' + ($args -join ' ')
docker run --rm `
    -v "${repo}:/src" `
    -v ha-house-map-uv-cache:/root/.cache/uv `
    -e UV_PROJECT_ENVIRONMENT=/venv `
    -w /src $image bash -c $inner
exit $LASTEXITCODE
