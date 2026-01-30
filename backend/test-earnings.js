/**
 * Test script for TikTok Earnings Calculator
 * Run: node test-earnings.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function testEarnings(username) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing earnings for: @${username}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const url = `${BASE_URL}/api/tiktok/user/${username}/earnings`;
    console.log(`GET ${url}\n`);

    const response = await fetch(url);
    const data = await response.json();

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`\nResponse:`);
    console.log(JSON.stringify(data, null, 2));

    // Verify required fields
    console.log(`\n${'-'.repeat(60)}`);
    console.log('Verification:');
    console.log(`${'-'.repeat(60)}`);
    
    const checks = {
      'success': data.success === true,
      'avgViews > 0': (data.avgViews || 0) > 0,
      'engagementRate >= 0': (data.engagementRate || -1) >= 0,
      'cpm > 0': (data.cpm || 0) > 0,
      'platformFactor === 1': data.platformFactor === 1,
      'estimatedEarnings > 0': (data.estimatedEarnings || 0) > 0,
    };

    let allPassed = true;
    for (const [check, passed] of Object.entries(checks)) {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status}: ${check}`);
      if (!passed) allPassed = false;
    }

    if (allPassed) {
      console.log(`\n✅ All checks passed! Earnings: $${data.estimatedEarnings?.toFixed(2)}`);
    } else {
      console.log(`\n❌ Some checks failed!`);
    }

    // Formula verification
    if (data.avgViews && data.cpm) {
      const calculated = (data.avgViews / 1000) * data.cpm;
      const matches = Math.abs(calculated - (data.estimatedEarnings || 0)) < 0.01;
      console.log(`\nFormula check: (${data.avgViews} / 1000) * ${data.cpm} = ${calculated.toFixed(2)}`);
      console.log(`Expected: ${data.estimatedEarnings?.toFixed(2)}`);
      console.log(`${matches ? '✅' : '❌'} Formula ${matches ? 'matches' : 'does not match'}`);
    }

    return data;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    return null;
  }
}

async function testProfile(username) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing profile for: @${username}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const url = `${BASE_URL}/api/tiktok/user/${username}`;
    console.log(`GET ${url}\n`);

    const response = await fetch(url);
    const data = await response.json();

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`\nProfile Data:`);
    console.log(`  Username: ${data.profile?.username}`);
    console.log(`  Followers: ${data.profile?.followers?.toLocaleString()}`);
    console.log(`  Likes: ${data.profile?.likes?.toLocaleString()}`);
    console.log(`  Videos: ${data.profile?.videos?.toLocaleString()}`);
    console.log(`\nAnalytics:`);
    console.log(`  Avg Views: ${data.analytics?.avgViews?.toLocaleString()}`);
    console.log(`  Engagement Rate: ${data.analytics?.engagementRate}%`);
    console.log(`\nEarnings:`);
    console.log(`  Per Video: $${data.earnings?.perVideo?.toFixed(2)}`);
    console.log(`  Monthly: $${data.earnings?.monthly?.toFixed(2)}`);
    console.log(`  CPM: $${data.earnings?.cpm}`);

    return data;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('\n🧪 TikTok Earnings Calculator - Test Suite\n');

  // Test with different usernames
  const testUsers = ['mrbeast', 'charlidamelio'];

  for (const username of testUsers) {
    await testProfile(username);
    await testEarnings(username);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Test suite completed!');
  console.log(`${'='.repeat(60)}\n`);
}

// Run tests
main().catch(console.error);
