@echo off
chcp 65001 > nul
echo --------------------------------------------------
echo AI入門メディア「AI Media」を起動しています...
echo ブラウザが自動的に開かない場合は、http://localhost:8000 にアクセスしてください。
echo --------------------------------------------------

REM ブラウザをバックグラウンドで開く
start http://localhost:8000

REM Pythonの簡易サーバーを起動
python -m http.server 8000
pause
