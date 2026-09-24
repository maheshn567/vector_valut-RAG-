import api from "./axios";

// Public auth calls
export const registerTenant = (data) => api.post("/tenant/register", data);
export const loginTenant = (data) => api.post("/tenant/login", data);

// Private calls (requires Authorization: Bearer <token>)
export const getTenant = () => api.get("/tenant/get-tenant");
export const updateTenant = (data) => api.patch("/tenant/update-tenant", data);

const tenantApi = {
  registerTenant,
  loginTenant,
  getTenant,
  updateTenant,
};

export default tenantApi;
