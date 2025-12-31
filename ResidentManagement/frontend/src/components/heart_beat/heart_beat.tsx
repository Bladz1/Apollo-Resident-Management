"use client"

import { useEffect } from "react"
import { API_BASE_URL } from "@/components/auth/AuthTester"
import { loadUserId, TOKEN_KEY  } from "@/utils/auth-storage"

export default function HeartBeat() {
    useEffect(() => {
        const interval = setInterval(() => {
            if (localStorage.getItem(TOKEN_KEY)){
                fetch(API_BASE_URL + "/online/ping", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY)}` ,
                    },
                    body: JSON.stringify({
                        userId: loadUserId(),
                    })
                })
            }
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
