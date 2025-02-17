"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  availableSessions: number;
}

interface UserSearchProps {
  onSelect: (user: User) => void;
}

export default function UserSearch({ onSelect }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
          className="flex-1 p-2 border rounded"
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
        />
        <button
          onClick={() => handleSearch(searchQuery)}
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 flex items-center"
        >
          {loading ? "Searching..." : "Search"}
          <Search className="w-5 h-5 ml-2" />
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md divide-y">
          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">
                Available Sessions: {user.availableSessions}
              </p>
            </button>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !loading && (
        <p className="text-sm text-gray-500">No users found</p>
      )}
    </div>
  );
}
