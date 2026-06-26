const http = require('http');

async function runTests() {
  const API_URL = 'http://localhost:4000';
  let successCount = 0;
  let failCount = 0;
  let vehicleId = null;
  let reservationId = null;
  let cookies = [];

  const log = (msg) => console.log(`[TEST] ${msg}`);
  const pass = (msg) => { console.log(`✅ PASS: ${msg}`); successCount++; };
  const fail = (msg) => { console.error(`❌ FAIL: ${msg}`); failCount++; };

  try {
    // 1. Fetch Vehicles
    log('Testing GET /vehicles...');
    const vRes = await fetch(`${API_URL}/vehicles`);
    if (vRes.ok) {
      const data = await vRes.json();
      if (data.length > 0) {
        vehicleId = data[0].id;
        pass(`Fetched ${data.length} vehicles. Selected ID: ${vehicleId}`);
      } else {
        fail('No vehicles returned');
      }
    } else {
      fail(`GET /vehicles failed: ${vRes.status}`);
    }

    // 2. Create Reservation (Guest)
    if (vehicleId) {
      log('Testing POST /reservations...');
      const rRes = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          startDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
          guestName: 'Audit Test',
          guestPhone: '0600000000',
          guestEmail: 'audit@test.ma'
        })
      });
      if (rRes.ok) {
        const data = await rRes.json();
        reservationId = data.id;
        pass(`Reservation created. ID: ${reservationId}`);
      } else {
        const err = await rRes.text();
        fail(`POST /reservations failed: ${rRes.status} ${err}`);
      }
    }

    // 3. Admin Login
    log('Testing POST /auth/login (Admin)...');
    const lRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@location.ma', password: 'admin123' })
    });
    
    if (lRes.ok) {
      const setCookie = lRes.headers.get('set-cookie');
      if (setCookie) {
        // extract access_token and refresh_token
        cookies = setCookie.split(', ').map(c => c.split(';')[0]);
        pass('Admin login successful and cookies received.');
      } else {
        fail('Admin login ok but no cookies returned.');
      }
    } else {
      fail(`POST /auth/login failed: ${lRes.status}`);
    }

    // 4. Admin Get Reservations
    if (cookies.length > 0) {
      log('Testing GET /admin/reservations...');
      const cookieStr = cookies.join('; ');
      const arRes = await fetch(`${API_URL}/admin/reservations`, {
        headers: { 'Cookie': cookieStr }
      });
      if (arRes.ok) {
        const data = await arRes.json();
        const found = data.find(r => r.id === reservationId);
        if (found) {
          pass(`Admin can view the new reservation (${data.length} total).`);
        } else {
          fail('Admin fetched reservations but new one is missing.');
        }
      } else {
        const err = await arRes.text();
        fail(`GET /admin/reservations failed: ${arRes.status} ${err}`);
      }

      // 5. Admin Update Reservation Status
      if (reservationId) {
        log('Testing PATCH /admin/reservations/:id/status...');
        const patchRes = await fetch(`${API_URL}/admin/reservations/${reservationId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Cookie': cookieStr },
          body: JSON.stringify({ status: 'CONFIRMED' })
        });
        if (patchRes.ok) {
          const data = await patchRes.json();
          if (data.status === 'CONFIRMED') {
            pass('Admin successfully updated reservation status to CONFIRMED.');
          } else {
            fail('Status did not update correctly.');
          }
        } else {
          const err = await patchRes.text();
          fail(`PATCH /admin/reservations/:id/status failed: ${patchRes.status} ${err}`);
        }
      }
    }

    console.log(`\n--- AUDIT COMPLETE ---`);
    console.log(`Passed: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (err) {
    console.error('Fatal Test Error:', err);
  }
}

runTests();
