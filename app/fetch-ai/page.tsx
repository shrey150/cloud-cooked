"use client";

import { api } from '@/convex/_generated/api';
import { createPrompt } from '@/helpers';
import { useRouter } from 'next/navigation'
import { useSessionId } from 'convex-helpers/react/sessions.js';
import { useAction } from 'convex/react';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

export default function FetchAi() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const flightNumber = searchParams.get('flight-number') ?? "";
  const [sessionId] = useSessionId();
  const [initializing, setInitializing] = useState(true);
  const [taskListMessage, setTaskListMessage] = useState();
  const [messagesCount, setMessagesCount] = useState(0);
  const [sendingNextMessage, setSendingNextMessage] = useState(false);
  const initializeFetchAiSession = useAction(api.actions.initializeFetchAiSession);
  const getFetchAiResponse = useAction(api.actions.getFetchAiResponse);
  const sendFetchAiMessage = useAction(api.actions.sendFetchAiMessage);
  const sendFetchAiJsonMessage = useAction(api.actions.sendFetchAiJsonMessage);

  // Resolves when there are at least two messages from fetch.ai
  // (i.e. LLM has responded at least once)
  async function getNextFetchAiResponse(expectedMessageCount = 2) {
    const res = await getFetchAiResponse({
      sessionId,
    });

    if (res && res.messages) {
      setMessagesCount(res.messages.length);
    }

    if (res && res.messages && res.messages.length >= expectedMessageCount) {
      console.log(res.messages);
      return res.messages;
    } else {
      return await new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await getNextFetchAiResponse(expectedMessageCount));
        }, 1000);
      })
    }
  }

  async function initialize() {
    await initializeFetchAiSession({
      sessionId,
      flightNumber,
    });

    await new Promise(res => setTimeout(res, 1000));

    const nextMessages = (await getNextFetchAiResponse()) ?? [];
    const agentMessages = nextMessages.filter((message: any) => {
      if ("agent_json" in message) {
        return true;
      }
      return false;
    });

    const taskList = agentMessages.filter((message: any) => {
      return message.agent_json.type === "task_list";
    })

    if (taskList.length > 0) {
      setTaskListMessage(taskList[0]);

      // Don't flash loading screen too fast
      setTimeout(() => {
        setInitializing(false);
      }, 5000);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  async function onClickStartAgents() {
    setSendingNextMessage(true);
    await sendFetchAiJsonMessage({
      sessionId,
      selectedTaskIndex: 0,
    });
    const nextMessages = (await getNextFetchAiResponse(messagesCount + 2)) ?? [];
    const lastMessage = nextMessages[nextMessages.length - 1];
    if (lastMessage?.agent_json?.text?.includes('confirm')) {
      await sendFetchAiMessage({
        sessionId,
        message: 'confirm',
      });
      await getNextFetchAiResponse(messagesCount + 4);
      router.push('/success');
    };
    setSendingNextMessage(false);
  }

  return (
    <div className="flex flex-col gap-4 p-12">
      <h1 className="text-3xl font-extrabold">
        am i cooked? ☁🛫️️
      </h1>
      {initializing ? (
        <div>
          <h4 className="text-lg">Passing prompt to fetch.ai DELTA-V API, please wait...</h4>
          <pre className="text-left animate-pulse mt-16 text-wrap">
            {createPrompt(flightNumber)}
          </pre>
        </div>
      ) : (
        <div className="max-w-full">
          <h4 className="text-lg">fetch.ai will use the following agents to solve the task:</h4>
          <div className="flex flex-col gap-4 max-w-[80%] lg:max-w-[50%] mx-auto mt-8">
            {(taskListMessage?.agent_json?.options ?? []).map((task, i) => {
              return (
                <Card className="p-4 bg-white/90">
                  <CardContent className="p-0 flex justify-between items-center">
                    <span className="text-slate-500 text-sm">{i + 1}</span>
                    <span className="flex-1 font-bold text-lg">{task.value} Agent</span>
                  </CardContent>
                </Card>
              )
            })}
            <Button
              onClick={onClickStartAgents}
              disabled={sendingNextMessage}
            >
              {sendingNextMessage ? "Starting Agents..." : "Start Agents"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
