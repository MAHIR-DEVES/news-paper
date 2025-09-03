export async function getPixelCode() {
  const res = await fetch(`http://localhost:5000/pixels/latest`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}
