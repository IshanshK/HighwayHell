import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ProfileCard, FriendsCard, AboutCard, ConnectCard, LocationCard } from "../components/Profile.jsx";

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${userId}`
       ,
       {  headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    });
        const userData = response.data;

        setUser(userData);
        setFriends(userData.friends || []);

        if (currentUser && userData.friends) {
          const friendIds = userData.friends.map(friend => friend._id);
          setIsFriend(friendIds.includes(currentUser._id));
        } else {
          setIsFriend(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, currentUser]);

  const handleFriendUpdate = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`);
      const userData = response.data;

      setUser(userData);
      setFriends(userData.friends || []);

      if (currentUser && userData.friends) {
        const friendIds = userData.friends.map(friend => friend._id);
        setIsFriend(friendIds.includes(currentUser._id));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const isCurrentUser = currentUser && currentUser._id === userId;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center mt-8">User not found</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      <div className="lg:col-span-2 space-y-8">
        <ProfileCard 
          user={user} 
          isFriend={isFriend} 
          isCurrentUser={isCurrentUser}
          onFriendUpdate={handleFriendUpdate}
        />
        <AboutCard about={user.about} />
      </div>
      <div className="space-y-8 lg:sticky lg:top-[calc(60px+1rem)]">
        <LocationCard location={user.location} />
        <ConnectCard connect={user.connect} />
        <FriendsCard friends={friends} />
      </div>
    </div>
  );
};

export default ProfilePage;
