"""Verify the immutable Atlas component capture without changing archived bytes."""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import stat
import subprocess
import zipfile


REPO = Path(__file__).resolve().parents[2]
BUNDLE = REPO / "experience/reviews/january-atlas-filter-2026-09-05/acceptance.zip"
BUNDLE_SHA = "dc1f9530cc4c4d3a519f5cdd3ce1eca61ec8ea20b0960f8d2ba45a3f2c085e31"
MANIFEST_SHA = "cacaf7649baee6fc755901fcd49df66af23d833822eb8931954736ef139b0c2c"
SOURCE = "17305479d47c3654102be7e84a382478ee3eead0"
RUN = "capture-2026-09-05T02-01-59-317Z"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--node", default="node")
    args = parser.parse_args()
    require(args.output.is_absolute(), "Use an absolute external evidence directory")
    output = args.output.resolve()
    require(not output.is_relative_to(REPO), "Extract outside the Studio checkout")
    require(not output.exists(), "Preserve existing evidence; choose a new directory")
    require(digest(BUNDLE) == BUNDLE_SHA, "Wrong or unhydrated immutable evidence bundle")
    with zipfile.ZipFile(BUNDLE) as archive:
        names = archive.namelist()
        require(len(names) == len(set(names)), "Duplicate archive path")
        for entry in archive.infolist():
            member = PurePosixPath(entry.filename)
            require(not member.is_absolute() and ".." not in member.parts
                    and "\\" not in entry.filename and ":" not in entry.filename,
                    "Unsafe archive member")
            require(not stat.S_ISLNK(entry.external_attr >> 16), "Archive symlink refused")
        output.mkdir(parents=True)
        archive.extractall(output)
    package = output / "atlas-filter-acceptance"
    tools = package / "tooling"
    manifest = package / "evidence" / RUN / "manifest.json"
    require(digest(manifest) == MANIFEST_SHA, "Wrong exact captured manifest")
    subprocess.run([args.node, "--test", str(tools / "contract.test.mjs")],
                   cwd=REPO, check=True)
    attestation = output / "receiving-attestation.json"
    subprocess.run([args.node, str(tools / "attest-portable.mjs"),
                    f"--repo={REPO}", f"--commit={SOURCE}",
                    f"--manifest={manifest}", f"--out={attestation}"],
                   cwd=REPO, check=True)
    result = json.loads(attestation.read_text(encoding="utf-8"))
    require(result.get("complete") is True and result.get("passingCases") == 16
            and len(result.get("screenshots", [])) == 36
            and result.get("manifestSha256") == MANIFEST_SHA,
            "Incomplete component attestation")
    print("AtlasFilter: 16 source-bound scripted cases, 36 captured images verified.")
    print("Human, council and complete accessibility acceptance remain unverified.")


if __name__ == "__main__":
    main()
