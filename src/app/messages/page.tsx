"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Send,
  Search,
  Clock,
  CheckCheck,
  User,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      fetchContacts();
    }
  }, [session]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/messages/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data.contacts);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const response = await fetch(`/api/messages/${contactId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedContact.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage("");

      // Update contact's last message
      const updatedContacts = contacts.map((contact) => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString(),
          };
        }
        return contact;
      });
      setContacts(updatedContacts);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in to access messages
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
            {/* Contacts List */}
            <div
              className={`border-r border-gray-200 ${
                showMobileChat ? "hidden md:block" : "block"
              }`}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-4 border-b border-gray-200 flex items-start hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-amber-50" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">
                          {contact.name}
                        </h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatTime(contact.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                      {contact.unreadCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`col-span-2 flex flex-col ${
                !showMobileChat ? "hidden md:flex" : "flex"
              }`}
            >
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden mr-2"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedContact.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedContact.role}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === session.user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderId === session.user.id
                              ? "bg-amber-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <span className="text-xs opacity-75">
                              {formatTime(message.createdAt)}
                            </span>
                            {message.senderId === session.user.id && (
                              <CheckCheck className="h-4 w-4 opacity-75" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-200"
                  >
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Select a contact to start messaging
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
