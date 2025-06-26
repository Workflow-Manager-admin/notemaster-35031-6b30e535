#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-35031-6b30e535/notes_frontend_workspace/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

