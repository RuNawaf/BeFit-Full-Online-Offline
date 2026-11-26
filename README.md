# BeFit - Full PC version

Includes the online HUMAIN voice version and the offline training version.

Windows 10/11 64-bit: install Node.js 20+, Python 3.13 64-bit, and Ollama.
In PowerShell, open this folder and run:

    npm ci
    python -m venv .venv
    .\.venv\Scripts\python.exe -m pip install --no-index --find-links=./wheels -r requirements-lock.txt
    ollama create qwen2.5:3b -f Modelfile

Open Ollama before the create command. Installation requires internet for npm dependencies. Models are included.
Start: npm start
Online: http://localhost:3001/
Offline: http://localhost:3001/offline

For HUMAIN, stop the server and set $env:HUMAIN_API_KEY="YOUR_NEW_KEY" in PowerShell, then run npm start. Do not share the key. Enable Voice Agent permission if using live conversation. HUMAIN requires internet and available credits.
Keep Ollama and PowerShell running. Models require disk space and memory; see README-OFFLINE.md for details and limitations.
Prepared for Nawaf Almudahi.

Download with Git LFS:
    git lfs install
    git clone https://github.com/RuNawaf/BeFit-Full-Online-Offline.git
    cd BeFit-Full-Online-Offline
    git lfs pull
GitHub Download ZIP may not include model files; use Git LFS.
