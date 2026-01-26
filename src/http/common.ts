import type { Params } from "@/types/common";

export async function get(path: string, params?: Params) {
    let url = path
    if (params) {
        url += '?' + new URLSearchParams(params).toString();
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export async function post(path: string, data?: Record<string, string>) {
    let url = path
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const _data = await response.json();
    return _data;
}