export default function client(endpoint, { body, ...customConfig }) {
  const headers = { "Content-Type": "application/json"};
  const config = { 
    method: customConfig.method || 'GET',
    headers: {
      ...headers,
      ...customConfig.headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, config)
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      const erorrMessage = res.text();
      return Promise.reject(new Error(erorrMessage));
    }
  })
}