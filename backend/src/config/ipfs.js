import { create } from 'ipfs-http-client';
const ipfs = create({ url: 'http://localhost:5001' });

export async function storeMappingOnIPFS(data) {
  const { cid } = await ipfs.add(JSON.stringify(data));
  return cid.toString();
}
