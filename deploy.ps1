# FlightWatch — Deploy Script (PowerShell)
# Execute na pasta raiz do projeto: .\deploy.ps1
# Versão: 1.2.0

Write-Host "🚀 FlightWatch Deploy Script v1.2.0" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# ── 1. Verifica Supabase CLI ──────────────────────────────────────────────────
Write-Host "`n[1/4] Verificando Supabase CLI..." -ForegroundColor Yellow
$sbVersion = supabase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase CLI não encontrado. Instale com: scoop install supabase" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Supabase CLI: $sbVersion" -ForegroundColor Green

# ── 2. Deploy Edge Functions ──────────────────────────────────────────────────
Write-Host "`n[2/4] Deploy das Edge Functions..." -ForegroundColor Yellow

Write-Host "  → Deploying search-flights..." -ForegroundColor Gray
supabase functions deploy search-flights --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer deploy de search-flights" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ search-flights deployed" -ForegroundColor Green

Write-Host "  → Deploying ai-recommendations..." -ForegroundColor Gray
supabase functions deploy ai-recommendations --no-verify-jwt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer deploy de ai-recommendations" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ ai-recommendations deployed" -ForegroundColor Green

# ── 3. Git commit e push ──────────────────────────────────────────────────────
Write-Host "`n[3/4] Git commit & push..." -ForegroundColor Yellow
git add .
git commit -m "feat: FlightWatch v1.2.0 - SerpApi Google Flights integration"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no git push" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Push realizado com sucesso" -ForegroundColor Green

# ── 4. Resumo ─────────────────────────────────────────────────────────────────
Write-Host "`n[4/4] Deploy concluído!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Edge Functions: Supabase" -ForegroundColor Green
Write-Host "✅ Frontend: GitHub Pages (aguarde ~2min para propagar)" -ForegroundColor Green
Write-Host "`n📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Acesse seu projeto no Supabase Dashboard" -ForegroundColor Gray
Write-Host "  2. Verifique Edge Functions → Logs para monitorar erros" -ForegroundColor Gray
Write-Host "  3. Acesse o app via GitHub Pages para testar" -ForegroundColor Gray
