"use client";

import { api } from '@/convex/_generated/api';
import { useSessionId } from 'convex-helpers/react/sessions.js';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

export default function Success() {
  const [sessionId] = useSessionId();
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const getFetchAiResponse = useAction(api.actions.getFetchAiResponse);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const interval = setInterval(pollFetchAiResponses, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  async function pollFetchAiResponses() {
    console.log('polling')
    const res = await getFetchAiResponse({
      sessionId,
    });

    if (res && res.messages) {
      setMessages(res.messages);
    }
  }

  const confirmMessageIndex = messages.findIndex(message => {
    return message?.user_message === "confirm";
  });
  const completedMessageIndex = messages.findIndex(message => {
    return message?.agent_message?.includes("I have completed your task");
  });
  const completed = completedMessageIndex !== -1;
  const resultMessageIndex = completedMessageIndex - 1;

  return (
    <div className="p-24">
      <h1 className="text-5xl font-extrabold">
        {completed ? "Agents completed!" : "Agents started! Waiting for responses..."}
      </h1>
      <pre className="text-left text-wrap mt-12">
        {/* Skip confirm message and the please wait message */}
        {JSON.stringify(completed ? messages[resultMessageIndex] : messages.slice(confirmMessageIndex + 2), null, 2)}
      </pre>
    </div>
  );
}
