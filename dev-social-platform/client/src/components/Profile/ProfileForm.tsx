import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProfileForm from "@/hooks/useProfileForm";
import ProfileAvatar from "../Shared/ProfileAvatar";

const ProfileForm = () => {
  const {
    formData,
    handleInputChange,
    handleProfileUpdate,
    loading,
    error,
    successMessage,
    user,
  } = useProfileForm();

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      <ProfileAvatar
        profilePicture={formData.profilePicture}
        onChange={handleInputChange}
        username={formData.username}
      />

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type="password"
          id="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="newPassword">New Password (optional)</Label>
        <Input
          type="password"
          id="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          loading ||
          (!formData.currentPassword &&
            formData.username === user?.username &&
            formData.email === user?.email &&
            formData.profilePicture === user?.profilepicture)
        }
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
