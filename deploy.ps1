# FlightWatch - Deploy Script (PowerShell)
# Execute: PowerShell -ExecutionPolicy Bypass -File .\deploy.ps1

Write-Host "FlightWatch Deploy Script v1.2.0" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# 1. Verifica Supabase CLI
Write-Host "`n[1/4] Verificando Supabase CLI..." -ForegroundColor Yellow
$sbVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Supabase CLI nao encontrado." -ForegroundColor Red
    exit 1
}
Write-Host "OK: Supabase CLI $sbVersion" -ForegroundColor Green

# 2. Deploy Edge Functions
Write-Host "`n[2/4] Deploy das Edge Functions..." -ForegroundColor Yellow

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

# 3. Git commit e push
Write-Host "`n[3/4] Git commit e push..." -ForegroundColor Yellow
git add .
git commit -m "feat: FlightWatch v1.2.0 - SerpApi Google Flights integration"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no git push" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Push realizado" -ForegroundColor Green

# 4. Resumo
Write-Host "`n[4/4] Deploy concluido!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "OK: Edge Functions no Supabase" -ForegroundColor Green
Write-Host "OK: Frontend no GitHub Pages (aguarde ~2min)" -ForegroundColor Green
Write-Host "`nProximos passos:" -ForegroundColor Yellow
Write-Host "  1. Acesse o Supabase Dashboard" -ForegroundColor Gray
Write-Host "  2. Verifique Edge Functions > Logs" -ForegroundColor Gray
Write-Host "  3. Teste o app via GitHub Pages" -ForegroundColor Gray