// Run: npm test. Compression itself needs a browser (createImageBitmap / OffscreenCanvas) and is covered by the
// end-to-end run; these are the checks made before any work is done on a file.
import assert from "node:assert/strict";
import { test } from "node:test";
import { fileKey, formatBytes, MAX_FILE_BYTES, precheck, prepare } from "./attachments.ts";

const file = (name, size, type = "") => new File([new Uint8Array(size)], name, { type, lastModified: 1 });

test("supported types pass; everything else is named and refused", () => {
  for (const name of ["Packing list.pdf", "quote.DOCX", "old.doc", "rates.xlsx", "old.xls", "a.jpg", "a.jpeg", "a.png", "a.webp", "iphone.heic", "x.heif"])
    assert.equal(precheck(file(name, 10)), undefined, name);
  assert.match(precheck(file("setup.exe", 10)), /“setup\.exe” isn't a supported file type/);
  assert.match(precheck(file("notes", 10)), /isn't a supported file type/);
  assert.match(precheck(file("empty.pdf", 0)), /“empty\.pdf” is empty/);
  assert.match(precheck(file(`${"a".repeat(200)}.pdf`, 10)), /longer than 200 characters/);
});

test("size limit: documents at 10 MB; photos may be larger only because they will be compressed", () => {
  assert.equal(precheck(file("ok.pdf", MAX_FILE_BYTES)), undefined);
  assert.match(precheck(file("big.pdf", MAX_FILE_BYTES + 1)), /“big\.pdf” is 10\.0 MB\. Files must be 10 MB or smaller\./);
  assert.equal(precheck(file("photo.jpg", 25 * 1024 * 1024, "image/jpeg")), undefined); // compressed before upload
  assert.match(precheck(file("huge.jpg", 41 * 1024 * 1024, "image/jpeg")), /is 41\.0 MB/);
  assert.match(precheck(file("big.heic", MAX_FILE_BYTES + 1, "image/heic")), /Files must be 10 MB or smaller/); // not compressible
});

test("documents are never altered, and nothing claims compression without a smaller copy", async () => {
  const pdf = file("contract.pdf", 2048, "application/pdf");
  const ready = await prepare(pdf);
  assert.equal(ready.file, pdf); // the very same bytes go up
  assert.equal(ready.originalSize, null);
  assert.equal(ready.error, undefined);
});

test("formatting and duplicate detection", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(4.25 * 1024 * 1024), "4.3 MB");
  assert.equal(fileKey(file("a.pdf", 3)), fileKey(file("a.pdf", 3)));
  assert.notEqual(fileKey(file("a.pdf", 3)), fileKey(file("a.pdf", 4)));
});
