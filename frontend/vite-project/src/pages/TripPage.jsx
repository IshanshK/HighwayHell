import React from "react";

const TripPage = () => {
  const isAdmin = true;

  const invitedParticipants = [
    { userId: 1, name: "John Doe" },
    { userId: 2, name: "Jane Smith" },
    { userId: 3, name: "David Clark" },
  ];

  const addedParticipants = [
    { userId: 4, name: "Emily Davis" },
    { userId: 5, name: "Michael Lee" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Muthal Gang</h1>
        <p className="text-lg">Admin: Ishansh Khare</p>
      </div>

      <div className="container mx-auto p-6">
        {/* Participants Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invited Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">
              Invited
            </h2>
            <ul>
              {invitedParticipants.map((participant) => (
                <li key={participant.userId} className="p-2 border-b">
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Added Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">
              Added
            </h2>
            <ul>
              {addedParticipants.map((participant) => (
                <li key={participant.userId} className="p-2 border-b">
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Select Venue Button (only visible to Admin) */}
        {isAdmin && (
          <div className="mt-6 text-center">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md text-lg transition-all">
              Select Venue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPage;
