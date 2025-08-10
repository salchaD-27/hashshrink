import { create } from 'ipfs-http-client';
const ipfs = create({ url: 'http://localhost:5001' });
// create function from ipfs-http-client creates an ipfs client connected to the node running at localhost:5001

// Storing data on ipfs:
// The exported async function storeMappingOnIPFS(data) converts the input data (obj) to json str.
// Uses ipfs.add(...) to add this string to ipfs.
// The returned object includes the cid for the stored data.
// The function returns the cid as a string, which uniquely identifies the data on ipfs.
export async function storeMappingOnIPFS(data) {
  const { cid } = await ipfs.add(JSON.stringify(data));
  return cid.toString();
}
