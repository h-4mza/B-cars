async function test() {
  console.log('Testing login...');
  const res = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@location.ma', password: 'AdminPassword123' })
  });
  
  console.log('Status:', res.status);
  console.log('Set-Cookie:', res.headers.get('set-cookie'));
  
  const text = await res.text();
  console.log('Body:', text);
  
  if (res.status === 201) {
     const cookies = res.headers.get('set-cookie');
     if (!cookies) return console.log('No cookies set');
     
     console.log('Testing /auth/me...');
     const meRes = await fetch('http://localhost:4000/auth/me', {
       headers: { 'Cookie': cookies.split(',').map(c => c.split(';')[0]).join('; ') }
     });
     
     console.log('Me Status:', meRes.status);
     console.log('Me Body:', await meRes.text());
  }
}

test();
