import { fetchCurrentUser, updateProfile } from "@/redux/slices/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";

const useProfileForm = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profilePicture: user?.profilepicture || "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      profilePicture: user?.profilepicture || "",
      currentPassword: "",
      newPassword: "",
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const { username, email, profilePicture, currentPassword, newPassword } =
      formData;

    if (
      username === user?.username &&
      email === user?.email &&
      profilePicture === user?.profilepicture &&
      !newPassword
    ) {
      alert("No changes detected.");
      return;
    }

    if (!currentPassword) {
      alert("Please enter your current password to update your profile.");
      return;
    }

    const resultAction = await dispatch(
      updateProfile({
        username,
        email,
        profilePicture,
        currentPassword,
        newPassword: newPassword || undefined,
      })
    );

    if (updateProfile.fulfilled.match(resultAction)) {
      setSuccessMessage("Profile updated successfully!");
      await dispatch(fetchCurrentUser());
    }
  };

  return {
    formData,
    handleInputChange,
    handleProfileUpdate,
    loading,
    error,
    successMessage,
    user,
  };
};

export default useProfileForm;
