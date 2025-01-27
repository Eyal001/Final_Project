import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "../ui/input";

interface ProfileAvatarProps {
  profilePicture: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: string;
  username?: string | undefined;
}

const ProfileAvatar = ({
  profilePicture,
  onChange,
  size = "h-20 w-20",
  username,
}: ProfileAvatarProps) => {
  return (
    <div className="text-center">
      <Avatar className={`mx-auto rounded-full ${size}`}>
        <AvatarImage
          src={profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
        />
        <AvatarFallback>{username?.charAt(0) || "?"}</AvatarFallback>
      </Avatar>
      {onChange && (
        <div className="mt-4">
          <Input
            type="text"
            id="profilePicture"
            value={profilePicture || ""}
            onChange={onChange}
            placeholder="Profile picture URL"
            className="w-full p-2 mt-2 border rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
