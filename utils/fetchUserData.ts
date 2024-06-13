import axios from "axios";

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    // ส่ง token ไปกับคำขอ
    const response = await axios.get("http://localhost:8000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("user data:", response.data.user);
    return true;
  } catch (error) {
    console.error("Error fetching user data", error);
    return false;
  }
};

export default fetchUserData;
