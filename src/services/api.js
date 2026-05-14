const API_KEY = "87909682e6cd74208f41a6ef39fe4191";
const BASE_URL = "https://prueba-tecnica-api-tienda-moviles.onrender.com";

const headers = { "x-api-key": API_KEY };

const forceHttps = (obj) =>
  JSON.parse(JSON.stringify(obj).replaceAll("http://", "https://"));

export const getPhones = async (search = "") => {
  const url = search
    ? `${BASE_URL}/products?search=${encodeURIComponent(search)}`
    : `${BASE_URL}/products`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Error fetching phones");
  const data = await res.json();
  const phones = search ? data : data.slice(0, 20);
  return forceHttps(phones);
};

export const getPhoneById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, { headers });
  if (!res.ok) throw new Error("Error fetching phone");
  return forceHttps(await res.json());
};
