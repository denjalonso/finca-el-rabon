#!/bin/bash

# Copied from https://github.com/mattpocock/ai-hero-cli/blob/3b38cf4bfd70f3681e77bfdaade7795f207ec9f6/plans/test-coverage-ralph.sh

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# Create progress file if it doesn't exist
if [ ! -f test-coverage-progress.txt ]; then
  echo "# Test Coverage Progress" > test-coverage-progress.txt
  echo "" >> test-coverage-progress.txt
fi

for ((i=1; i<=$1; i++)); do
  echo "=== Iteration $i of $1 ==="

  result=$(claude -p "Read test-coverage-progress.txt and vitest.config.ts. \
PROCESS: \
1. Run pnpm coverage to see which files have low coverage. \
2. Read the uncovered lines and identify the most important USER-FACING FEATURE that lacks tests. \
3. Write ONE meaningful test that validates the feature works correctly for users. \
4. Run pnpm coverage again - coverage should increase as a side effect of testing real behavior. \
5. Run pnpm typecheck to verify types are correct. \
6. Append super-concise notes to test-coverage-progress.txt: what you tested, coverage %, any learnings. \
7. Commit with message: test(<file>): <describe the user behavior being tested> \
\
ONLY WRITE ONE TEST PER ITERATION. \
If statement coverage on the entire codebase reaches 100% and types check, output <promise>COMPLETE</promise>." \
  --allowedTools "Bash(pnpm:*),Bash(git:*),Read,Write,Edit,Glob,Grep" \
  2>&1 | tee /dev/tty)

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "100% coverage reached after $i iterations!"
    exit 0
  fi
done

echo "Completed $1 iterations without reaching 100% coverage."
