// api.js
import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORY: `${CONFIG.BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getAllStory(token) {
  try {
    const response = await fetch(ENDPOINTS.STORY, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
}
export async function getDetailStory(id, token) {
  try {
    const response = await fetch(`${ENDPOINTS.STORY}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
export async function login(email, password) {
  try {
    const user = {
      email: email,
      password: password,
    };
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Login gagal!");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStory(token, formData) {
  try {
    formData.delete("photoSource");
    const photo = formData.get("photo");
    if (photo && photo.size > 1048576) {
      throw new Error("Photo size exceeds 1MB limit");
    }
    const response = await fetch(ENDPOINTS.STORY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to add story: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message || "Failed to add story");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to add story");
  }
}

export async function register(name, email, password) {
  try {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Email Telah digunakan!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const token = localStorage.getItem("token");
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = localStorage.getItem("token");
  const data = JSON.stringify({ endpoint });
  console.log(endpoint);

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
