import ProfileForm from "../components/Profile/ProfileForm";

const ProfilePage = () => {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border border-border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center ">Edit Profile</h2>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
