import api from "./axios";

// Create a new Group (corpus) under an App
export const createGroup = (data) => api.post("/group/create", data);

// Fetch a single Group's details
export const getGroup = (data) => api.post("/group/get-group", data);

// Fetch all Groups belonging to a specific App (expects { appId } in body)
export const getAppGroups = (data) => api.post("/group/app-groups", data);

// Update a Group config (requires ID parameter)
export const updateGroup = (id, data) => api.patch(`/group/update-group/${id}`, data);

// Delete a Group (requires ID parameter)
export const deleteGroup = (id) => api.delete(`/group/delete-group/${id}`);

const groupApi = {
  createGroup,
  getGroup,
  getAppGroups,
  updateGroup,
  deleteGroup,
};

export default groupApi;