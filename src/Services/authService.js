const tokenKey = "token";
const id = "userId";

export function getToken() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    return token;
  } else {
    return null;
  }
}

export function getUserId() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return userId;
  } else {
    return null;
  }
}

export function getProjectId() {
  const projectId = localStorage.getItem("projectId");
  if (projectId) {
    return projectId;
  } else {
    return null;
  }
}

export function getLoginId() {
  const loginid = localStorage.getItem(id);
  if (loginid) {
    return loginid;
  } else {
    return null;
  }
}
