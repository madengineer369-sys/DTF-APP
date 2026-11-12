import os
import subprocess
import sys

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.returncode, p.stdout.strip(), p.stderr.strip()

# Get untracked files in DTF_SCROLLING IMAGES
ret, out, err = run('git ls-files --others --exclude-standard "DTF_SCROLLING IMAGES"')
if ret != 0 or not out:
    print("No untracked files found.")
    sys.exit(0)

files = [f for f in out.splitlines() if f.strip()]
print(f"Total untracked files to push: {len(files)}")

BATCH_SIZE_LIMIT = 3 * 1024 * 1024  # ~3MB per batch for ultra-reliable upload

batches = []
current_batch = []
current_size = 0

for f in files:
    if not os.path.exists(f):
        continue
    sz = os.path.getsize(f)
    if current_size + sz > BATCH_SIZE_LIMIT and current_batch:
        batches.append(current_batch)
        current_batch = [f]
        current_size = sz
    else:
        current_batch.append(f)
        current_size += sz

if current_batch:
    batches.append(current_batch)

print(f"Split into {len(batches)} batches.")

for i, batch in enumerate(batches, 1):
    print(f"\n--- Processing Batch {i}/{len(batches)} ({len(batch)} files) ---")
    # Add files
    for f in batch:
        ret, so, se = run(f'git add "{f}"')
        if ret != 0:
            print(f"Error adding {f}: {se}")

    # Commit
    ret, so, se = run(f'git commit -m "Add gallery images (batch {i} of {len(batches)})"')
    if ret != 0:
        print(f"Commit note: {so} {se}")
    else:
        print("Committed batch.")

    # Push
    print("Pushing batch to origin main...")
    ret, so, se = run('git push origin main')
    if ret != 0:
        print(f"Push failed: {se}. Retrying once...")
        ret, so, se = run('git push origin main')
        if ret != 0:
            print(f"Push retry failed: {se}")
            sys.exit(1)
    print(f"Successfully pushed batch {i}/{len(batches)}!")

print("\nAll files have been successfully pushed to GitHub!")

