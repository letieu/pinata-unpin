import pinataSDK from '@pinata/sdk';

import {
    secret,
    key,
    olderThanMinutes,
} from './config.js';

const PERPAGE = 1000;

const now = new Date();
const pinEnd = new Date(now);
pinEnd.setMinutes(now.getMinutes() - olderThanMinutes);

console.log("Now in ISO:" + now.toISOString());

const pinata = pinataSDK(key, secret);

async function process() {
  const pins = await getPins().catch(e => {
    console.log(e)
  });
        
  const count = pins.rows.length;
  console.log('found: ', count);
  let i = 1;
  for await (const pin of pins.rows) {
    await pinata.unpin(pin.ipfs_pin_hash);
    console.log(`unpined ${i}/${count}`);
    i++;
  }
}

async function getPins() {
    return pinata.pinList({
        "status": "pinned",
        pageLimit: 100,
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};

process();
