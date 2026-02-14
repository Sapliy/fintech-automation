import { useEffect, useRef, useState } from "react";

const useWebSocket = <T,>(
  url: string,
  onMessage: (data: T) => void,
  reconnectDelay = 2000
) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    // Append API Key if not present
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has("api_key")) {
      const TEST_KEY = "sk_test_1234567890";
      urlObj.searchParams.set("api_key", TEST_KEY);
    }

    console.log('[WebSocket] Attempting connection to:', urlObj.toString());
    const ws = new WebSocket(urlObj.toString());
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current); // Stop reconnection attempts
      }
    };

    ws.onmessage = (event) => {
      try {
        const data: T = JSON.parse(event.data); // Parse the incoming message
        onMessage(data);
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected, attempting to reconnect...");
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(connect, reconnectDelay); // Retry connection
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      ws.close(); // Close the socket on error
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [url]);

  const sendMessage = <M,>(message: M) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ Cannot send message, WebSocket is not open");
    }
  };

  return { isConnected, sendMessage };
};

export default useWebSocket;
