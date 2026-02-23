import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers,
  FiSliders,
  FiSearch,
  FiSave,
  FiShield,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  // States
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [weightsConfig, setWeightsConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // New States for Community Mods
  const [communities, setCommunities] = useState([]);
  const [selectedCommId, setSelectedCommId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // Fetching Logic
  const fetchUsers = async () => {
    try {
      const res = await api.get(
        `/admin/users?search=${search}&role=${roleFilter}`,
      );
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeights = async () => {
    try {
      const res = await api.get("/admin/weights");
      if (res.data.success) setWeightsConfig(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/admin/communities");
      if (res.data.success) {
        setCommunities(res.data.data);
        if (res.data.data.length > 0 && !selectedCommId) {
          setSelectedCommId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "weights" && !weightsConfig) fetchWeights();
    if (activeTab === "communities") {
      fetchCommunities();
      fetchUsers(); // We need the users list for the dropdown
    }
  }, [activeTab, search, roleFilter]);

  // Handlers
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleWeightSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/admin/weights", {
        weights: weightsConfig.weights,
        default_weight: weightsConfig.default_weight,
      });
      alert("AI Scoring Weights Updated!");
    } catch (err) {
      alert("Failed to save weights");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWeightInput = (sdgId, value) => {
    setWeightsConfig({
      ...weightsConfig,
      weights: { ...weightsConfig.weights, [sdgId]: Number(value) },
    });
  };

  // New Handlers for Community Mods
  const handleAssignMod = async () => {
    if (!selectedCommId || !selectedUserId)
      return alert("Select both a community and a user.");
    try {
      const res = await api.post(
        `/admin/communities/${selectedCommId}/moderators`,
        { userId: selectedUserId },
      );
      if (res.data.success) {
        // Update local state to reflect new moderator instantly
        setCommunities(
          communities.map((c) =>
            c._id === selectedCommId ? res.data.data : c,
          ),
        );
        setSelectedUserId(""); // Reset user dropdown
      }
    } catch (err) {
      alert("Failed to assign moderator");
    }
  };

  const handleRemoveMod = async (commId, userId) => {
    if (!window.confirm("Remove this moderator?")) return;
    try {
      const res = await api.delete(
        `/admin/communities/${commId}/moderators/${userId}`,
      );
      if (res.data.success) {
        setCommunities(
          communities.map((c) => (c._id === commId ? res.data.data : c)),
        );
      }
    } catch (err) {
      alert("Failed to remove moderator");
    }
  };

  // Helper to find selected community data
  const activeCommunity = communities.find((c) => c._id === selectedCommId);

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-6">
      <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-lg flex items-center gap-4">
        <FiShield className="text-5xl text-[#4ADE80]" />
        <div>
          <h2 className="text-3xl font-black mb-1">Admin Dashboard</h2>
          <p className="text-gray-400 text-sm">
            Manage platform users, roles, and AI impact priorities.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/4 bg-gray-50 p-4 border-r border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "users" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-white"}`}
          >
            <FiUsers /> User Roles
          </button>
          <button
            onClick={() => setActiveTab("communities")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "communities" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:bg-white"}`}
          >
            <FiShield /> Community Mods
          </button>
          <button
            onClick={() => setActiveTab("weights")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "weights" ? "bg-white text-[#4ADE80] shadow-sm" : "text-gray-500 hover:bg-white"}`}
          >
            <FiSliders /> AI Weights
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[700px]">
          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search username or email..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                            src={
                              u.avatar?.startsWith("http")
                                ? u.avatar
                                : `https://ui-avatars.com/api/?name=${u.username}`
                            }
                            className="w-8 h-8 rounded-full object-cover"
                            alt="avatar"
                          />
                          <span className="font-bold text-gray-800">
                            {u.username}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            className="bg-transparent font-bold text-xs p-1 rounded focus:ring-2 focus:ring-blue-400"
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COMMUNITY MODS TAB */}
          {activeTab === "communities" && (
            <div className="flex flex-col gap-6">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-2">
                <h3 className="font-bold text-purple-800 mb-1">
                  Community Assignments
                </h3>
                <p className="text-xs text-purple-600 leading-relaxed">
                  Assign users to manage specific SDG communities. They will
                  gain the ability to delete comments, remove posts, and pin
                  important updates within that feed.
                </p>
              </div>

              {/* Assignment Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <select
                  className="md:col-span-5 p-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 outline-none w-full truncate"
                  value={selectedCommId}
                  onChange={(e) => setSelectedCommId(e.target.value)}
                >
                  <option value="" disabled>
                    Select Community...
                  </option>
                  {communities.map((c) => (
                    // Removed the duplicate "SDG X:" text here
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="md:col-span-4 p-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 outline-none w-full truncate"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="" disabled>
                    Select User...
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignMod}
                  className="md:col-span-3 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2 w-full"
                >
                  <FiPlus /> Assign Mod
                </button>
              </div>

              {/* Active Moderators List */}
              {activeCommunity && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                    Current Moderators for SDG {activeCommunity.sdg_number}
                  </h4>
                  {activeCommunity.moderators?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {activeCommunity.moderators.map((mod) => (
                        <div
                          key={mod._id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                mod.avatar?.startsWith("http")
                                  ? mod.avatar
                                  : `https://ui-avatars.com/api/?name=${mod.username}`
                              }
                              className="w-8 h-8 rounded-full object-cover"
                              alt="avatar"
                            />
                            <div>
                              <p className="font-bold text-sm text-gray-800">
                                {mod.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {mod.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveMod(activeCommunity._id, mod._id)
                            }
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                            title="Remove Moderator"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">
                      No moderators assigned to this community yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI WEIGHTS TAB */}
          {activeTab === "weights" && weightsConfig && (
            <div className="flex flex-col gap-6">
              {/* ... The same AI weights tab content from the previous step ... */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-2">
                <h3 className="font-bold text-green-800 mb-1">
                  Impact Scoring Priority
                </h3>
                <p className="text-xs text-green-600 leading-relaxed">
                  Adjusting these multipliers will instantly affect how Green
                  Karma is calculated for all newly published posts based on
                  their SDG classification.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700">
                  Default Baseline Multiplier
                </span>
                <input
                  type="number"
                  className="w-20 p-2 text-center border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#4ADE80] outline-none"
                  value={weightsConfig.default_weight}
                  onChange={(e) =>
                    setWeightsConfig({
                      ...weightsConfig,
                      default_weight: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[...Array(17)].map((_, i) => {
                  const sdgNum = i + 1;
                  return (
                    <div
                      key={sdgNum}
                      className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        SDG {sdgNum} Multiplier
                      </span>
                      <input
                        type="number"
                        placeholder="Default"
                        className="w-20 p-2 text-center border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#4ADE80] outline-none"
                        value={weightsConfig.weights[sdgNum] || ""}
                        onChange={(e) =>
                          handleWeightInput(sdgNum, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleWeightSave}
                disabled={isSaving}
                className="w-full py-4 mt-4 bg-[#4ADE80] text-white font-bold rounded-xl hover:bg-green-500 transition shadow-lg shadow-green-100 flex justify-center items-center gap-2"
              >
                <FiSave />{" "}
                {isSaving ? "Saving Configurations..." : "Save AI Weights"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
