// testFlow.js
const BASE_URL = 'http://localhost:3001/api';

async function shorten(url) {
    const res = await fetch(`${BASE_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalURL: url })
    });
    const data = await res.json();
    return data;
}

async function resolve(shortCode) {
    const res = await fetch(`${BASE_URL}/resolve/${shortCode}`);
    return res.json();
}

async function stats(shortCode) {
    const res = await fetch(`${BASE_URL}/stats/${shortCode}`);
    return res.json();
}

async function runTests() {
    console.log('--- TEST FLOW START ---');

    const url1 = 'https://www.example.com/some/long/path';
    const url2 = 'https://othersite.com/diff';

    // 1. POST same URL twice
    const firstResp = await shorten(url1);
    console.log('First shorten:', firstResp);

    const secondResp = await shorten(url1);
    console.log('Second shorten (same URL):', secondResp);

    if (firstResp.shortCode === secondResp.shortCode) {
        console.log('✅ Same URL returns same shortCode');
    } else {
        console.error('❌ Same URL did not return same shortCode');
    }

    // 2. POST a different URL
    const diffResp = await shorten(url2);
    console.log('Different shorten:', diffResp);

    if (diffResp.shortCode !== firstResp.shortCode) {
        console.log('✅ Different URL returns different shortCode');
    } else {
        console.error('❌ Different URL returned same shortCode');
    }

    // 3. Resolve the first shortCode
    const resolved = await resolve(firstResp.shortCode);
    console.log('Resolved URL:', resolved);

    if (resolved.originalURL === url1) {
        console.log('✅ Resolve mapping works');
    } else {
        console.error('❌ Resolve mapping failed');
    }

    // 4. Check stats increment
    const statsBefore = await stats(firstResp.shortCode);
    await resolve(firstResp.shortCode); // trigger one more hit
    const statsAfter = await stats(firstResp.shortCode);

    console.log('Stats before:', statsBefore, 'Stats after:', statsAfter);

    if (statsAfter.hits === statsBefore.hits + 1) {
        console.log('✅ Hit count increments correctly');
    } else {
        console.error('❌ Hit count did not increment as expected');
    }

    console.log('--- TEST FLOW END ---');
}

runTests().catch(err => {
    console.error('Test flow failed:', err);
});


// salchad27@MacDA src % node testFlow.js
// --- TEST FLOW START ---
// First shorten: {
//   shortCode: 'HWf3dA37',
//   ipfsHash: 'QmUJEpCcyNd4KZw2itcAUPd85udDPqwy9zA75Q2ukEPqtZ'
// }
// Second shorten (same URL): {
//   shortCode: 'HWf3dA37',
//   ipfsHash: 'QmX57bwbsEtiNdGei1jAfop5yaMuBPtoyKikKctnVJmdND'
// }
// ✅ Same URL returns same shortCode
// Different shorten: {
//   shortCode: '1cxrJE6W',
//   ipfsHash: 'QmciRftQDcc6vUnDcuXpEruFosJmYHkfN76YPLrXepmPkC'
// }
// ✅ Different URL returns different shortCode
// Resolved URL: { originalURL: 'https://www.example.com/some/long/path' }
// ✅ Resolve mapping works
// Stats before: { hits: 2 } Stats after: { hits: 3 }
// ✅ Hit count increments correctly
// --- TEST FLOW END ---