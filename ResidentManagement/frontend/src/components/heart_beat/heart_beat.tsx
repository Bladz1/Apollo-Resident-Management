"use client"

import { useEffect } from "react"
import API_BASE_URL from "@/components/auth/AuthTester"
import { extractIdFromToken, loadUserId,  } from "@/utils/auth-storage"


export default function HeartBeat(){
    useEffect(() => {
        const sendHeartBeat = () => {
            const interval = setInterval(() => {
                fetch(API_BASE_URL + "/online/ping", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: loadUserId,
                    })
                }
                )
            }, 15000);
            return () => clearInterval(interval);
        }
        sendHeartBeat();
    }, []);

    return null;
}