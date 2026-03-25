import Image from "next/image";

export function UserAvatar({ user, className = "", textClassName = "" }) {
  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  return (
    <div className={`relative overflow-hidden flex items-center justify-center shrink-0 ${className}`}>
      {user.profileAvatar && user.profileAvatar !== "" ? (
        <Image
          src={user.profileAvatar}
          alt={initials}
          fill
          className="object-cover"
          sizes="96px"
        />
      ) : (
        <span className={`font-bold uppercase ${textClassName}`}>
          {initials}
        </span>
      )}
    </div>
  );
}
