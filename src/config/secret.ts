import * as fs from 'fs';

const PUBKEY = fs.readFileSync('./secrets/ops-auth-rsa.key.pub', 'utf8');
export const OPS = {
    PUBKEY,
};
