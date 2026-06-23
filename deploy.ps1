# FlightWatch - Deploy Script (PowerShell)
# Execute: PowerShell -ExecutionPolicy Bypass -File .\deploy.ps1

Write-Host "FlightWatch Deploy Script v2.0.0" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# 1. Verifica Supabase CLI
Write-Host "`n[1/5] Verificando Supabase CLI..." -ForegroundColor Yellow
$sbVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Supabase CLI nao encontrado." -ForegroundColor Red
    exit 1
}
Write-Host "OK: Supabase CLI $sbVersion" -ForegroundColor Green

# 2. Deploy Edge Functions
Write-Host "`n[2/5] Deploy das Edge Functions..." -ForegroundColor Yellow

Write-Host "  Deploying search-flights..." -ForegroundColor Gray
supabase functions deploy search-flights --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no deploy de search-flights" -ForegroundColor Red
    exit 1
}
Write-Host "  OK: search-flights deployed" -ForegroundColor Green

Write-Host "  Deploying ai-recommendations..." -ForegroundColor Gray
supabase functions deploy ai-recommendations --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no deploy de ai-recommendations" -ForegroundColor Red
    exit 1
}
Write-Host "  OK: ai-recommendations deployed" -ForegroundColor Green

# 3. Build do frontend (Vite -> dist/)
Write-Host "`n[3/5] Build do frontend (Vite)..." -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no npm ci" -ForegroundColor Red
    exit 1
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build (npm run build)" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Build gerado em dist/" -ForegroundColor Green

# 4. Git commit e push (CI/Pages publica dist/)
Write-Host "`n[4/5] Git commit e push..." -ForegroundColor Yellow
git add .
git commit -m "chore: deploy FlightWatch v2.0.0 (React + Vite + Tailwind v4)"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no git push" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Push realizado" -ForegroundColor Green

# 5. Resumo
Write-Host "`n[5/5] Deploy concluido!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "OK: Edge Functions no Supabase" -ForegroundColor Green
Write-Host "OK: Frontend buildado (dist/) e enviado ao GitHub" -ForegroundColor Green
Write-Host "`nProximos passos:" -ForegroundColor Yellow
Write-Host "  1. Configure GitHub Pages para publicar via Actions (vite build -> dist/)" -ForegroundColor Gray
Write-Host "  2. Garanta que o base path e /flypromo/ (ja configurado no vite.config.ts)" -ForegroundColor Gray
Write-Host "  3. Acesse https://rafaelandrade88.github.io/flypromo/" -ForegroundColor Gray
