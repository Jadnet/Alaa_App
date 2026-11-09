const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size) {
  const width = size, height = size;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const raw = [];
  const cx = width / 2, cy = height / 2;
  const rOuter = size * 0.42;
  const rInner = size * 0.30;
  for (let y = 0; y < height; y++) {
    raw.push(0);
    for (let x = 0; x < width; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      let R, G, B;
      R = 0xF3; G = 0xEF; B = 0xEA;
      if (d <= rOuter) {
        if (d >= rInner) {
          R = 0x24; G = 0x32; B = 0x1D;
        } else {
          R = 0xF3; G = 0xEF; B = 0xEA;
          const coinR = size * 0.16;
          const cdx = x - cx, cdy = y - (cy + size * 0.02);
          if (Math.sqrt(cdx * cdx + cdy * cdy) <= coinR) {
            R = 0xC9; G = 0xA2; B = 0x4B;
          }
        }
      }
      raw.push(R, G, B);
    }
  }
  const compressed = zlib.deflateSync(Buffer.from(raw));
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  const buf = makePng(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buf);
  console.log('wrote', size);
}