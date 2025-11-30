import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import Button from "../components/ui/button.jsx"; // ✅ your own button
import api from "../api/axios.js"; // ✅ axios instance using env

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // ✅ Get stored token
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Login Required", "Please login to access profile", "info");
        navigate("/login");
        return;
      }

      // ✅ Correct API endpoint
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
        console.log("Logged user:", res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      Swal.fire("Error", "Failed to load user profile ❗", "error");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-7 space-y-6 bg-white">

      {/* Header */}
      <header className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">User information and settings</p>
      </header>

      {/* User Info */}
      <section className="bg-gray-50 border rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col gap-3 text-sm">

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-black font-bold">{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-black font-bold">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="text-black font-bold">{user.phone || "N/A"}</span>
          </div>

          {/* Addresses (optional display) */}
          {user.addresses?.length > 0 && (
            <div className="border-t mt-3 pt-3">
              <h3 className="font-bold text-gray-800 mb-2 uppercase text-xs">Saved Addresses:</h3>
              {user.addresses.map((a, i) => (
                <div key={i} className="text-[11px] text-gray-600 mb-1">
                  {a.street}, {a.city}, {a.state} — {a.pincode} ({a.phone})
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Logout */}
      <footer className="flex justify-end">
        <Button
          onClick={() => {
            localStorage.clear();
            Swal.fire("Logged Out", "Successfully logged out ✅", "success");
            navigate("/login");
          }}
          className="px-8"
          variant="destructive"
        >
          Logout
        </Button>
      </footer>

    </div>
  );
};

export default UserProfile;
