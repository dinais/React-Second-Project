
export async function updateResource(id, body, type) {
    const response = await fetch(`http://localhost:3000/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

export async function fetchResource(id, type, field = null, queryString = null) {
    let url;
    if (field === null && queryString === null) {
        url = `http://localhost:3000/${type}`;
    } else {
        url = `http://localhost:3000/${type}?${field}=${id}${queryString?.length > 0 ? `&${queryString}` : ''}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }
    return await response.json();
};

export async function deleteResource(criteria, type) {
    let url = `http://localhost:3000/${type}`;
    let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    };

    // אם הקריטריון הוא אובייקט, שלח אותו ב-body
    if (typeof criteria === "object") {
        options.body = JSON.stringify(criteria);
    } else {
        // אחרת, הוסף אותו ל-URL כמזהה
        url += `/${criteria}`;
    }

    console.log(`Request URL: ${url}`);
    console.log(`Request Options:`, options);

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Failed to delete resource. Status ${response.status}: ${response.statusText}`);
    }

    return response;
}



export async function createResource(type, body) {
    const response = await fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to create resource. Status ${response.status}: ${response.statusText}`);
    }

    const createdResource = await response.json();
    return createdResource;
}

